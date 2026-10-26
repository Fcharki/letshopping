import express from 'express';
import {    
    createBanner, getBanners, updateBanner, 
                    deleteBanner, getBannerById } 
                            from '../controllers/bannersController.js';
import { admin } from '../middleware/adminMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const bannerRouter = express.Router();

// Route for creating a banner
bannerRouter.post('/', protect, admin, createBanner);

// Route for getting all banners
bannerRouter.get('/', getBanners); 

// Route for updating a banner
bannerRouter.put('/:id', protect, admin, updateBanner);

bannerRouter.get('/:id', getBannerById); // New route to get a banner by ID

// Route for deleting a banner
bannerRouter.delete('/:id', protect, admin, deleteBanner);

export default bannerRouter;
