import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const apiUrl = import.meta.env.VITE_APP_API_URL
const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/users/verify-email/${token}`);
        setMessage(response.data.message);
        setError(false);

        // Redirect after a short delay to the login page
        setTimeout(() => {
          navigate('/login');
        }, 3000); // Wait 3 seconds before redirecting
      } catch (err) {
        setMessage(err.response?.data?.message || 'Verification failed. Please try again.');
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    verifyUserEmail();
  }, [token, navigate]);

  if (loading) {
    return <div className="text-center">Loading...</div>; // Show a loading spinner/message while verifying
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className={`text-lg font-bold ${error ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </h1>
        {error ? (
          <p className="mt-2 text-gray-500">If the issue persists, please contact support.</p>
        ) : (
          <p className="mt-2 text-gray-500">Redirecting to login page...</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
