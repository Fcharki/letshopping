import React, { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';
import AddReview from '../reviews/addReview'; 
import StarRating from '../reviews/starRating'; 
import GlobalRatingElement from '../reviews/globalRatingCounter';
import { fetchProductById, resetProductStatus } from '../../redux/productSlice'; 
import ConfirmationModal from '../admin/adminScreens/confirmationModal';
import Spinner from '../auth/Spinner';

const apiUrl = import.meta.env.VITE_APP_API_URL
const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, status, error } = useSelector((state) => state.products);
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(resetProductStatus());
    dispatch(fetchProductById(id));
  }, [id, dispatch]);

  const handleEditClick = (review) => {
    setEditingReview(review);
  };

  const handleEditComplete = () => {
    setEditingReview(null);
    dispatch(fetchProductById(id));
  };

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setReviewToDelete(null);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = `${apiUrl}/api/products/${id}/reviews/${reviewToDelete}`; 

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('🎉 Review deleted successfully!');
      dispatch(fetchProductById(id));
      setIsModalOpen(false);
    } catch (error) {
      toast.error('❌ ' + error.response?.data?.message || error.message);
    }
    setLoading(false);
  };

  const addToCart = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if(!token) {
      toast.error('❌ You need to be logged in to add to cart!');
      return;
    }
    const url = `${apiUrl}/api/cart`; 

    try {
      const quantity = 1; 
      await axios.post(url, { productId: id, quantity }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('🎉 Product added to cart successfully!');
    } catch (error) {
      toast.error('❌ ' + error.response?.data?.message || error.message);
    }
    setLoading(false);
  };

  const isReviewOwner = (review) => {
    return user?.user?.id && String(review?.userId?._id) === String(user?.user?.id);
  };

  if (status === 'loading') return (<><Spinner /></>);
  if (status === 'failed') return <p className="text-red-600">Error: {error}</p>;
  if (!product || !product?.product) return <p>No product found.</p>;


  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto pt-5 my-10 p-4 bg-white rounded shadow-lg">
        <div className="mx-auto mt-5 pt-5 mb-4 p-4 bg-white rounded shadow-sm flex flex-col md:flex-row">
          <div className="md:w-1/2 p-3 flex justify-center">
            <img 
              src={product?.product?.imageURL} 
              alt={product?.product?.name || 'Product Image'} 
              className="shadow-md h-80 w-full object-cover rounded-lg" 
            />
          </div>
          <div className="md:w-1/2 p-5 flex flex-col justify-between">
            <p className="text-lg text-gray-600 mb-4">{product?.product?.description}</p>
            <p className="text-xl font-bold rounded-full w-fit text-center bg-gray-300 p-2 px-5 mt-6 text-black mb-4">
              {product?.product?.price}$
            </p>
            <button 
              onClick={addToCart} 
              className='bg-orange-500 p-3 mt-3 text-white font-medium border rounded-full shadow-lg flex items-center justify-center gap-2 focus:outline-none focus:ring focus:ring-orange-600 hover:bg-orange-700'
            > 
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" 
                viewBox="0 -960 960 960" 
                width="24px" 
                fill="currentColor"
              >
                <path d="M440-600v-120H320v-80h120v-120h80v120h120v80H520v120h-80ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z"/>
              </svg>
              {loading ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
        <div className="mt-5 shadow-sm">
          <GlobalRatingElement productId={product?.product?._id} />
          <h3 className="text-xl font-semibold mt-3">Reviews:</h3>
          {product?.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index} className="p-2 border-b">
                <p>
                  <strong className='text-lg font-semibold'>{review?.userId?.name}</strong>
                  {isReviewOwner(review) && (
                    <>
                      <span 
                        className='text-gray-500 text-md hover:underline ml-3 cursor-pointer' 
                        onClick={() => handleEditClick(review)}
                      >
                        Edit review
                      </span>
                      <span 
                        className='mt-4 text-red-600 hover:underline text-md ml-3 cursor-pointer' 
                        onClick={() => handleDeleteClick(review?._id)} 
                      >
                        Delete review
                      </span>
                    </>
                  )}
                  <br /> 
                  {review.comment}
                </p>
                <StarRating rating={review.rating} readOnly={true} />
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>

        {isModalOpen && (
          <ConfirmationModal 
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmDelete}
          />
        )}

        <AddReview productId={id} existingReview={editingReview} onEditComplete={handleEditComplete} />
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;