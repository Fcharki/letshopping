import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { logout } from '../../redux/userSlice'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // For redirecting after logout

  // Function to show success notification
  const notifySuccess = () => {
    toast.success('🎉 Logged Out Successfully!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Handle logout
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      try {
        // Remove the JWT token from localStorage
        localStorage.removeItem('token');

        // Dispatch the logout action to clear the user data in the Redux store
        dispatch(logout());

        // Show notification
        notifySuccess();

        // Redirect the user to the login page after showing the success notification
        // setTimeout(() => {
          navigate('/login');
        // }, 3000); 
      } catch (error) {
        console.error('Logout failed', error);
      }
    }
  };

  return (
    <>
      <button onClick={handleLogout} className="p-2 text-lg font-medium text-red-500 rounded-lg hover:text-red-600">
        Logout
      </button>
    </>
  );
};

export default LogoutButton;
