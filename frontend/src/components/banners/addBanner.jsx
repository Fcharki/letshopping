import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { uploadImageToCloudinary } from '../../service/cloudinaryService';
import { fetchBanners } from '../../redux/bannerSlice';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';
import { useNavigate } from 'react-router-dom';


const apiUrl = import.meta.env.VITE_APP_API_URL
const AddBanner = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescrption] = useState('');
  const [image, setImage] = useState(null);
  const [link, setLink] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const fileInputRef = useRef(null); // to create a reference to the file input
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
  
    try {
      const cloudinaryRes = await uploadImageToCloudinary(image, 'm7dylsa7'); 
      const imageUrl = cloudinaryRes.secure_url; 
    
      const bannerData = { title, description, imageUrl, link, startDate, endDate };
      await axios.post(`${apiUrl}/api/banners`, bannerData,  {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    
      dispatch(fetchBanners());
    
      // Reset form inputs
      setTitle('');
      setDescrption('');
      setImage(null);
      setLink('');
      setStartDate('');
      setEndDate('');
      // navigate('/admin/dashboard');
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';  // Resetting file input field value
      }
    
      toast.success('🎉 Banner added successfully');
    } catch (err) {
      toast.error(err.message || 'An error occurred while uploading the banner. Please try again.');
      console.error(err);
    }
  };
  
  
  return (
    <>
    <Navbar/>
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <form onSubmit={handleSubmit} className="bg-white shadow-md mb-10 rounded-lg p-8 space-y-6 w-96">
      <h2 className="text-2xl font-bold text-center">Add New Banner</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Banner Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescrption(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <input
          type="file"
          ref={fileInputRef} 
          onChange={(e) => setImage(e.target.files[0])}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Link</label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
  
      <button
        type="submit"
        className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600 transition duration-200"
      >
        Add Banner
      </button>
    </form>
    <ToastContainer/>
  </div>  
  <Footer/>
  </>
  );
};

export default AddBanner;
