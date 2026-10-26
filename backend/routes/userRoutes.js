import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";
import {
  signUpSchema,
  loginSchema,
  passwordChangeSchema,
  resetPasswordSchema,
  profileUpdateSchema,
  emailOnlySchema,
} from "../requests/userInputsValidation.js";
import {
  registerUser,
  loginUser,
  getMe,
  getUserInfo,
  verifyEmail,
  getAllUsersInfo,
  deactivateUser,
  activateUser,
  deleteUser,
  updateUser,
  requestPasswordReset,
  resetPassword,
  deleteAccount,
  updateAccountPassword,
  updateUserProfile,
} from "../controllers/userController.js";

export const userRouter = express.Router();

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many authentication attempts, please try again later.",
});

const passwordResetLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many password reset attempts, please try again later.",
});

// Public routes
userRouter.post("/register", authLimiter, validate(signUpSchema), registerUser);
userRouter.post("/login", authLimiter, validate(loginSchema), loginUser);
userRouter.get("/verify-email/:token", verifyEmail);
userRouter.post(
  "/request-password-reset",
  passwordResetLimiter,
  validate(emailOnlySchema),
  requestPasswordReset
);
userRouter.post(
  "/reset-password/:token",
  passwordResetLimiter,
  validate(resetPasswordSchema),
  resetPassword
);

// Protected routes (auth required)
userRouter.get("/me", protect, getMe);
userRouter.get("/profile", protect, getUserInfo);
userRouter.delete("/delete-account", protect, deleteAccount);
userRouter.put(
  "/change-password",
  protect,
  validate(passwordChangeSchema),
  updateAccountPassword
);
userRouter.put(
  "/update-profile",
  protect,
  validate(profileUpdateSchema),
  updateUserProfile
);

// Admin routes
userRouter.get("/admin/customers", protect, admin, getAllUsersInfo);
userRouter.put("/admin/customers/:id/deactivate", protect, admin, deactivateUser);
userRouter.put("/admin/customers/:id/activate", protect, admin, activateUser);
userRouter.delete("/admin/customers/:id", protect, admin, deleteUser);
userRouter.put("/admin/customers/:id", protect, admin, updateUser);

// Send the user inputs of signup schema to the frontend
userRouter.get("/validation-schema", (req, res) => {
  const schema = {
    name: { type: "string", required: true },
    email: {
      type: "string",
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      messages: {
        pattern:
          "The email address is not valid. Here is an example of a valid email: example@gmail.com.",
      },
      required: true,
    },
    password: {
      type: "string",
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      messages: {
        pattern:
          "The password must contain at least 8 characters, including at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&).",
      },
      required: true,
    },
    address: { type: "string", required: true },
    phone: {
      type: "string",
      required: true,
      length: 10,
      messages: {
        pattern: "The phone number must contain at least 10 digits.",
      },
    },
    role: { type: "string", valid: ["customer", "admin"] },
  };

  res.json(schema);
});
