import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { startTestApp, stopTestApp, api, createProduct } from "./helpers.js";

let server;
let baseUrl;

before(async () => {
  ({ server, baseUrl } = await startTestApp("api"));
  await createProduct({ name: `API Product ${Date.now()}` });
});

after(async () => {
  await stopTestApp(server);
});

test("unknown routes return a JSON 404", async () => {
  const response = await api(baseUrl, "/api/does-not-exist");

  assert.equal(response.status, 404);
  assert.match(response.body.message, /route not found/i);
});

test("invalid ObjectId parameters are rejected with 400", async () => {
  const response = await api(baseUrl, "/api/products/not-a-valid-id");

  assert.equal(response.status, 400);
  assert.match(response.body.message, /invalid/i);
});

test("GET /api/products/low-stock is not treated as a product id", async () => {
  const response = await api(baseUrl, "/api/products/low-stock");

  assert.equal(response.status, 401);
});

test("product listing is public", async () => {
  const response = await api(baseUrl, "/api/products");

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
  assert.ok(response.body.length >= 1);
});

test("search escapes regular expression characters", async () => {
  const response = await api(baseUrl, "/api/search", {
    method: "POST",
    body: { keyword: "(" },
  });

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
});

test("contact form validates its input", async () => {
  const response = await api(baseUrl, "/api/contact", {
    method: "POST",
    body: { name: "A", email: "not-an-email", message: "hi" },
  });

  assert.equal(response.status, 400);
});

test("protected cart routes reject anonymous requests", async () => {
  const response = await api(baseUrl, "/api/cart");

  assert.equal(response.status, 401);
});

test("CORS rejects unknown origins and allows configured ones", async () => {
  const rejected = await api(baseUrl, "/api/products", {
    headers: { Origin: "http://evil.example.com" },
  });
  assert.equal(rejected.status, 403);

  const allowed = await api(baseUrl, "/api/products", {
    headers: { Origin: "http://localhost:5173" },
  });
  assert.equal(allowed.status, 200);
  assert.equal(
    allowed.headers.get("access-control-allow-origin"),
    "http://localhost:5173"
  );
});

test("admin-only product creation requires authentication", async () => {
  const response = await api(baseUrl, "/api/products", {
    method: "POST",
    body: {
      name: "New Product",
      description: "A product created without a token",
      price: 5,
      stockQuantity: 1,
      categoryName: "Test Category",
      imageURL: "https://example.com/image.jpg",
    },
  });

  assert.equal(response.status, 401);
});
