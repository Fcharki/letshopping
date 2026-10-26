import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchBanners, fetchBannerById, deleteBanner } from '../../redux/bannerSlice';
import BannerCard from './adminBannerCard';
import { toast } from 'react-toastify';
import ConfirmationModal from '../admin/adminScreens/confirmationModal'; 

const BannerList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { banners, loading, error, selectedBanner } = useSelector((state) => state.banners);
  
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal open/close
  const [bannerToDelete, setBannerToDelete] = useState(null); // State to track which banner is being deleted

  useEffect(() => {
    if (id) {
      dispatch(fetchBannerById(id));
    } else {
      dispatch(fetchBanners());
    }
  }, [dispatch, id]);

  const handleEdit = (bannerId) => {
    navigate(`/banners/edit-banner/${bannerId}`);
  };

  const handleDelete = (bannerId) => {
    // Open the modal and store the banner ID to be deleted
    setBannerToDelete(bannerId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteBanner(bannerToDelete)).unwrap();
      navigate('/admin/dashboard');
      toast.success('Banner deleted successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to delete banner.');
    } finally {
      setIsModalOpen(false); // Close the modal after deletion
      setBannerToDelete(null); // Clear the bannerToDelete state
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="grid mb-10 grid-cols-1 md:grid-cols-1 lg:grid-cols-3 mt-5 gap-4">
        {id ? (
          selectedBanner ? (
            <BannerCard
              key={selectedBanner._id}
              banner={selectedBanner}
              onEdit={() => handleEdit(selectedBanner._id)}
              onDelete={() => handleDelete(selectedBanner._id)} // Trigger delete modal
            />
          ) : (
            <p>No banner found with the given ID.</p>
          )
        ) : (
          banners.map((banner) => (
            <BannerCard
              key={banner._id}
              banner={banner}
              onEdit={() => handleEdit(banner._id)}
              onDelete={() => handleDelete(banner._id)} // Trigger delete modal
            />
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close the modal
        onConfirm={confirmDelete} // Confirm deletion
      />
    </>
  );
};

export default BannerList;
