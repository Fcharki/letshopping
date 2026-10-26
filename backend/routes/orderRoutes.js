import express from "express";
import {
  getAllOrders,
  getMyOrders,
  getMyOrdersByStatus,
  getOrdersByStatus,
  updateOrderStatus,
  cancelOrder,
  activateOrder,
  deleteOrder,
  placeOrder,
  payment,
  confirmPayment,
  updateOrderPaymentStatus,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  placeOrderSchema,
  orderStatusSchema,
  paymentStatusSchema,
  paymentIntentSchema,
  confirmPaymentSchema,
} from "../requests/userInputsValidation.js";

export const orderRouter = express.Router();

//! Admin routes (Admin only)
orderRouter.route("/").get(protect, admin, getAllOrders);
orderRouter.route("/status").get(protect, admin, getOrdersByStatus);
orderRouter.route("/:id/status").put(protect, admin, validate(orderStatusSchema), updateOrderStatus);
orderRouter.put(
  "/update-payment-status/:orderId",
  protect,
  admin,
  validate(paymentStatusSchema),
  updateOrderPaymentStatus
);

//! Customer routes
orderRouter.route("/myorders").get(protect, getMyOrders);
orderRouter.route("/myorders/status").get(protect, getMyOrdersByStatus);
orderRouter.route("/place-order").post(protect, validate(placeOrderSchema), placeOrder);
orderRouter.route("/create-payment-intent").post(protect, validate(paymentIntentSchema), payment);
orderRouter.route("/confirm-payment").post(protect, validate(confirmPaymentSchema), confirmPayment);
orderRouter.route("/:id/cancel").put(protect, cancelOrder);
orderRouter.route("/:id/activate").put(protect, activateOrder);
orderRouter.route("/:id").delete(protect, deleteOrder);
