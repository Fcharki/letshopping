import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import { sendEmail } from "../utils/sendEmailVerification.js";

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const sanitizeUser = (user) => {
  const plain = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete plain.password;
  delete plain.verificationToken;
  delete plain.passwordResetToken;
  delete plain.passwordResetExpires;
  return plain;
};

const generateToken = (id, role, name) => {
  return jwt.sign({ id, role, name }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

const frontendUrl = () => process.env.FRONTEND_URL || process.env.BASE_URL || "http://localhost:5173";

//* Register a customer (Admin is pre-created and doesn't use this)
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, address, phone } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already signed up!");
  }

  const verificationToken = uuidv4();

  const createdUser = await User.create({
    name,
    email,
    password,
    address,
    phone,
    role: "customer",
    verificationToken: hashToken(verificationToken),
  });

  let emailSent = true;
  try {
    await sendEmail(email, "verification", { token: verificationToken });
  } catch (error) {
    emailSent = false;
    console.error("Verification email failed:", error.message);
  }

  return res.status(201).json({
    message: emailSent
      ? "Registration successful. Please verify your email."
      : "Registration successful, but the verification email could not be sent. Please request a new one.",
    emailSent,
    user: { id: createdUser._id, name: createdUser.name, email: createdUser.email },
  });
});

//* Authenticate a user (Both admin and customer)
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(400);
    throw new Error("Wrong email or password");
  }

  if (user.active === false) {
    res.status(403);
    throw new Error("This account has been deactivated.");
  }

  if (user.role === "customer" && !user.isVerified) {
    res.status(400);
    throw new Error("Please verify your email before logging in.");
  }

  const redirectTo = user.role === "admin" ? "/admin/dashboard" : "/";

  return res.status(200).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: generateToken(user._id, user.role, user.name),
    redirectTo,
  });
});

//* Return current user info
export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(sanitizeUser(req.user));
});

//* Verify email
export const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.params.token;
  const user = await User.findOne({ verificationToken: hashToken(token) });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token.");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({ message: "Email verified successfully." });
});

//* Request Password Reset
export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = hashToken(resetToken);
    user.passwordResetExpires = Date.now() + 3600000;

    await user.save();

    const resetUrl = `${frontendUrl()}/reset-password/${resetToken}`;

    try {
      await sendEmail(user.email, "reset", { resetUrl });
    } catch (error) {
      console.error("Password reset email failed:", error.message);
    }
  }

  res.status(200).json({
    message: "If an account with that email exists, a password reset link has been sent.",
  });
});

//* Password Reset
export const resetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token.trim();
  const { newPassword } = req.body;

  const user = await User.findOne({
    passwordResetToken: hashToken(token),
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token.");
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password reset successful." });
});

//*! for admin dashboard *//
export const getAllUsersInfo = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "customer" }).select(
    "-password -verificationToken -passwordResetToken -passwordResetExpires"
  );

  res.status(200).json(users);
});

//* get user info for users' profiles *//
export const getUserInfo = asyncHandler(async (req, res) => {
  res.status(200).json(sanitizeUser(req.user));
});

//* Deactivate a customer account
export const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user && user.role === "customer") {
    user.active = false;
    await user.save();
    return res.status(200).json({ message: "User deactivated successfully." });
  }

  res.status(404);
  throw new Error("User not found or invalid role.");
});

//* Activate a customer account
export const activateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user && user.role === "customer") {
    user.active = true;
    await user.save();
    return res.status(200).json({ message: "User activated successfully." });
  }

  res.status(404);
  throw new Error("User not found or invalid role.");
});

//* Delete a customer account
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user || user.role !== "customer") {
    res.status(404);
    throw new Error("User not found or invalid role.");
  }

  await Cart.deleteMany({ userId: user._id });
  await User.findByIdAndDelete(user._id);

  res.status(200).json({ message: "User deleted successfully." });
});

//* Update customer info (Admin action)
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user || user.role !== "customer") {
    res.status(404);
    throw new Error("User not found or invalid role.");
  }

  const { name, email, phone, address } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.address = address || user.address;

  const updatedUser = await user.save();

  res.status(200).json({ message: "User updated successfully.", updatedUser: sanitizeUser(updatedUser) });
});

//* For users -> delete account
export const deleteAccount = asyncHandler(async (req, res) => {
  await Cart.deleteMany({ userId: req.user._id });
  await User.findByIdAndDelete(req.user._id);

  res.status(200).json({ message: "User account deleted successfully" });
});

//* update user password
export const updateAccountPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
});

//* Update User Profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, address, phone } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.address = address || user.address;
  user.phone = phone || user.phone;

  await user.save();

  res.status(200).json({ message: "Profile updated successfully", user: sanitizeUser(user) });
});

//* backend api for the contact us feature
export const contactUs = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  const recipient = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;

  if (!recipient) {
    res.status(500);
    throw new Error("Contact email is not configured.");
  }

  await sendEmail(recipient, "contact", { name, email, message, to: recipient });

  res.status(200).json({ message: "Email sent successfully." });
});
