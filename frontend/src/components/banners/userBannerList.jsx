import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners } from '../../redux/bannerSlice';
import BannerCard from './userBannerCard';
import Spinner from '../auth/Spinner';

const BannerList = () => {
  const dispatch = useDispatch();
  const { banners, loading, error } = useSelector((state) => state.banners);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  if (loading) return <Spinner/>
  if (error) return <p className="text-red-500">{error}</p>;

 
  return (
    <div>
    <div className="grid mb-10 grid-cols-1  md:grid-cols-1 lg:grid-cols-3 mt-5 gap-4 px-5">
      {banners.map((banner) => (
        <BannerCard key={banner._id} banner={banner} />
      ))}
    </div>
    </div>
  );
};

export default BannerList;