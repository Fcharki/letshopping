import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import {    addCategory, getCategories, getCategoryDetails, 
                            updateCategory, deleteCategory 
                                    } from '../controllers/categoryController.js';
export const categoryRouter = express.Router();

// Admin routes
categoryRouter.post('/categories', protect, admin, addCategory);
categoryRouter.get('/categories', getCategories);  
categoryRouter.get('/categories/:id', protect, admin, getCategoryDetails);  
categoryRouter.put('/categories/:id', protect, admin, updateCategory);
categoryRouter.delete('/categories/:id', protect, admin, deleteCategory);


