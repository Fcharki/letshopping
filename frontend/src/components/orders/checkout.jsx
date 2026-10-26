import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCustomersOrders } from '../../redux/ordersSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../layout/footer';
import Navbar from '../layout/navbar';


const apiUrl = import.meta.env.VITE_APP_API_URL
const Checkout = () => {
    const token = localStorage.getItem('token');  // Retrieve token correctly here
    const [shippingInfo, setShippingInfo] = useState({
        street: '',
        city: '',
        zipCode: '',
        country: '',
    });
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the shipping info to the backend to place the order
            const response = await axios.post(`${apiUrl}/api/orders/place-order`, {
                shippingAddress: shippingInfo,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // passing the token to request's headers
                },
            });

            if (response.status === 201) {
                // If order is successful, fetch the user's orders
                toast.success("🎉 Order has been created successfully !");
                dispatch(fetchCustomersOrders());

                // Navigate to the order summary page with the order details
                navigate('/order-summary', { state: { order: response.data.order } });
            }
        } catch (err) {
            toast.error(err);
            setError(err.response?.data?.message || 'Failed to place order');
        }
    };

    const handleChange = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value,
        });
    };

    return (
      <>
      <Navbar/>
        <div className="max-w-3xl mx-auto my-9 pt-4 p-5 bg-white rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Checkout</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-bold mb-2">Shipping Information</h3>
                <input
                    type="text"
                    name="street"
                    placeholder="Street"
                    value={shippingInfo.street}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-2 border border-gray-300 rounded block text-md font-medium"
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingInfo.city}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-2 border border-gray-300 rounded block text-md font-medium"
                />
                <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={shippingInfo.zipCode}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-2 border border-gray-300 rounded block text-md font-medium"
                />
                <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={shippingInfo.country}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-2 border border-gray-300 rounded"
                />

                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Place Order
                </button>
            </form>
            <ToastContainer/>
        </div>
        <Footer/>
        </>
    );
};

export default Checkout;
