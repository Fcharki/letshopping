import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import ConfirmationModal from './confirmationModal'; 

const apiUrl = import.meta.env.VITE_APP_API_URL
const GetCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Track the category to delete

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${apiUrl}/api/categories`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);  
        } else {
          setError('Unexpected response structure.');
        }
      } catch (err) {
        setError('Failed to fetch categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Open the confirmation modal
  const handleOpenModal = (id) => {
    setCategoryToDelete(id); // Set the category id to delete
    setIsModalOpen(true);    // Open the modal
  };

  // Handle deleting a category after confirmation
  const handleDeleteCategory = async () => {
    try {
      await axios.delete(`${apiUrl}/api/categories/${categoryToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCategories(categories.filter(category => category._id !== categoryToDelete)); // Remove from state
      toast.success('Category deleted successfully');
      setIsModalOpen(false);  // Close the modal
    } catch (err) {
      toast.error(err);
      setError('Failed to delete category.');
      setIsModalOpen(false);  // Close modal even if deletion fails
    }
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h4 className="text-xl font-bold mb-4">Manage Categories</h4>
      <Link to="/add-category" className="text-white text-lg text-semibold bg-blue-500 rounded-sm px-3 py-2 mb-4 inline-block">
        Add New Category
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Image</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map(category => (
                <tr key={category._id} className="border-b">
                  <td className="py-2 px-4 border">{category.name}</td>
                  <td className="py-2 px-4 border">{category.description}</td>
                  <td className="py-2 px-4 border">
                    <img 
                      src={category.imageURL} 
                      alt={category.name} 
                      className="w-16 h-16 object-cover" 
                    />
                  </td>
                  <td className="py-2 px-4 border">
                    <Link to={`/edit-category/${category._id}`} className="bg-yellow-500 m-2 text-white px-2 py-1">
                      Edit
                    </Link>
                    {/* Trigger delete confirmation */}
                    <button 
                      className="bg-red-500 text-white px-2 py-1 m-2 ml-2" 
                      onClick={() => handleOpenModal(category._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">No Categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}  // Close modal handler
        onConfirm={handleDeleteCategory}      // Confirm delete handler
      />
      <ToastContainer/>
    </div>
  );
};

export default GetCategories;
