import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { cartItemSchema } from "../requests/userInputsValidation.js";

const cartRouter = express.Router();

cartRouter.post("/cart", protect, validate(cartItemSchema), addToCart);
cartRouter.get("/cart", protect, getCart);
cartRouter.delete("/cart/:itemId", protect, removeFromCart);

export default cartRouter;
