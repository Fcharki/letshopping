import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Review from "../models/reviewModel.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const ensureCategoryExists = async (categoryName) => {
  const category = await Category.findOne({ name: categoryName });
  if (!category) {
    const error = new Error("Invalid category name");
    error.statusCode = 400;
    throw error;
  }
};

// Add a new product
export const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stockQuantity, categoryName, imageURL } = req.body;

  await ensureCategoryExists(categoryName);

  const newProduct = await Product.create({
    name,
    description,
    price,
    stockQuantity,
    categoryName,
    imageURL,
  });

  res.status(201).json(newProduct);
});

// List all products (Admin and Customers)
export const getProducts = asyncHandler(async (req, res) => {
  const { categoryName, search } = req.query;

  const query = {};

  if (categoryName) {
    query.categoryName = categoryName;
  }

  if (search) {
    query.name = { $regex: escapeRegex(search), $options: "i" };
  }

  const products = await Product.find(query);

  res.status(200).json(products);
});

// Get details of a single product, including customer reviews
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const reviews = await Review.find({ productId: id }).populate("userId", "name");

  res.status(200).json({
    product: {
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageURL: product.imageURL,
      categoryName: product.categoryName,
      category: product.categoryName,
    },
    reviews,
  });
});

//* Update a product
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  await ensureCategoryExists(updates.categoryName);

  const product = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json(product);
});

// Delete a product
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await Review.deleteMany({ productId: id });

  res.status(200).json({ message: "Product deleted" });
});

// Increase stock quantity for a product
export const increaseStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const product = await Product.findByIdAndUpdate(
    id,
    { $inc: { stockQuantity: amount } },
    { new: true }
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({ message: "Stock increased", product });
});

// Decrease stock quantity for a product
export const decreaseStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const product = await Product.findOneAndUpdate(
    { _id: id, stockQuantity: { $gte: amount } },
    { $inc: { stockQuantity: -amount } },
    { new: true }
  );

  if (!product) {
    const exists = await Product.exists({ _id: id });
    if (!exists) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.status(400);
    throw new Error("Insufficient stock");
  }

  res.status(200).json({ message: "Stock decreased", product });
});

//* Get products with low stock
export const getLowStockProducts = asyncHandler(async (req, res) => {
  const parsed = parseInt(req.query.threshold, 10);
  const threshold = Number.isNaN(parsed) ? 10 : parsed;

  const lowStockProducts = await Product.find({
    stockQuantity: { $lte: threshold },
  });

  res.status(200).json(lowStockProducts);
});

//* Search product
export const searchProduct = asyncHandler(async (req, res) => {
  const { keyword } = req.body;
  const safeKeyword = escapeRegex(keyword);

  const products = await Product.find({
    $or: [
      { name: { $regex: safeKeyword, $options: "i" } },
      { description: { $regex: safeKeyword, $options: "i" } },
    ],
  });

  res.status(200).json(products);
});

//* Get products by categories
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  const products = await Product.find({ categoryName: category });

  if (!products.length) {
    res.status(404);
    throw new Error("No products found for this category");
  }

  res.status(200).json(products);
});
