import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUserFromToken } from '../../redux/userSlice'; 
import { toast } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toastify

const AuthRoute = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [loading, setLoading] = useState(true); // Loading state for token verification

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (token) {
      dispatch(setUserFromToken({ token })); // Dispatch action to restore user from token
    }

    setLoading(false); // Token verification done, set loading to false
  }, [dispatch]);

  useEffect(() => {
    // If user is not authenticated, show a toast message
    if (!isAuthenticated && !loading) {
      toast.error('You are not authenticated! Please log in.');
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while checking token
  }

  // If not authenticated, redirect to login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default AuthRoute;
