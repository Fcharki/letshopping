import Category from '../models/categoryModel.js';
import asyncHandler from 'express-async-handler';

// Add a new category
export const addCategory = asyncHandler(async (req, res) => {
  const { name, description, imageURL } = req.body;

  if (!name || !description || !imageURL) {
    return res.status(400).json({ message: 'All fields are required' });
  }  

  // Create and save the new category
  const newCategory = await Category.create({ name,  description, imageURL });

  res.status(201).json(newCategory);
});

// List all categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json(categories);
});

// get the category's details
export const getCategoryDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const neededCategory = await Category.findById(id);
   
  if (!neededCategory) {
    return res.status(404).json({ message: 'Category not found' });
  }
  
    // Return category details
    res.status(200).json({
      category: {
        _id: neededCategory._id,
        name: neededCategory.name,
        description: neededCategory.description,
        imageURL: neededCategory.imageURL,
      }
    });
})

// Update a category
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, imageURL } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  const category = await Category.findByIdAndUpdate(id, { name, description, imageURL }, { new: true });

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.status(200).json(category);
});

// Delete a category
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.status(200).json({ message: 'Category deleted' });
});
