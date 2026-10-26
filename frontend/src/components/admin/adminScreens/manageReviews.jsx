import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import ConfirmationModal from './confirmationModal'; 

const apiUrl = import.meta.env.VITE_APP_API_URL
const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [productIds, setProductIds] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [reviewToDelete, setReviewToDelete] = useState(null); // Track the review to delete

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await axios.get(`${apiUrl}/api/admin/reviews`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (response.data && Array.isArray(response.data)) {
          setReviews(response.data);
          // each review has a productId property
          const ids = response.data.reduce((acc, review) => {
            acc[review._id] = review.productId; // Store the product ID for each review
            return acc;
          }, {});
          setProductIds(ids);
        } else if (response.data.length === 0) {
          setError("No reviews available at this moment");
        } else {
          setError('Unexpected response structure.');
        }
      } catch (err) {
        setError('Failed to fetch reviews.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchReviews();
  }, []);

  
  // Open the confirmation modal
  const handleOpenModal = (id) => {
    setReviewToDelete(id); // Set the review id to delete
    setIsModalOpen(true);    // Open the modal
  };

  
  // Handle deleting a review after confirmation
  const handleDeleteReview = async () => {
    try {
      // Use both productId and reviewId
      const productId = productIds[reviewToDelete]; // Get the product ID associated with the review
      await axios.delete(`${apiUrl}/api/products/${productId}/reviews/${reviewToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      // Remove the deleted review from state
      setReviews(reviews.filter((review) => review._id !== reviewToDelete));
      toast.success('Review deleted successfully');
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      toast.error(error);
      setIsModalOpen(false); // Close modal even if deletion fails
    }
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h4 className="text-xl font-bold mb-4">User Reviews</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="py-2 px-4 border">Product Name</th>
              <th className="py-2 px-4 border">Product Image</th>
              <th className="py-2 px-4 border">Customer name</th>
              <th className="py-2 px-4 border">Customer email</th>
              <th className="py-2 px-4 border">Rating</th>
              <th className="py-2 px-4 border">Comment</th>
              <th className="py-2 px-4 border">Review Date</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(reviews) && reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review._id} className="border-b">
                  {/* Accessing product and user details */}
                  <td className="py-2 px-4 border">{review.productId?.name || ''}</td>
                  <td className="py-2 px-4 border">
                    <img src={review.productId?.imageURL} alt={review.productId?.name || 'N/A'} 
                      className="w-16 h-16 object-cover"/>
                  </td>
                  <td className="py-2 px-4 border">{review.userId?.name || ''}</td>
                  <td className="py-2 px-4 border">{review.userId?.email || ''}</td>
                  <td className="py-2 px-4 border">{review.rating} / 5</td>
                  <td className="py-2 px-4 border">{review.comment}</td>
                  <td className="py-2 px-4 border">{new Date(review.reviewDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border">
                    {/* Open modal before deleting */}
                    <button 
                      onClick={() => handleOpenModal(review._id)} 
                      className="bg-red-500 text-white px-2 py-1 m-2 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">No reviews found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}   // Close modal handler
        onConfirm={handleDeleteReview}         // Confirm delete handler
      />
      <ToastContainer/>
    </div>
  );
};

export default AdminReviews;
