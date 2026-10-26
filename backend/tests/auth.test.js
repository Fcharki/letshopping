import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { startTestApp, stopTestApp, api, createUser, nextPhone } from "./helpers.js";

let server;
let baseUrl;

before(async () => {
  ({ server, baseUrl } = await startTestApp("auth"));
});

after(async () => {
  await stopTestApp(server);
});

test("registration rejects a weak password", async () => {
  const response = await api(baseUrl, "/api/users/register", {
    method: "POST",
    body: {
      name: "Weak User",
      email: `weak${Date.now()}@example.com`,
      password: "weak",
      address: "123 Test Street",
      phone: nextPhone(),
    },
  });

  assert.equal(response.status, 400);
  assert.match(response.body.message, /password/i);
});

test("registration hashes the password and verification token", async () => {
  const email = `register${Date.now()}@example.com`;
  const response = await api(baseUrl, "/api/users/register", {
    method: "POST",
    body: {
      name: "New User",
      email,
      password: "Passw0rd!",
      address: "123 Test Street",
      phone: nextPhone(),
    },
  });

  assert.equal(response.status, 201);
  assert.equal(response.body.user.email, email);

  const { default: User } = await import("../models/userModel.js");
  const user = await User.findOne({ email });

  assert.ok(user);
  assert.notEqual(user.password, "Passw0rd!");
  assert.match(user.verificationToken, /^[a-f0-9]{64}$/);
});

test("unverified users cannot log in", async () => {
  const email = `unverified${Date.now()}@example.com`;
  await createUser({ email, isVerified: false });

  const response = await api(baseUrl, "/api/users/login", {
    method: "POST",
    body: { email, password: "Passw0rd!" },
  });

  assert.equal(response.status, 400);
  assert.match(response.body.message, /verify/i);
});

test("login rejects a wrong password", async () => {
  const email = `wrongpassword${Date.now()}@example.com`;
  await createUser({ email });

  const response = await api(baseUrl, "/api/users/login", {
    method: "POST",
    body: { email, password: "WrongPassw0rd!" },
  });

  assert.equal(response.status, 400);
});

test("login returns a token and never returns the password", async () => {
  const email = `login${Date.now()}@example.com`;
  await createUser({ email });

  const response = await api(baseUrl, "/api/users/login", {
    method: "POST",
    body: { email, password: "Passw0rd!" },
  });

  assert.equal(response.status, 200);
  assert.ok(response.body.token);
  assert.equal(response.body.user.email, email);
  assert.equal(response.body.user.password, undefined);
});

test("deactivated users cannot log in", async () => {
  const email = `inactive${Date.now()}@example.com`;
  await createUser({ email, active: false });

  const response = await api(baseUrl, "/api/users/login", {
    method: "POST",
    body: { email, password: "Passw0rd!" },
  });

  assert.equal(response.status, 403);
});

test("protected profile endpoints require a token and hide the password", async () => {
  const withoutToken = await api(baseUrl, "/api/users/me");
  assert.equal(withoutToken.status, 401);

  const email = `profile${Date.now()}@example.com`;
  await createUser({ email });
  const loginResponse = await api(baseUrl, "/api/users/login", {
    method: "POST",
    body: { email, password: "Passw0rd!" },
  });

  const withToken = await api(baseUrl, "/api/users/me", {
    token: loginResponse.body.token,
  });

  assert.equal(withToken.status, 200);
  assert.equal(withToken.body.email, email);
  assert.equal(withToken.body.password, undefined);
});

test("password change works and does not double-hash the password", async () => {
  const email = `changepassword${Date.now()}@example.com`;
  await createUser({ email });
  const loginResponse = await api(baseUrl, "/api/users/login", {
    method: "POST",
    body: { email, password: "Passw0rd!" },
  });

  const changeResponse = await api(baseUrl, "/api/users/change-password", {
    method: "PUT",
    token: loginResponse.body.token,
    body: { newPassword: "NewPassw0rd!", confirmPassword: "NewPassw0rd!" },
  });

  assert.equal(changeResponse.status, 200);

  const oldLogin = await api(baseUrl, "/api/users/login", {
    method: "POST",
    body: { email, password: "Passw0rd!" },
  });
  assert.equal(oldLogin.status, 400);

  const newLogin = await api(baseUrl, "/api/users/login", {
    method: "POST",
    body: { email, password: "NewPassw0rd!" },
  });
  assert.equal(newLogin.status, 200);
});

test("password reset stores a hashed token and accepts the raw token", async () => {
  const email = `reset${Date.now()}@example.com`;
  const user = await createUser({ email });

  const rawToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  await user.save();

  const response = await api(baseUrl, `/api/users/reset-password/${rawToken}`, {
    method: "POST",
    body: { newPassword: "ResetPassw0rd!" },
  });

  assert.equal(response.status, 200);

  const loginResponse = await api(baseUrl, "/api/users/login", {
    method: "POST",
    body: { email, password: "ResetPassw0rd!" },
  });

  assert.equal(loginResponse.status, 200);
});

test("password reset request is generic and does not reveal unknown emails", async () => {
  const response = await api(baseUrl, "/api/users/request-password-reset", {
    method: "POST",
    body: { email: `unknown${Date.now()}@example.com` },
  });

  assert.equal(response.status, 200);
  assert.match(response.body.message, /if an account/i);
});
