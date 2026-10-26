import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImageToCloudinary } from '../../service/cloudinaryService';
import { fetchBannerById, updateBanner } from '../../redux/bannerSlice';
import { toast } from 'react-toastify';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';
import { useParams, useNavigate } from 'react-router-dom';

const EditBanner = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const selectedBanner = useSelector((state) => state.banners.selectedBanner);
  const loading = useSelector((state) => state.banners.loading);
  const error = useSelector((state) => state.banners.error);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for the image preview
  const [link, setLink] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchBanner = async () => {
      await dispatch(fetchBannerById(id));
    };

    fetchBanner();
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedBanner) {
      setTitle(selectedBanner.title);
      setDescription(selectedBanner.description);
      setImage(selectedBanner.imageUrl); // Check if this is the correct field name
      setImagePreview(selectedBanner.imageUrl); // Set the initial preview
      setLink(selectedBanner.link || '');
      setStartDate(selectedBanner.startDate ? selectedBanner.startDate.split('T')[0] : '');
      setEndDate(selectedBanner.endDate ? selectedBanner.endDate.split('T')[0] : '');
    } else if (error) {
      toast.error('Banner not found.');
      navigate('/banners');
    }
  }, [selectedBanner, error, navigate]);

  // Cleanup the object URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Show preview of the new image
    } else {
      setImage(null); // Reset if no image is selected
      setImagePreview(null); // Reset the image preview as well
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let imageUrl = selectedBanner.imageUrl; // Default to the existing image URL
  
    // If a new image is selected, upload it to Cloudinary
    if (image && typeof image !== 'string') { // Check if a new image file is selected
      try {
        const cloudinaryRes = await uploadImageToCloudinary(image, 'm7dylsa7');
        imageUrl = cloudinaryRes.secure_url; // Get the new image URL from Cloudinary
        console.log("Cloudinary image URL: ", imageUrl); // <-- Add this line to check
      } catch (uploadError) {
        console.log(uploadError); // <-- Add this to check the error
        toast.error('Failed to upload image.');
        return; // Exit the function if the upload fails
      }
    }
  
    // Prepare the updated banner data
    const updatedBanner = {
      title,
      description,
      imageUrl,
      link,
      startDate,
      endDate,
    };
  
    // Dispatch the updateBanner action
    dispatch(updateBanner({ id, updatedBanner }))
      .unwrap()
      .then(() => {
        toast.success('Banner updated successfully!');
        navigate('/admin/dashboard'); // Redirect after successful update
      })
      .catch((error) => {
        toast.error('Failed to update banner.');
      });
  };
  
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white shadow-md my-10 rounded-lg p-8 space-y-6 w-96">
            <h2 className="text-2xl font-bold text-center">Edit Banner</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Image Preview */}
            {imagePreview && (
              <img src={imagePreview} alt="Banner Preview" className="mb-4" />
            )}

            {/* Form Fields */}
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
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
              Update Banner
            </button>
          </form>
        )}
      </div>
      <Footer />
    </>
  );
};

export default EditBanner;
