import React, { useState, useRef } from 'react';
import axios from 'axios';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';
import { uploadImageToCloudinary } from '../../service/cloudinaryService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const apiUrl = import.meta.env.VITE_APP_API_URL
const AddCategory = () => {
  // State to handle form inputs
  const [category, setCategory] = useState({
    name: '',
    description: '',
    imageURL: ''
  });

  // Category data for image
  const [image, setImage] = useState(null); 
  const [loading, setLoading] = useState(false);

  // Ref to reset the file input
  const fileInputRef = useRef(null);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && ['image/jpeg', 'image/png', 'image/jpeg'].includes(selectedFile.type)) {
      setImage(selectedFile);
    } else {
      console.error('Invalid file type. Please upload an image (JPEG or PNG).');
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Upload the image to Cloudinary using the utility function
      const cloudinaryRes = await uploadImageToCloudinary(image, 'm7dylsa7'); // Cloudinary preset
      const imageURL = cloudinaryRes.secure_url; // Get the image URL from Cloudinary

      // Send the category data and imageURL to the backend
      const categoryData = { ...category, imageURL }; // Make sure `imageURL` is included properly
      const token = localStorage.getItem("token");
      const backendRes = await axios.post(`${apiUrl}/api/categories`, categoryData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      toast.success('Category added successfully!');
      
      
      // Empty the form fields after successful submission
      setCategory({
        name: '',
        description: '',
        imageURL: ''
      });

      // Clear the image state
      setImage(null);

      // Reset the file input field using the ref
      if (fileInputRef.current) {
        fileInputRef.current.value = '';  // This resets the file input
      }

      console.log('Category added:', backendRes.data);
    } catch (error) {
      toast.error('❌' + error.message);
      console.error('Error:', error);
    }
   
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto my-10 pt-5 p-4 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold pt-5 mb-5">Create New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={category.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description:</label>
            <textarea
              name="description"
              value={category.description}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image:</label>
            <input 
              type="file" 
              onChange={handleImageChange} 
              required 
              ref={fileInputRef} // Attach ref here to reset the file input
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 p-2"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full p-2 mt-4 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring focus:ring-blue-300`}
          >
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>
      <ToastContainer/>
      <Footer />
    </>
  );
};

export default AddCategory;
