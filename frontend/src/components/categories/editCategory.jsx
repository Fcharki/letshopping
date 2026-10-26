import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';
import { useParams, useNavigate } from 'react-router-dom';
import { uploadImageToCloudinary } from '../../service/cloudinaryService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const apiUrl = import.meta.env.VITE_APP_API_URL
const EditCategory = () => {
  const { id } = useParams(); // Get the category ID from the URL
  const [category, setCategory] = useState({
    name: '',
    description: '', 
    imageURL: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // For navigation after updating

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const { name, description, imageURL } = response.data.category;
        setCategory({ name, description, imageURL });
      } catch (err) {
        console.error('Failed to fetch category:', err);
        toast.error('Failed to fetch category.');
      }
    };

    fetchCategory();
  }, [id]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageURL = category.imageURL; // Default to existing image URL
      if (image) {
        // Upload the new image to Cloudinary if a new image is selected
        const cloudinaryRes = await uploadImageToCloudinary(image, 'm7dylsa7'); 
        imageURL = cloudinaryRes.secure_url; // Get the new image URL
      }

      // Prepare category data
      const categoryData = { ...category, imageURL };

      // Send the category data to the backend
      await axios.put(`${apiUrl}/api/categories/${id}`, categoryData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('🎉 Category updated successfully');  
      setCategory({
        name: "", description: "", imageURL: null
      })

      // Clear the image state
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; 
      }

      // Redirect to dashboard page
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 6000);

    } catch (error) {
      toast.error('❌ Error updating category.');
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto mt-5 mb-4 pt-5 p-4 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4 mt-3">Edit Category</h2>
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
            <label className="block text-sm font-medium text-gray-700">Current Image:</label>
            {category.imageURL && (
              <img src={category.imageURL} alt="Category" className="mt-2 mb-2 w-full h-auto rounded" />
            )}
            <label className="block text-sm font-medium text-gray-700">Upload New Image:</label>
            <input
              type="file"
              onChange={handleImageChange}
              ref={fileInputRef} // Attach ref here to reset the file input
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 mt-4 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring focus:ring-blue-300`}
          >
            {loading ? 'Updating...' : 'Update Category'}
          </button>
        </form>

        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

export default EditCategory;
