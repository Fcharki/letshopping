import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './confirmationModal'; // Import the modal

const apiUrl = import.meta.env.VITE_APP_API_URL
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [productToDelete, setProductToDelete] = useState(null); // Track the product to delete
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${apiUrl}/api/products`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setError('Unexpected response structure.');
        }
      } catch (err) {
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Open confirmation modal
  const handleOpenModal = (id) => {
    setProductToDelete(id); // Set the product id to delete
    setIsModalOpen(true);   // Open the modal
  };

  // Handle deleting a product after confirmation
  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`${apiUrl}/api/products/${productToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts(products.filter(product => product._id !== productToDelete)); // Remove from state
      toast.success('Product deleted successfully');
      setIsModalOpen(false); // Close the modal after deletion
    } catch (err) {
      toast.error(err);
      setError('Failed to delete product.');
      setIsModalOpen(false); // Close modal even if deletion fails
    }
  };

  // Redirect to add-product page
  const handleAddProduct = () => {
    navigate('/products/add-product');
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='p-5'>
      <h4 className="text-xl font-bold mb-4">Manage Products</h4>
      
      {/* Add Product Button */}
      <div className="mb-4">
        <button 
          className="text-white text-lg text-semibold bg-blue-500  rounded-sm px-3 py-2" 
          onClick={handleAddProduct}
        >
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Price</th>
              <th className="py-2 px-4 border">Stock Quantity</th>
              <th className="py-2 px-4 border">Category</th>
              <th className="py-2 px-4 border">Image</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map(product => (
                <tr key={product._id} className="border-b">
                  <td className="py-2 px-4 border">{product.name}</td>
                  <td className="py-2 px-4 border">{product.description}</td>
                  <td className="py-2 px-4 border">{product.price}</td>
                  <td className="py-2 px-4 border">{product.stockQuantity}</td>
                  <td className="py-2 px-4 border">{product.categoryName}</td>
                  <td className="py-2 px-4 border">
                    <img 
                      src={product.imageURL} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover" 
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    {/* Update Button */}
                    <button 
                      className="bg-yellow-500 m-2 text-white px-2 py-1" 
                      onClick={() => navigate(`/edit-product/${product._id}`)}
                    >
                      Edit
                    </button>
                    {/* Delete Button */}
                    <button 
                      className="bg-red-500 m-2 text-white px-2 py-1 ml-2" 
                      onClick={() => handleOpenModal(product._id)} // Open confirmation modal
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">No Products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}  // Close modal handler
        onConfirm={handleDeleteProduct}  // Confirm delete handler
      />
      <ToastContainer/>
    </div>
  );
};

export default Products;
