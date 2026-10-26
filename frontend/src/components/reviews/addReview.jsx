import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StarRating from '../reviews/starRating';

const apiUrl = import.meta.env.VITE_APP_API_URL
const AddReview = ({ productId, existingReview, onEditComplete, userHasReviewed }) => {
  const [review, setReview] = useState({ rating: 0, comment: '' });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    // Populate fields if an existing review is provided
    if (existingReview) {
      setReview({ rating: existingReview.rating, comment: existingReview.comment });
      setIsEditing(true);
    } else {
      setReview({ rating: 0, comment: '' });
      setIsEditing(false);
    }

    // Check if the user has already reviewed
    setShowMessage(userHasReviewed);
  }, [existingReview, userHasReviewed]);

  const handleRatingChange = (newRating) => {
    setReview({ ...review, rating: newRating });
  };

  const handleCommentChange = (e) => {
    const newComment = e.target.value;
    if (newComment.length <= 500) {
      setReview({ ...review, comment: newComment });
      setCommentError('');
    } else {
      setCommentError('Comment cannot exceed 500 characters');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      // Notify the user they need to log in
      toast.error('❌ You need to be logged in to leave a review!');
      return;
    }

    // Check if rating is provided
    if (review.rating <= 0) {
      toast.error('❌ Please select a rating before submitting your review!');
      return; // Prevent submission if no rating
    }

    // If there's an error with the comment length, prevent submission
    if (commentError) {
      toast.error('❌ Please fix the comment length before submitting!');
      return;
    }

    setLoading(true); // Start loading when submitting

    try {
      const token = localStorage.getItem('token');
      const method = isEditing ? 'put' : 'post'; // Determine if we're editing
      const url = isEditing
        ? `${apiUrl}/api/products/${productId}/reviews/${existingReview._id}` 
        : `${apiUrl}/api/products/${productId}/review`;

      await axios[method](url, review, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setTimeout(() => {
        toast.success(`🎉 Review ${isEditing ? 'updated' : 'added'} successfully!`);
      }, 200);

      // Reset form after successful submission
      setReview({ rating: 0, comment: '' });
      setIsEditing(false);
      if (onEditComplete) onEditComplete(); // Callback to notify parent component
    } catch (error) {
      toast.error('❌ ' + error.response?.data?.message || error.message);
    } finally {
      setLoading(false); // Always set loading to false after completion
    }
  };

  // Cancel editing and reset the form
  const handleCancel = () => {
    setReview({ rating: 0, comment: '' });
    setIsEditing(false);
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mt-5 shadow-sm mb-2">
        {isEditing ? 'Edit Review' : 'Add a Review'}
      </h2>
      {showMessage ? (
        <div className="mb-4 p-4 border border-yellow-400 rounded bg-yellow-100">
          <p>You have already submitted a review. Would you like to edit it instead?</p>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => {
                setShowMessage(false); // Hide message
                if (existingReview) {
                  setReview({ rating: existingReview.rating, comment: existingReview.comment });
                  setIsEditing(true); // Set editing mode
                }
              }}
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Edit Review
            </button>
            <button
              onClick={handleCancel}
              className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {isEditing ? (
            // Show the editing form
            <div className="space-y-4">
              <StarRating rating={review.rating} onRatingChange={handleRatingChange} />
              <textarea
                name="comment"
                value={review.comment}
                onChange={handleCommentChange}
                placeholder="Update your review here..."
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 p-2"
              />
              {commentError && (
                <p className="text-red-500 text-sm mt-2">{commentError}</p>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading || commentError}
                  className={`w-full p-2 mt-4 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring focus:ring-blue-300`}
                >
                  {loading ? 'Updating...' : 'Update Review'}
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full p-2 mt-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Show the form for adding a new review
            <form onSubmit={handleSubmit} className="space-y-4">
              <StarRating rating={review.rating} onRatingChange={handleRatingChange} />
              <textarea
                name="comment"
                value={review.comment}
                onChange={handleCommentChange}
                placeholder="Write your review here..."
                required
                className="mt-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 p-2"
              />
              {commentError && (
                <p className="text-red-500 text-sm mt-2">{commentError}</p>
              )}
              <button
                type="submit"
                disabled={loading || commentError}
                className={`w-full p-2 mt-4 text-white font-semibold rounded-md ${loading ? 'bg-gray-400 py-3' : 'bg-indigo-600 py-3 hover:bg-indigo-700'} focus:outline-none focus:ring focus:ring-blue-300`}
              >
                {loading ? 'Adding...' : 'Add Review'}
              </button>
            </form>
          )}
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default AddReview;
