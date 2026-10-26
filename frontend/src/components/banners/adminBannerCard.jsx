import React from 'react';

const BannerCard = ({ banner, onEdit, onDelete }) => {
  return (
    <div className="border rounded shadow p-4">
      <img src={banner.imageUrl} alt={banner.title} className="w-full h-40 object-cover mb-2" />
      {/* <h3 className="text-lg font-semibold">{banner.title}</h3>
      <p className="text-gray-600">{banner.description}</p> */}
      <div className="mt-4">
        <button onClick={onEdit} className="p-2 text-white bg-yellow-500 mr-2">
        Edit
      </button>
      <button onClick={onDelete} className="p-2 text-white bg-red-500">
        Delete
      </button>
      </div>
    </div>
  );
};

export default BannerCard;
