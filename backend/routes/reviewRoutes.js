import express from "express";
import {
  addReview,
  getReviews,
  getAllReviews,
  updateReview,
  deleteReview,
  countGlobalRating,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import { validate } from "../middleware/validate.js";
import { reviewSchema } from "../requests/userInputsValidation.js";

const reviewRouter = express.Router();

reviewRouter.get("/admin/reviews", protect, admin, getAllReviews);
reviewRouter.post("/products/:id/review", protect, validate(reviewSchema), addReview);
reviewRouter.put(
  "/products/:productId/reviews/:id",
  protect,
  validate(reviewSchema),
  updateReview
);
reviewRouter.delete("/products/:productId/reviews/:id", protect, deleteReview);
reviewRouter.get("/products/:id/reviews", getReviews);
reviewRouter.get("/products/:productId/global-rating", countGlobalRating);

export default reviewRouter;
