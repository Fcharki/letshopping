import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';
import { useParams, useNavigate } from 'react-router-dom';
import { uploadImageToCloudinary } from '../../service/cloudinaryService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiUrl = import.meta.env.VITE_APP_API_URL
const EditProduct = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryName: '',  
    imageURL: ''
  });
  const [categories, setCategories] = useState([]);  // For storing fetched categories
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // For navigation after updating

  // Fetch categories from backend on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/categories`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCategories(response.data); 
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const { name, description, price, stockQuantity, categoryName, imageURL } = response.data.product;
        setProduct({ name, description, price, stockQuantity, categoryName, imageURL });
      } catch (err) {
        console.error('Failed to fetch product:', err);
        toast.error('Failed to fetch product.');
      }
    };

    fetchProduct();
  }, [id]);

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
      let imageURL = product.imageURL; // Default to existing image URL
      if (image) {
        // Upload the new image to Cloudinary if a new image is selected
        const cloudinaryRes = await uploadImageToCloudinary(image, 'm7dylsa7'); 
        imageURL = cloudinaryRes.secure_url; // Get the new image URL
      }

      // Prepare product data
      const productData = { ...product, imageURL };
      // console.log('Product Data:', productData); 

      // Send the product data to the backend
      await axios.put(`${apiUrl}/api/products/${id}`, productData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setProduct({ // emptied the form after submission
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        categoryName: '',  
        imageURL: ''
      });
      toast.success('🎉 Product updated successfully');  // Show success toast

      // Clear the image state
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';  // Reset the file input
      }

      // Redirect to dashboard page
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 6000);

    } catch (error) {
      toast.error('❌ Error updating product.');
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto my-10 p-4 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4 mt-3">Edit Product</h2>
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
            <label className="block text-sm font-medium text-gray-700">Current Image:</label>
            {product.imageURL && (
              <img src={product.imageURL} alt="Product" className="mt-2 mb-2 w-28 h-auto rounded" />
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
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </form>

        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

export default EditProduct;
