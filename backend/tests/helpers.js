import "dotenv/config";
import { once } from "node:events";
import mongoose from "mongoose";

let phoneCounter = 1000000000;

export const nextPhone = () => String(phoneCounter++);

export async function startTestApp(dbName) {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
  process.env.LOCAL_MONGODB_URL = `mongodb://127.0.0.1:27017/letshop_test_${dbName}`;
  delete process.env.CLOUD_MONGODB_URL;

  const { connectDB } = await import("../config/db.js");
  await connectDB();

  const { default: app } = await import("../app.js");
  const server = app.listen(0);
  await once(server, "listening");

  const { port } = server.address();
  return { server, baseUrl: `http://127.0.0.1:${port}` };
}

export async function stopTestApp(server) {
  const closed = new Promise((resolve) => server.close(resolve));
  if (typeof server.closeAllConnections === "function") {
    server.closeAllConnections();
  }
  await closed;
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
}

export async function api(baseUrl, path, { method = "GET", token, body, headers = {} } = {}) {
  const requestHeaders = { ...headers };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return {
    status: response.status,
    body: data,
    headers: response.headers,
  };
}

export async function createUser({
  name = "Test User",
  email,
  password = "Passw0rd!",
  role = "customer",
  isVerified = true,
  active = true,
  phone = nextPhone(),
} = {}) {
  const { default: User } = await import("../models/userModel.js");
  return User.create({
    name,
    email,
    password,
    address: "123 Test Street",
    phone,
    role,
    isVerified,
    active,
  });
}

export async function createProduct({
  name,
  price = 10,
  stockQuantity = 5,
  categoryName = "Test Category",
} = {}) {
  const { default: Product } = await import("../models/productModel.js");
  return Product.create({
    name: name || `Product ${Date.now()}`,
    description: "A product used for automated tests",
    price,
    stockQuantity,
    categoryName,
    imageURL: "https://example.com/image.jpg",
  });
}

export async function login(baseUrl, email, password = "Passw0rd!") {
  return api(baseUrl, "/api/users/login", {
    method: "POST",
    body: { email, password },
  });
}
