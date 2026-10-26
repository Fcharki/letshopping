import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { order } = location.state || {};

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto my-10 p-6 bg-blue-50 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">No Order Found</h2>
        <p className="text-lg text-gray-600 mb-6">
          It seems like you accessed this page without placing an order.
        </p>
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => navigate('/')}
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto my-10 p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Order Summary</h2>

        {/* Order Total Details */}
        <div className="hover:bg-green-50 rounded-lg p-6 shadow-md mb-6">
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">Total Amount: </span>
            <span className="text-orange-600">${order.totalAmount.toFixed(2)}</span>
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">Tax: </span>
            <span className="text-gray-600">${order.taxAmount.toFixed(2)}</span>
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Discount: </span>
            <span className="text-green-600">-${order.discount.toFixed(2)}</span>
          </p>
        </div>

        {/* Shipping Information */}
        <div className="hover:bg-green-50 rounded-lg p-6 shadow-md mb-6">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Shipping Information</h3>
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">Street: </span>{order.shippingAddress.street}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">City: </span>{order.shippingAddress.city}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">Zip Code: </span>{order.shippingAddress.zipCode}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Country: </span>{order.shippingAddress.country}
          </p>
        </div>

        {/* Items Ordered */}
        <div className="bg-white hover:bg-green-50 rounded-lg p-6 shadow-md">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">Items Ordered</h3>
          <ul>
            {order.orderItems.map((item) => (
              <li
                key={item.productId}
                className="flex flex-col sm:flex-row justify-between items-center mb-4 p-4 border-b border-gray-200"
              >
                <img 
                  src={item.imageURL} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
                <span className="text-lg text-gray-700 mt-2 sm:mt-0 sm:mx-6">{item.description}</span>
                <span className="text-lg text-gray-700">
                  {item.quantity} x <span className="text-orange-600">${item.price.toFixed(2)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="px-5 w-full mt-5 transition duration-200 py-2 bg-green-600 text-white rounded-full text-lg hover:bg-green-700 transition-colors"
          onClick={() => navigate('/orders')}
        >
          View All Orders
        </button>
      </div>
      <Footer />
    </>
  );
};

export default OrderSummary;
