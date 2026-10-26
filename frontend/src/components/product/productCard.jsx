import React from 'react';
import { Link } from 'react-router-dom';
import GlobalRatingElement from '../reviews/globalRatingCounter'; 


const ProductCard = ({ product }) => { {/* Pass product ID as props */}

  return (
    <div className="p-4 border shadow-md rounded hover:shadow-lg">
      <Link to={`/products/${product._id}`}>
        <img src={product.imageURL} alt={product.name} className="w-full h-48 object-cover mb-4 border rounded shadow-sm" />
        <GlobalRatingElement productId={product._id} /> 
        <p className="text-gray-900 mt-3">{product.description}</p>
        <p className="text-xl font-bold rounded-full w-36 text-center bg-gray-300 p-2 mt-3">${product.price}</p>
      </Link>
    </div>
  );
};

export default ProductCard;
