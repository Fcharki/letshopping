import React from 'react';
import { Link } from 'react-router-dom';

const SearchCard = ({ product }) => {
  return (
    <div key={product._id} className="p-3 border rounded shadow-lg">
      <Link to={`/products/${product._id}`}>
        <img src={product.imageURL} alt={product.name} className="w-full h-48 object-cover mb-4" />
        {/* <h3 className="text-lg font-semibold">{product.name}</h3> */}
        <p className="text-gray-600">{product.description}</p>
        <p className="text-xl font-bold rounded-full w-36 text-center bg-gray-300 p-2 mt-3">${product.price}</p>
      </Link>
    </div>
  );
};

export default SearchCard;
