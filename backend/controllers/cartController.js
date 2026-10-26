import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

//* Add a product to the cart
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  const requestedQuantity = (existingItem?.quantity || 0) + quantity;

  if (requestedQuantity > product.stockQuantity) {
    res.status(400);
    throw new Error(`Only ${product.stockQuantity} item(s) available in stock`);
  }

  if (existingItem) {
    existingItem.quantity = requestedQuantity;
    existingItem.price = product.price;
  } else {
    cart.items.push({
      productId,
      quantity,
      price: product.price,
    });
  }

  cart.updatedAt = Date.now();
  await cart.save();

  res.status(200).json({ message: "Product added to cart", cart });
});

//* Get the user's cart items
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate(
    "items.productId",
    "name price imageURL"
  );

  if (!cart) {
    return res.status(200).json({ message: "Cart not found or empty", items: [] });
  }

  return res.status(200).json(cart);
});

//* Remove an item from the cart
export const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const itemExists = cart.items.some((item) => item._id.toString() === itemId);
  if (!itemExists) {
    res.status(404);
    throw new Error("Item not found in cart");
  }

  cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
  cart.updatedAt = Date.now();
  await cart.save();

  return res.status(200).json(cart);
});
