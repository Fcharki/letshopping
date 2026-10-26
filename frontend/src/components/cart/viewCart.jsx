import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, removeFromCart } from '../../redux/cartSlice'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';

const ViewCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Extract cart state from the Redux store
  const { items, status, error } = useSelector((state) => state.cart);

  // Local state to track if the success toast has been shown
  const [toastShown, setToastShown] = useState(false);

  // Fetch the cart when the component is mounted
  useEffect(() => {
    dispatch(fetchCart()); // Dispatch the fetchCart action
  }, [dispatch]);

  const notifySuccess = () => {
    toast.info('Your cart is up to date', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const notifyInfo = () => {
    toast.info(`❌ Your cart is empty. Redirecting to homepage...`, {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const notifyRemoval = () => {
    toast.success('🛒 Item removed from cart successfully!', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  // Show notifications based on the fetch status
  useEffect(() => {
    if (status === 'succeeded' && !toastShown) {
      notifySuccess();
      setToastShown(true); // Mark the toast as shown
    } else if (status === 'failed') {
      toast.error(`Error fetching cart: ${error}`);
    }
  }, [status, error, toastShown]); // Add toastShown to dependencies

  // Handle empty cart case and redirect to homepage after displaying the message
  useEffect(() => {
    if (status === 'succeeded') {
        // If the cart is successfully fetched and is empty, show the empty cart message
        if (items.length === 0) {
            notifyInfo();
            const timer = setTimeout(() => {
                navigate('/'); // Redirect to homepage
            }, 3000); // 3 seconds delay
            return () => clearTimeout(timer);
        }
    }
  }, [items, status, navigate]);

  // Handle error state
  if (status === 'failed') {
    return <p>Error: {error}</p>; // Display the error message from Redux store
  }

  // Function to handle item removal
  const handleRemove = async (itemId) => {
    // Dispatch the removeFromCart action and wait for it to resolve
    try {
      await dispatch(removeFromCart(itemId)).unwrap();

      setTimeout(() => {
        notifyRemoval(); // Show removal success notification
      }, 200);
     
      // Optionally, you can also refetch the cart to ensure the UI is updated
      dispatch(fetchCart());
    } catch (err) {
      toast.error(`Error removing item: ${err.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className='md:flex md:flex-col md:min-h-screen'>
      <div className="max-w-3xl mx-auto my-32 p-4 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.productId._id} className="flex items-center border-b border-gray-300 py-4">
              <img src={item.productId.imageURL} alt={item.productId.name} className="w-24 h-24 object-cover rounded mr-4" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{item.productId.name}</h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-lg text-black-600">Price: ${(item.price).toFixed(2)}</p>
              </div>
              <div className="mt-4">
              <button
                onClick={() => navigate('/checkout')} 
                className="flex items-center text-md px-3 py-1 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4444FF" className="mr-2">
                  <path d="m480-560-56-56 63-64H320v-80h167l-64-64 57-56 160 160-160 160ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z"/>
                </svg>
                Proceed to Checkout
              </button>
            </div>

            <button
              onClick={() => handleRemove(item._id)} 
              className="flex items-center text-md px-3 mt-4 py-1 text-red-500 hover:text-red-600  font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EF4444" className="mr-2">
                <path d="M360-640v-80h240v80H360ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z"/>
              </svg>
              Remove
            </button>

            </div>
          ))
        ) : (
          <div className="text-lg text-gray-600 pt-4 text-center mt-4">
            <p>Your cart is empty.</p>
            <p>Redirecting to homepage...</p>
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-xl font-bold">
            Total Price: ${items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
          </h3>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewCart;
