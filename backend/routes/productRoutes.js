import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  productSchema,
  searchSchema,
  stockAmountSchema,
} from "../requests/userInputsValidation.js";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  increaseStock,
  decreaseStock,
  getLowStockProducts,
  getProductsByCategory,
  searchProduct,
} from "../controllers/productController.js";

export const productRouter = express.Router();

// Public routes for customers
productRouter.get("/products", getProducts);
productRouter.get("/products/low-stock", protect, admin, getLowStockProducts);
productRouter.get("/products/:id", getProductById);
productRouter.post("/search", validate(searchSchema), searchProduct);
productRouter.get("/category/:category", getProductsByCategory);

// Admin routes for product management
productRouter.post("/products", protect, admin, validate(productSchema), addProduct);
productRouter.put("/products/:id", protect, admin, validate(productSchema), updateProduct);
productRouter.delete("/products/:id", protect, admin, deleteProduct);

// Admin routes for stock management
productRouter.put(
  "/products/:id/increase-stock",
  protect,
  admin,
  validate(stockAmountSchema),
  increaseStock
);
productRouter.put(
  "/products/:id/decrease-stock",
  protect,
  admin,
  validate(stockAmountSchema),
  decreaseStock
);
