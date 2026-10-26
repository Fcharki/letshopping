import asyncHandler from 'express-async-handler';
import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
import mongoose from 'mongoose';


//* Get all reviews (for admin dashboard)
export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('productId', 'name imageURL') // Fetch product details for each review
    .populate('userId', 'name email') // Fetch user details for each review
    .sort({ reviewDate: -1 }); // Sort reviews by date, latest first

  if (reviews.length === 0) {
    return res.status(404).json({ message: 'No reviews found' });
  }

  res.json(reviews);
});

// Add a product review
export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { id: productId } = req.params;
  const userId = req.user._id; // Get user from the `protect` middleware
  
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if the user has already submitted a review for this product
  const existingReview = await Review.findOne({ productId, userId });
  
  if (existingReview) {
    return res.status(400).json({
      message: 'You have already reviewed this product.',
    });
  }

  // Create a new review
  const review = new Review({
    productId,
    userId,
    rating,
    comment,
    reviewDate: new Date(),
  });

  // Save the review
  await review.save();

  // Optionally, update the product model to include the new review
  await Product.findByIdAndUpdate(
    productId,
    { $push: { reviews: review._id } }
  );

  res.status(201).json({
    message: 'Review added successfully.',
    review,
  });
});


//* Update a product review
export const updateReview = asyncHandler(async (req, res) => {
    const { id: reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id; 
  
    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
  
    // Check if the review belongs to the current user
    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }
  
    // Update the review
    review.rating = rating;
    review.comment = comment;
    review.reviewDate = new Date(); // Optionally update review date
  
    await review.save();
  
    res.json({
      message: 'Review updated successfully',
      review,
    });
  });

  
//* Delete a product review
export const deleteReview = asyncHandler(async (req, res) => {
  const { id: reviewId } = req.params;
  const userId = req.user._id; 

  // Find the review
  const review = await Review.findById(reviewId);
  if (!review) {
      return res.status(404).json({ message: 'Review not found' });
  }

  // Check if the user is the owner of the review or an admin
  if (review.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
  }

  // Delete the review
  await review.deleteOne();

  // Optionally, update the product model to remove the review reference
  await Product.findByIdAndUpdate(
      review.productId,
      { $pull: { reviews: reviewId } }
  );

  res.json({
      message: 'Review deleted successfully',
  });
});


//* List all reviews for a product
export const getReviews = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;

  const reviews = await Review.find({ productId })
    .populate('userId', 'name email')  // Fetch user details for each review
    .sort({ reviewDate: -1 }); // Sort reviews by date, latest first

  if (reviews.length === 0) {
    return res.status(404).json({ message: 'No reviews found for this product' });
  }

  res.json(reviews);
});


//* count global rating
export const countGlobalRating = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Validate productId format
  if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid Product ID' });
  }

  try {
    const objectId = new mongoose.Types.ObjectId(productId);

    const globalRating = await Review.aggregate([
      {
        $match: { productId: objectId },
      },
      {
        $group: {
          _id: null,
          totalRating: { $sum: '$rating' },
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);


    if (!globalRating || globalRating.length === 0) {
      return res.status(200).json({ globalRating: 0, count: 0 });
    }

    res.status(200).json({
      globalRating: globalRating[0].avgRating,
      count: globalRating[0].count,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to calculate global rating', error: err.message });
  }
});

