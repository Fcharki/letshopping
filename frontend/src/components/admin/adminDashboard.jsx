import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { setUserFromToken } from '../../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import LogoutButton from '../auth/logOutUser';
import Customers from './adminScreens/manageCustomers';
import Products from './adminScreens/manageProducts';
import Categories from './adminScreens/manageCategories';
import Orders from './adminScreens/manageOrders';
import AdminReviews from './adminScreens/manageReviews';
import ManageBanners from './adminScreens/manageBanners';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('users');
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token) {
      dispatch(setUserFromToken({ token }));
    } else {
      console.log("Token is missing after refresh");
    }
  }, [dispatch]);
  

  // Check if the user is authenticated after the token has been set
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated]);


  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <Customers />;
      case 'products':
        return <Products />;
      case 'categories':
        return <Categories />;
      case 'orders':
        return <Orders />;
      case 'reviews':
        return <AdminReviews />;
      case 'banners':
        return <ManageBanners />;
      default:
        return null; // Return null or appropriate content
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while the auth status is being resolved
  }

  return (
    <div className="flex flex-col md:flex-row h-auto bg-dark-blue min-h-screen"> 
      <div className="w-full md:w-1/4 bg-blue-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
        <div className="space-y-4">
          <button onClick={() => setActiveSection('users')} className={`w-full text-left px-4 py-2 text-white hover:bg-blue-700 ${activeSection === 'users' ? 'bg-blue-700' : 'bg-blue-900'}`}>Manage Customers</button>
          <hr className="border-t border-gray-400" />
          <button onClick={() => setActiveSection('products')} className={`w-full text-left px-4 py-2 text-white hover:bg-blue-700 ${activeSection === 'products' ? 'bg-blue-700' : 'bg-blue-900'}`}>Manage Products</button>
          <hr className="border-t border-gray-400" />
          <button onClick={() => setActiveSection('orders')} className={`w-full text-left px-4 py-2 text-white hover:bg-blue-700 ${activeSection === 'orders' ? 'bg-blue-700' : 'bg-blue-900'}`}>Manage Orders</button>
          <hr className="border-t border-gray-400" />
          <button onClick={() => setActiveSection('banners')} className={`w-full text-left px-4 py-2 text-white hover:bg-blue-700 ${activeSection === 'banners' ? 'bg-blue-700' : 'bg-blue-900'}`}>Manage Banners</button>
          <hr className="border-t border-gray-400" />
          <button onClick={() => setActiveSection('categories')} className={`w-full text-left px-4 py-2 text-white hover:bg-blue-700 ${activeSection === 'categories' ? 'bg-blue-700' : 'bg-blue-900'}`}>Manage Categories</button>
          <hr className="border-t border-gray-400" />
          <button onClick={() => setActiveSection('reviews')} className={`w-full text-left px-4 py-2 text-white hover:bg-blue-700 ${activeSection === 'reviews' ? 'bg-blue-700' : 'bg-blue-900'}`}>Manage Reviews</button>
          <hr className="border-gray-400" />
        </div>

        <div className="flex items-center mx-2 mt-3">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>
          <Link to="/">
            <button className="px-4 py-2 text-white hover:text-gray-200 text-lg font-medium">Home</button>
          </Link>
        </div>
        <div className="flex items-center mx-2">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EF4444">
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
            </svg>
        <LogoutButton />
        </div>
      </div>

      <div className="flex-1 bg-white p-4 md:p-8 overflow-y-auto"> 
        <h3 className="text-3xl font-bold text-black mb-6">
          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        </h3>
        <div className="bg-gray-100 p-4 md:p-6 rounded-lg shadow-lg text-black">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
