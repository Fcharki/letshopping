import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import ConfirmationModal from './confirmationModal'; 

const apiUrl = import.meta.env.VITE_APP_API_URL

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // For displaying user details
  const [editingUserId, setEditingUserId] = useState(null); // For editing user
  const [formData, setFormData] = useState({}); // For storing form data
  const [isModalOpen, setIsModalOpen] = useState(false); // For controlling modal visibility
  const [userToDelete, setUserToDelete] = useState(null); // ID of the user to delete

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${apiUrl}/api/users/admin/customers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setError('Unexpected response structure.');
        }
      } catch (err) {
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Open the confirmation modal
  const handleOpenDeleteModal = (id) => {
    // console.log('Is modal open:', isModalOpen); // debugging

    setUserToDelete(id); // Set user ID to delete
    setIsModalOpen(true); // Open modal
  };

  // Handle the account deletion
  const handleDeleteAccount = async () => {
    try {
 
      
      await axios.delete(`${apiUrl}/api/users/admin/customers/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(users.filter(user => user._id !== userToDelete)); // Update users state
      toast.success('User deleted successfully');
      setIsModalOpen(false); // Close the modal
    } catch (err) {
      toast.error(err);
      setError('Failed to delete account.');
      setIsModalOpen(false); // Close the modal even if deletion fails
    }
  };

  const handleDeactivateAccount = async (id) => {
    try {
      await axios.put(`${apiUrl}/api/users/admin/customers/${id}/deactivate`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(users.map(user => user._id === id ? { ...user, active: false } : user));
      toast.success('User desactivated successfully');
    } catch (err) {
      toast.error(err);
      setError('Failed to deactivate account.');
    }
  };

  const handleActivateAccount = async (id) => {
    try {
      await axios.put(`${apiUrl}/api/users/admin/customers/${id}/activate`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(users.map(user => user._id === id ? { ...user, active: true } : user));
      toast.success('User activated successfully');
    } catch (err) {
      toast.error(err);
      setError('Failed to activate account.');
    }
  };

  const handleContactCustomer = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const toggleUserDetails = (id) => {
    setSelectedUserId(selectedUserId === id ? null : id); // Toggle user details
    setEditingUserId(null); // Reset editing mode if it's on
  };

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
    });
  };

  const handleUpdateUser = async (id) => {
    try {
      const response = await axios.put(`${apiUrl}/api/users/admin/customers/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data) {
        setUsers(users.map(user => user._id === id ? { ...user, ...formData } : user));
        toast.success('Updated user data successfully');
        setEditingUserId(null); // Close editing form after successful update
      }
    } catch (err) {
      toast.error(err);
      setError('Failed to update user.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Customers</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-800 text-white">
              <th className="py-3 px-6 border">Name</th>
              <th className="py-3 px-6 border">Email</th>
              <th className="py-3 px-6 border">Phone</th>
              <th className="py-3 px-6 border">Role</th>
              <th className="py-3 px-6 border">Address</th>
              <th className="py-3 px-6 border">Verified</th>
              <th className="py-3 px-6 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <React.Fragment key={user._id}>
                  <tr className="border-b">
                    <td className="py-2 px-4 border">{user.name}</td>
                    <td className="py-2 px-4 border">{user.email}</td>
                    <td className="py-2 px-4 border">{user.phone || ''}</td>
                    <td className="py-2 px-4 border">{user.role}</td>
                    <td className="py-2 px-4 border">{user.address || ''}</td>
                    <td className="py-2 px-4 border">{user.isVerified ? "Yes" : "No"}</td>
                    <td className="py-2 px-4 border">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 mb-2"
                        onClick={() => toggleUserDetails(user._id)}
                      >
                        {selectedUserId === user._id ? 'Hide' : 'View more ...'}
                      </button>
                      {user.active ? (
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 mb-2 ml-2"
                          onClick={() => handleDeactivateAccount(user._id)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="bg-green-500 text-white px-2 py-1 mb-2 ml-2"
                          onClick={() => handleActivateAccount(user._id)}
                        >
                          Activate
                        </button>
                      )}
                      <button
                        className="bg-red-500 text-white px-2 py-1 mb-2 ml-2"
                        onClick={() => handleOpenDeleteModal(user._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-teal-500 text-white px-2 py-1 mb-2 ml-2"
                        onClick={() => handleContactCustomer(user.email)}
                      >
                        Contact
                      </button>
                      <button
                        className="bg-orange-500 text-white px-2 py-1 mb-2 ml-2"
                        onClick={() => handleEditClick(user)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>

                  {/* Inline User Details */}
                  {selectedUserId === user._id && (
                    <tr>
                      <td colSpan="7" className="p-4 bg-gray-100">
                        <div>
                          <p><strong>Account Status :</strong> {user.active ? 'Active' : 'Inactive'}</p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Edit User Form */}
                  {editingUserId === user._id && (
                    <tr>
                      <td colSpan="7" className="p-4 bg-gray-200">
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(user._id); }}>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium">Name</label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 p-2 block w-full border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium">Email</label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 p-2 block w-full border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium">Phone</label>
                              <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 p-2 block w-full border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium">Address</label>
                              <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="mt-1 p-2 block w-full border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <button
                              type="submit"
                              className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
                              onClick={() => setEditingUserId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">No Customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
    <ConfirmationModal
        isOpen={isModalOpen}           // Make sure you pass isOpen correctly
        onClose={() => setIsModalOpen(false)} // Close function
        onConfirm={handleDeleteAccount}
          />
      )}
      <ToastContainer/>
    </div>
  );
};

export default Customers;
