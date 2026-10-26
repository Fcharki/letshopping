import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomersOrders, cancelOrder, activateOrder, deleteOrder } from '../../redux/ordersSlice';
import { useNavigate } from 'react-router-dom';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const ViewOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items = [], status, error } = useSelector((state) => state.orders);
  
  // State to toggle between showing active or canceled orders
  const [showCanceled, setShowCanceled] = useState(false);

  // Filter orders based on the showCanceled state
  const filteredOrders = showCanceled
    ? items.filter(order => order.status === 'canceled')  
    : items.filter(order => order.status !== 'canceled'); 

  useEffect(() => {
    dispatch(fetchCustomersOrders());
  }, [dispatch]);

  const handleCancelOrder = (orderId) => {
    toast.success('🎉 Order canceled Successfully');
    dispatch(cancelOrder(orderId)); 
  };

  const handleActivateOrder = (orderId) => {
    toast.success('🎉 Order Activated Successfully');
    dispatch(activateOrder(orderId)); 
  };

  const handleDeleteOrder = (orderId) => {
    toast.success('🎉 Order permanently deleted');
    dispatch(deleteOrder(orderId)); 
  };

  const handlePayButton = (totalAmount, orderId) => {
    navigate('/pay', { state: { totalAmount, orderId} });
  };
  

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mt-16 mx-auto mb-52 p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold mb-6 text-black">Your Orders</h2>
    {/* Toggle Button to show/hide canceled orders */}
    <button 
      onClick={() => setShowCanceled(!showCanceled)}
      className="mb-4 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-200"
    >
      {showCanceled ? 'Show Active Orders' : 'Show Canceled Orders'}
    </button>

    {filteredOrders.length === 0 ? (
      <p className="text-lg text-gray-700 text-center">You have no {showCanceled ? 'canceled' : 'active'} orders.</p>
    ) : (
      <ul className="space-y-6">
        {filteredOrders.map((order, index) => (
          <li
            key={order._id}
            className="bg-white border border-gray-300 p-5 rounded-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Order #{index + 1}</h3>
            <p className="text-gray-800">
              <span className="font-bold text-lg">Total Amount: </span>
              <span className="text-orange-500 mx-2 font-semibold">${order.totalAmount.toFixed(2)}</span>
            </p>
            <p className="text-gray-800">
              <span className="font-bold">Shipping Address: </span>
              <span className='mx-2'>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.zipCode}, {order.shippingAddress.country}</span>
            </p>
            <p className="text-gray-800">
              <span className="font-bold">Status: </span>
              <span className={`font-medium mx-2 ${order.status === 'Delivered' ? 'text-green-600' : order.status === 'pending' ? 'text-orange-500' : 'text-red-500'}`}>
                {order.status === 'canceled' ? 'Canceled' : order.status}
              </span>
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">Payment status: </span>
              <span className={`text-lg mx-2 underline font-medium ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'}`}>
                {order.paymentStatus}
                {order.paymentStatus === 'paid' && (
                  <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#48bb78" className="inline-block ml-1">
                    <path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                  </svg>
                )}
              </span>
            </p>

            <div>
              {order.paymentStatus === 'unpaid' && order.status !== 'canceled' && (
                  <div className="flex justify-center w-full">
                      <button
                          className="text-white bg-orange-500 w-full rounded-full hover:bg-orange-600 transition duration-200 py-2 mt-4"
                          onClick={() => handlePayButton(order.totalAmount, order._id)}
                      >
                          Pay Now
                      </button>
                  </div>
              )}
          </div>


            <ul className="mt-4 border-t border-gray-200 pt-3">
              <h4 className="text-2xl font-semibold text-gray-700 mb-2">Items in Order:</h4>
              {order.orderItems.map((item) => (
                <li key={item.productId._id} className="flex flex-col sm:flex-row justify-between border-b py-2">
                  <span className="text-black flex items-center mb-2 sm:mb-0">
                    <img
                      src={item.productId.imageURL}
                      alt={item.productId.name}
                      className="h-24 w-24 sm:w-32 rounded mr-2 object-cover" // Ensures consistent size and cover
                    />
                    <span className="text-sm sm:text-base">{item.productId.description}</span>
                  </span>
                  <span className="text-black text-sm sm:text-base">
                    {item.quantity} x <span className="text-orange-500">${item.price.toFixed(2)}</span>
                  </span>
                </li>
              ))}
            </ul>

            {/* Cancel Order Button (hide if already canceled) */}
            {order.status !== 'canceled' && order.paymentStatus !== 'paid' && (
              <button 
                className="flex items-center mt-4 py-2 text-red-500 font-medium text-right"
                onClick={() => handleCancelOrder(order._id)} 
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FF4444" className="mr-2">
                  <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                </svg>
                Cancel Order
              </button>
            )}

            {/* Show Activate and Delete buttons for canceled orders */}
            {order.status === 'canceled' && (
              <div className="mt-4 flex space-x-4">
                <button 
                  className="flex items-center py-2 text-green-500 font-medium"
                  onClick={() => handleActivateOrder(order._id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#48bb78" className="mr-2">
                    <path d="M280-280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680q50 0 90.5 22t69.5 58h320q50 0 85 35t35 85q0 50-35 85t-85 35H440q-29 36-69.5 58T280-280Zm0-200Zm196 40h284q17 0 28.5-11.5T800-480q0-17-11.5-28.5T760-520H476q2 9 3 20t1 20q0 9-1 20t-3 20Zm-196 80q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Z"/>
                  </svg>
                  Activate Order
                </button>
                <button 
                  className="flex items-center py-2 text-red-500 font-medium"
                  onClick={() => handleDeleteOrder(order._id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FF4444" className="mr-2">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                  </svg>
                  Delete Order
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    )}
</div>

      <Footer />
    </>
  );
};

export default ViewOrders;
