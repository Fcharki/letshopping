import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import "dotenv/config";

let stripeClient;

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    const error = new Error("Stripe is not configured.");
    error.statusCode = 500;
    throw error;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
};

const isOwnerOrAdmin = (order, user) => {
  const ownerId = order.userId?._id ? order.userId._id : order.userId;
  return user.role === "admin" || ownerId.toString() === user._id.toString();
};

const roundMoney = (value) => Math.round(value * 100) / 100;

const restoreStock = async (items) => {
  for (const item of items) {
    await Product.updateOne(
      { _id: item.productId },
      { $inc: { stockQuantity: item.quantity } }
    );
  }
};

const decrementStock = async (items) => {
  const decremented = [];

  for (const item of items) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.productId, stockQuantity: { $gte: item.quantity } },
      { $inc: { stockQuantity: -item.quantity } },
      { new: true }
    );

    if (!updated) {
      await restoreStock(decremented);
      return { ok: false, productId: item.productId };
    }

    decremented.push(item);
  }

  return { ok: true };
};

//* ADMIN - Get all orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .populate("orderItems.productId", "name price imageURL description");

  res.json(orders);
});

//* CUSTOMER - Get all orders for the current user
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).populate(
    "orderItems.productId",
    "name price imageURL description"
  );

  res.json(orders);
});

//* CUSTOMER - Get orders by status for the current user
export const getMyOrdersByStatus = asyncHandler(async (req, res) => {
  const { status } = req.query;

  if (!status || !["pending", "shipped", "delivered", "canceled"].includes(status)) {
    res.status(400);
    throw new Error("Invalid or missing order status");
  }

  const orders = await Order.find({ userId: req.user._id, status }).populate(
    "orderItems.productId",
    "name price"
  );

  res.json(orders);
});

//* ADMIN - Get orders by status for all users
export const getOrdersByStatus = asyncHandler(async (req, res) => {
  const { status } = req.query;

  if (!status || !["pending", "shipped", "delivered", "canceled"].includes(status)) {
    res.status(400);
    throw new Error("Invalid or missing order status");
  }

  const orders = await Order.find({ status })
    .populate("userId", "name email")
    .populate("orderItems.productId", "name price");

  res.json(orders);
});

//* ADMIN - Update order status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;
  await order.save();

  res.json({ message: `Order status updated to ${status}`, order });
});

//* CUSTOMER/ADMIN - Cancel an order and return stock
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (!isOwnerOrAdmin(order, req.user)) {
    res.status(403);
    throw new Error("Not authorized to cancel this order");
  }

  if (order.status === "canceled") {
    return res.json({ message: "Order is already canceled", order });
  }

  if (order.status === "delivered") {
    res.status(400);
    throw new Error("Delivered orders cannot be canceled");
  }

  await restoreStock(order.orderItems);

  order.status = "canceled";
  await order.save();

  res.json({ message: "Order has been canceled and stock returned", order });
});

//* CUSTOMER/ADMIN - Reactivate a canceled order
export const activateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (!isOwnerOrAdmin(order, req.user)) {
    res.status(403);
    throw new Error("Not authorized to activate this order");
  }

  if (order.status !== "canceled") {
    res.status(400);
    throw new Error("Only canceled orders can be activated");
  }

  const result = await decrementStock(order.orderItems);
  if (!result.ok) {
    res.status(400);
    throw new Error("Insufficient stock to reactivate this order");
  }

  order.status = "pending";
  await order.save();

  res.json({ message: "Order has been activated and stock reserved", order });
});

//* Place an order
export const placeOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { shippingAddress } = req.body;

  const cart = await Cart.findOne({ userId }).populate(
    "items.productId",
    "name price stockQuantity description imageURL"
  );

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Your cart is empty");
  }

  const orderItems = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const product = item.productId;
    if (!product) {
      res.status(400);
      throw new Error("A product in your cart is no longer available");
    }

    if (product.stockQuantity < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    subtotal += product.price * item.quantity;
    orderItems.push({
      productId: product._id,
      name: product.name,
      description: product.description,
      imageURL: product.imageURL,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const taxAmount = roundMoney(subtotal * 0.1);
  const discount = 0;
  const totalAmount = roundMoney(subtotal + taxAmount - discount);

  const result = await decrementStock(orderItems);
  if (!result.ok) {
    res.status(400);
    throw new Error("Insufficient stock for one or more products");
  }

  let newOrder;
  try {
    newOrder = await Order.create({
      userId,
      shippingAddress,
      totalAmount,
      orderItems,
      taxAmount,
      discount,
    });
  } catch (error) {
    await restoreStock(orderItems);
    throw error;
  }

  await Cart.findOneAndDelete({ userId });

  return res.status(201).json({
    message: "Order placed successfully",
    order: newOrder,
  });
});

//* ADMIN - Permanently delete a canceled order
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (!isOwnerOrAdmin(order, req.user)) {
    res.status(403);
    throw new Error("Not authorized to delete this order");
  }

  if (order.status !== "canceled") {
    res.status(403);
    throw new Error("Only canceled orders can be deleted");
  }

  await order.deleteOne();

  res.status(200).json({ message: "Order Deleted Successfully" });
});

//* CUSTOMER - Create a payment intent for an existing order
export const payment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (!isOwnerOrAdmin(order, req.user)) {
    res.status(403);
    throw new Error("Not authorized to pay for this order");
  }

  if (order.paymentStatus === "paid") {
    res.status(400);
    throw new Error("Order is already paid");
  }

  const amount = Math.round(order.totalAmount * 100);

  const paymentIntent = await getStripe().paymentIntents.create({
    amount,
    currency: "usd",
    payment_method_types: ["card"],
    metadata: {
      orderId: order._id.toString(),
      userId: order.userId.toString(),
    },
  });

  order.paymentIntentId = paymentIntent.id;
  await order.save();

  res.send({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
});

//* CUSTOMER - Confirm a payment by verifying it with Stripe
export const confirmPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentIntentId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (!isOwnerOrAdmin(order, req.user)) {
    res.status(403);
    throw new Error("Not authorized to confirm payment for this order");
  }

  const intentId = paymentIntentId || order.paymentIntentId;
  if (!intentId) {
    res.status(400);
    throw new Error("No payment intent found for this order");
  }

  const intent = await getStripe().paymentIntents.retrieve(intentId);

  if (intent.status !== "succeeded") {
    res.status(400);
    throw new Error("Payment has not succeeded");
  }

  if (intent.metadata?.orderId !== order._id.toString()) {
    res.status(400);
    throw new Error("Payment does not belong to this order");
  }

  if (intent.amount !== Math.round(order.totalAmount * 100)) {
    res.status(400);
    throw new Error("Payment amount does not match the order total");
  }

  order.paymentStatus = "paid";
  await order.save();

  res.json({ message: "Payment confirmed successfully", order });
});

//* ADMIN - Manually update the payment status
export const updateOrderPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { paymentStatus } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.paymentStatus = paymentStatus;
  await order.save();

  res.json({ message: "Order payment status updated successfully", order });
});
