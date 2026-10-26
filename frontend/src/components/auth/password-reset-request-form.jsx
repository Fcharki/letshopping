import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import requestImage from "../../assets/images/reset-request.jpg";


const apiUrl = import.meta.env.VITE_APP_API_URL
const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/users/request-password-reset`, { email });
      toast.success('Password reset link has been sent to your email!');
      setEmail('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error sending password reset email.';
      toast.error(`❌ ${errorMessage}`);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
     

      {/* left side - Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img 
          src={requestImage}
          alt="Reset Password"
          className="h-screen w-full object-cover"
        />
      </div>
       {/* right side - Form */}
       <div className="w-full lg:w-1/2 flex items-center justify-center px-8 md:px-16 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-600">Enter your email to receive a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input 
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email address"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Send Reset Link
            </button>

            <div className="text-center mt-4">
              <a 
                href="/login" 
                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
              >
                Back to Login
              </a>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RequestPasswordReset;