import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners } from '../../../redux/bannerSlice';
import { toast, ToastContainer } from 'react-toastify';
import BannerList from '../../banners/adminBannerList';


const apiUrl = import.meta.env.VITE_APP_API_URL
const ManageBanners = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { banners } = useSelector((state) => state.banners); // Get banners from Redux store

  const [bannerIdToDelete, setBannerIdToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  const handleAddBanner = () => {
    navigate('/banners/add-banner');
  };

  const handleEditBanner = (id) => {
    navigate(`/banners/edit-banner/${id}`);
  };

  const handleDeleteBanner = (bannerId) => {
    setBannerIdToDelete(bannerId);
    setModalOpen(true);
  };

  const confirmDeleteBanner = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${apiUrl}/api/banners/${bannerIdToDelete}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Banner deleted successfully.');
      dispatch(fetchBanners()); // Refresh banner list after deletion
    } catch (error) {
      toast.error('Failed to delete banner.');
      console.error(error);
    } finally {
      setModalOpen(false);
      setBannerIdToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <button
          className="bg-blue-500 text-white text-lg font-normal rounded-sm mx-4 px-3 py-2"
          onClick={handleAddBanner}
        >
          Add Banner
        </button>
      </div>

      <BannerList onEdit={handleEditBanner} onDelete={handleDeleteBanner} />
      <ToastContainer/>
    </div>
  );
};

export default ManageBanners;
