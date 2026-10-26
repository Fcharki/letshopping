import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateUserProfileSuccess } from '../../redux/userSlice'; 
import { setUserFromToken } from '../../redux/userSlice';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';
import { useNavigate, Link } from 'react-router-dom';
import ConfirmationModal from '../admin/adminScreens/confirmationModal';


const apiUrl = import.meta.env.VITE_APP_API_URL
const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [clicked, setClicked] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // State for confirmation modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            dispatch(setUserFromToken({ token }));
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/users/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user information');
                }

                const data = await response.json();
                setUser(data);
                setName(data.name);
                setPhone(data.phone);
                setEmail(data.email);
                setAddress(data.address);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [dispatch, token]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.put(
                `${apiUrl}/api/users/update-profile`,
                { name, email, phone, address }, 
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                }
            );
            toast.success('Profile updated successfully.');
            dispatch(updateUserProfileSuccess({ name, email, phone, address }));
        } catch (err) {
            toast.error(err);
            setError('Failed to update profile.');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            toast.error("Passwords don't match.");
            return;
        }

        try {
            await axios.put(
                `${apiUrl}/api/users/change-password`,
                { newPassword: password, confirmPassword: confirmPassword }, // Include both fields
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                }
            );
            setConfirmPassword('');
            setPassword('');
            toast.success('Password changed successfully.');
        } catch (err) {
            toast.error(err);
            setError('Failed to change password.');
        }
    };

    const handleDeleteAccount = async () => {
        setError(null);
        setIsModalOpen(false); // Close modal after confirming

        try {
            await axios.delete(`${apiUrl}/api/users/delete-account`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('Account deleted successfully.');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            toast.error(err);
            setError('Failed to delete account.');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
    }

    return (
        <>
        <Navbar/>
        <div className="flex justify-center items-center bg-gray-100">
         
            <div className="bg-white rounded-lg shadow-lg my-10 p-6 max-w-2xl w-full">
                {error && <div className="text-red-600 mb-4">{error}</div>}

                <div className="flex flex-col items-center">
                    <img
                        className="w-32 h-32 rounded-full border-4 border-gray-400 mb-4"
                        src={`https://ui-avatars.com/api/?name=${user?.name}&background=4F46E5&color=FFF&size=128`}
                        alt={user?.name}
                    />
                    <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                </div>

                {/* Update form */} 
                <form className="mt-6 space-y-4" onSubmit={handleUpdate}>
                    <div className="flex flex-col">
                        <label className="text-gray-600">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600">Phone</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600">Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Update button */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all duration-300"
                    >
                        Update Profile
                    </button>
                </form>

                {/* Password change and delete account */}
                <div className="flex justify-between items-center mt-6">
                    {/* Change Password */}
                    <div className="flex flex-col">
                        <button
                            className="text-gray-500 text-sm hover:text-indigo-600 mb-2"
                            onClick={() => setClicked(!clicked)}
                        >
                            Change Password
                        </button>
                        {clicked && (
                            <form onSubmit={handlePasswordChange}>
                                <input
                                    type="password"
                                    placeholder="New password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 mx-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required/>
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-2 p-2 mx-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    required/>
                                <button
                                    type="submit"
                                    className="w-full text-green-500 text-lg py-2 px-4 hover:text-green-600 mt-2"
                                >
                                    Change Password
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Delete Account */}
                    <button
                        className="text-gray-600 text-sm mb-2 mx-4 hover:text-red-600"
                        onClick={() => setIsModalOpen(true)} // Open modal instead of deleting directly
                    >
                        Delete Account
                    </button>
                </div>
            </div>
           
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)} // Close modal
            onConfirm={handleDeleteAccount} // Confirm delete action
        />
 <ToastContainer/>
        <Footer/>
        </>
    );
};

export default UserProfile;
