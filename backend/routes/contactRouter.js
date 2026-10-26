import express from "express";
import { contactUs } from "../controllers/userController.js";
import { validate } from "../middleware/validate.js";
import { createRateLimiter } from "../middleware/rateLimiter.js";
import { contactSchema } from "../requests/userInputsValidation.js";

const contactRouter = express.Router();

const contactLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: "Too many contact requests, please try again later.",
});

contactRouter.post("/api/contact", contactLimiter, validate(contactSchema), contactUs);

export default contactRouter;
