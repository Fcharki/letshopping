import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { startTestApp, stopTestApp, api, createUser, createProduct, login } from "./helpers.js";

let server;
let baseUrl;
let adminToken;
let userAToken;
let userBToken;
let userA;
let product;
let orderId;

const shippingAddress = {
  street: "1 Main Street",
  city: "Casablanca",
  zipCode: "20000",
  country: "Morocco",
};

const addToCart = (token, quantity) =>
  api(baseUrl, "/api/cart", {
    method: "POST",
    token,
    body: { productId: product._id.toString(), quantity },
  });

const placeOrder = (token) =>
  api(baseUrl, "/api/orders/place-order", {
    method: "POST",
    token,
    body: { shippingAddress },
  });

const currentStock = async () => {
  const { default: Product } = await import("../models/productModel.js");
  const fresh = await Product.findById(product._id);
  return fresh.stockQuantity;
};

before(async () => {
  ({ server, baseUrl } = await startTestApp("orders"));

  await createUser({
    email: `admin${Date.now()}@example.com`,
    role: "admin",
  });

  userA = await createUser({ email: `usera${Date.now()}@example.com` });
  await createUser({ email: `userb${Date.now()}@example.com` });

  product = await createProduct({
    name: `Order Product ${Date.now()}`,
    price: 10,
    stockQuantity: 5,
  });

  const { default: User } = await import("../models/userModel.js");
  const admin = await User.findOne({ role: "admin" });

  adminToken = (await login(baseUrl, admin.email)).body.token;
  userAToken = (await login(baseUrl, userA.email)).body.token;
  const userB = await User.findOne({ role: "customer", _id: { $ne: userA._id } });
  userBToken = (await login(baseUrl, userB.email)).body.token;
});

after(async () => {
  await stopTestApp(server);
});

test("cart stores the unit price and rejects quantities above stock", async () => {
  const response = await addToCart(userAToken, 2);
  assert.equal(response.status, 200);
  assert.equal(response.body.cart.items[0].price, 10);

  const overstock = await addToCart(userAToken, 99);
  assert.equal(overstock.status, 400);
  assert.match(overstock.body.message, /stock/i);
});

test("place order validates the shipping address", async () => {
  const response = await api(baseUrl, "/api/orders/place-order", {
    method: "POST",
    token: userAToken,
    body: { shippingAddress: { street: "1 Main Street" } },
  });

  assert.equal(response.status, 400);
});

test("placing an order computes the total and decrements stock", async () => {
  const response = await placeOrder(userAToken);

  assert.equal(response.status, 201);
  assert.equal(response.body.order.totalAmount, 22);
  assert.equal(await currentStock(), 3);

  orderId = response.body.order._id;
});

test("another customer cannot cancel someone else's order", async () => {
  const response = await api(baseUrl, `/api/orders/${orderId}/cancel`, {
    method: "PUT",
    token: userBToken,
  });

  assert.equal(response.status, 403);
  assert.equal(await currentStock(), 3);
});

test("canceling an order restores stock exactly once", async () => {
  const first = await api(baseUrl, `/api/orders/${orderId}/cancel`, {
    method: "PUT",
    token: userAToken,
  });
  assert.equal(first.status, 200);
  assert.equal(first.body.order.status, "canceled");
  assert.equal(await currentStock(), 5);

  const second = await api(baseUrl, `/api/orders/${orderId}/cancel`, {
    method: "PUT",
    token: userAToken,
  });
  assert.equal(second.status, 200);
  assert.equal(await currentStock(), 5);
});

test("another customer cannot activate an order and activation reserves stock", async () => {
  const forbidden = await api(baseUrl, `/api/orders/${orderId}/activate`, {
    method: "PUT",
    token: userBToken,
  });
  assert.equal(forbidden.status, 403);

  const response = await api(baseUrl, `/api/orders/${orderId}/activate`, {
    method: "PUT",
    token: userAToken,
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.order.status, "pending");
  assert.equal(await currentStock(), 3);

  const again = await api(baseUrl, `/api/orders/${orderId}/activate`, {
    method: "PUT",
    token: userAToken,
  });
  assert.equal(again.status, 400);
  assert.equal(await currentStock(), 3);
});

test("only canceled orders can be deleted, by the owner or an admin", async () => {
  const activeDelete = await api(baseUrl, `/api/orders/${orderId}`, {
    method: "DELETE",
    token: userAToken,
  });
  assert.equal(activeDelete.status, 403);

  const foreignCancel = await api(baseUrl, `/api/orders/${orderId}/cancel`, {
    method: "PUT",
    token: userBToken,
  });
  assert.equal(foreignCancel.status, 403);

  const cancel = await api(baseUrl, `/api/orders/${orderId}/cancel`, {
    method: "PUT",
    token: userAToken,
  });
  assert.equal(cancel.status, 200);

  const foreignDelete = await api(baseUrl, `/api/orders/${orderId}`, {
    method: "DELETE",
    token: userBToken,
  });
  assert.equal(foreignDelete.status, 403);

  const del = await api(baseUrl, `/api/orders/${orderId}`, {
    method: "DELETE",
    token: userAToken,
  });
  assert.equal(del.status, 200);
});

test("payment status can only be changed manually by an admin", async () => {
  await addToCart(userAToken, 1);
  const placed = await placeOrder(userAToken);
  assert.equal(placed.status, 201);

  const newOrderId = placed.body.order._id;

  const customerAttempt = await api(
    baseUrl,
    `/api/orders/update-payment-status/${newOrderId}`,
    {
      method: "PUT",
      token: userAToken,
      body: { paymentStatus: "paid" },
    }
  );
  assert.equal(customerAttempt.status, 403);

  const adminAttempt = await api(
    baseUrl,
    `/api/orders/update-payment-status/${newOrderId}`,
    {
      method: "PUT",
      token: adminToken,
      body: { paymentStatus: "paid" },
    }
  );
  assert.equal(adminAttempt.status, 200);
  assert.equal(adminAttempt.body.order.paymentStatus, "paid");
});

test("customers cannot list every order", async () => {
  const response = await api(baseUrl, "/api/orders", { token: userAToken });
  assert.equal(response.status, 403);
});

test("payment intents are protected by order ownership and existence", async () => {
  const missingOrder = await api(baseUrl, "/api/orders/create-payment-intent", {
    method: "POST",
    token: userAToken,
    body: { orderId: "000000000000000000000000" },
  });
  assert.equal(missingOrder.status, 404);

  await addToCart(userAToken, 1);
  const placed = await placeOrder(userAToken);
  assert.equal(placed.status, 201);

  const forbidden = await api(baseUrl, "/api/orders/create-payment-intent", {
    method: "POST",
    token: userBToken,
    body: { orderId: placed.body.order._id },
  });
  assert.equal(forbidden.status, 403);
});

test("checkout fails when stock changed after the item was added to the cart", async () => {
  const { default: Product } = await import("../models/productModel.js");
  await Product.updateOne({ _id: product._id }, { stockQuantity: 5 });

  const added = await addToCart(userAToken, 2);
  assert.equal(added.status, 200);

  await Product.updateOne({ _id: product._id }, { stockQuantity: 0 });

  const response = await placeOrder(userAToken);

  assert.equal(response.status, 400);
  assert.match(response.body.message, /stock/i);
});

test("placing an order with an empty cart fails", async () => {
  const response = await placeOrder(userBToken);

  assert.equal(response.status, 400);
  assert.match(response.body.message, /cart is empty/i);
});
