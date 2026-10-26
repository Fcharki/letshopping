import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';
import { uploadImageToCloudinary } from '../../service/cloudinaryService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_APP_API_URL
const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryName: '',  
  });

  const [categories, setCategories] = useState([]);  // For storing fetched categories

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  // Ref for the file input
  const fileInputRef = useRef(null);

  // fetching categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/api/categories`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);  
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
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
      // Upload the image to Cloudinary
      const cloudinaryRes = await uploadImageToCloudinary(image, 'm7dylsa7'); 
      const imageURL = cloudinaryRes.secure_url; // Get the image URL

      // Prepare product data
      const productData = { ...product, imageURL };
      const token = localStorage.getItem('token');
      // Send the product data to the backend
      const backendRes = await axios.post(`${apiUrl}/api/products`, productData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('🎉 Product added successfully!')

      // Empty the form after adding a product successfully
      setProduct({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        categoryName: '',  
      });

      // Clear the image state
      setImage(null);


      // Reset the file input field using the ref
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; 
      }

       // Redirect to products page or list
      //  navigate('/admin/dashboard'); 

    } catch (error) {
      toast.error('❌' + error.message);
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto my-10 p-4 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description:</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price:</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock Quantity:</label>
            <input
              type="number"
              name="stockQuantity"
              value={product.stockQuantity}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 p-2"
            />
          </div>

          {/* Category dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category:</label>
            <select
              name="categoryName"
              value={product.categoryName}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 p-2"
            >
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
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
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>

        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

export default AddProduct;
