import mongoose from 'mongoose';

// define a cart schema to track the items in the user's cart 
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  items: [
    {
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
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Method to add or update an item in the cart
cartSchema.methods.addItem = async function(productId, quantity, price) {
  const cart = this;
  const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());

  if (existingItemIndex > -1) {
    // If item exists, update the quantity
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // If item doesn't exist, add a new one
    cart.items.push({ productId, quantity, price });
  }

  cart.updatedAt = Date.now();
  return cart.save();
};

// Method to remove an item from the cart
cartSchema.methods.removeItem = async function(itemId) {
  const cart = this;
  cart.items = cart.items.filter(item => item._id.toString() !== itemId.toString());
  cart.updatedAt = Date.now();
  return cart.save();
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
