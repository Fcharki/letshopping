import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import logimg from "../../assets/images/login-img.avif";
import hplogo from "../../assets/images/logo1.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/userSlice';


const apiUrl = import.meta.env.VITE_APP_API_URL
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const { email, password } = formData;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const { loading, error } = useSelector((state) => state.user);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const notifySuccess = () => {
    toast.success('🎉 Logged In Successfully!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const notifyError = (message) => {
    toast.error(`❌ ${message}`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({ email, password });
      
      const loginResponse = await axios.post(
        `${apiUrl}/api/users/login`,
        body,
        config
      );

      const { user, token, redirectTo } = loginResponse.data;
      dispatch(loginSuccess({ user, token }));
      localStorage.setItem("token", token); // Store the token for future requests

      notifySuccess();
      setFormData({ email: "", password: "" });

      setTimeout(() => {
        navigate(redirectTo); // Redirect to a specific route after login
      }, 3000);

    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Invalid email or password. Please try again.';
      dispatch(loginFailure(errorMessage));
      notifyError(errorMessage);
    }
  };

  

  return (
    <div className="max-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className='mt-28'>
        <a href='/'><img src={hplogo} alt="Logo" className="w-64" /></a>
      </div>
      <div className="bg-white shadow-lg mb-64 rounded-lg flex flex-col lg:flex-row w-11/12 lg:w-3/5">
        <div className="hidden lg:flex w-full lg:w-1/2 bg-white-500 text-white justify-center items-center relative">
          <img src={logimg} alt="Login image" className="w-full h-full object-cover" />
        </div>

        <div className="w-full lg:w-1/2 p-8 space-y-6 mx-auto bg-indigo-200 rounded shadow-lg">
          <h2 className="text-3xl font-semibold text-center">Welcome Back!</h2>
          
          {error && <div className="bg-red-500 text-white p-3 rounded">{error}</div>}
          
          <form onSubmit={onSubmit} className="space-y-4">
          <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email} 
                  onChange={onChange} 
                  required 
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
              </div>
            </div>
            <div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password} 
                  onChange={onChange} 
                  required 
                  className="block w-full px-4 py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}  
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="text-center mt-3 p-2 border-2 border-gray-300 bg-white rounded-lg transition-colors font-medium shadow-sm">
            <span>Forgot Password? </span>
            <Link to="/reset-password" className="text-blue-600 hover:text-blue-700">Reset it</Link>
          </div>
          <div className="text-center mt-4 font-medium underline:purple-200">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-blue-600 hover:text-blue-700">Create it</Link>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
