import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "shipped", "delivered", "canceled"],  // Added 'canceled'
    default: "pending",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    street:{ type: String, required: true,},
    city:{ type: String, required: true,},
    state:{ type: String},
    zipCode:{ type: String, required: true,},
    country:{ type: String, required: true,},
   
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    imageURL: {
      type: String,
    },
  }],
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid", "refunded"],  // Optional for payment tracking
    default: "unpaid",
  },
  discount: {
    type: Number,
    default: 0,  // Optional field for handling discounts
  },
  taxAmount: {
    type: Number,
    default: 0,  // Optional field for tax calculation
  },
  paymentIntentId: {
    type: String,
  },
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt timestamps
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
