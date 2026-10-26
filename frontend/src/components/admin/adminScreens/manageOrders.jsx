import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_APP_API_URL
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({}); // Store status values for each order

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiUrl}/api/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setError('Unexpected response structure.');
      }
    } catch (err) {
      console.log(err);
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const updateOrderStatus = async (orderId) => {
    const newStatus = statusUpdates[orderId];
    if (!newStatus) return;

    try {
      await axios.put(
        `${apiUrl}/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      await fetchOrders(); // refresh orders after update
      toast.success('Order status updated successfully');
    } catch (err) {
      toast.error(err);
      console.log(err);
      setError('Failed to update order status.');
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h4 className="text-xl font-bold mb-4">Orders</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="py-2 px-4 border">Order Date</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Update Status</th>
              <th className="py-2 px-4 border">Order status</th>
              <th className="py-2 px-4 border">Product Name</th>
              <th className="py-2 px-4 border">Total Amount</th>
              <th className="py-2 px-4 border">Payment Status</th>
              <th className="py-2 px-4 border">Shipping Address</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order._id} className="border-b">
                  <td className="py-2 px-4 border">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border">{order?.status}</td>
                  <td className="py-2 px-4 border">
                    <select
                          value={statusUpdates[order._id] || order.status}
                          onChange={e => handleStatusChange(order?._id, e.target.value)}
                          className="border p-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="canceled">Canceled</option>
                        </select>

                    <button
                      onClick={() => updateOrderStatus(order._id)}
                      className="ml-2  px-2 py-1 bg-indigo-600 text-white rounded"
                    >
                      Update
                    </button>
                  </td>
                  <td className="py-2 px-4 border">{order?.status}</td>
                   <td className="py-2 px-4 border">
                    {order.orderItems.map((item, i) => (
                      <div key={i}>{item.productId?.name}</div>
                    ))}
                  </td>
                  <td className="py-2 px-4 border">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-2 px-4 border">{order.paymentStatus}</td>
                  <td className="py-2 px-4 border">
                    {`${order?.shippingAddress.street}, ${order?.shippingAddress.city}, ${order?.shippingAddress.state}, ${order?.shippingAddress.zipCode}, ${order?.shippingAddress.country}`}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">No Orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Orders;
