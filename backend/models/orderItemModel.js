import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

export default OrderItem;
