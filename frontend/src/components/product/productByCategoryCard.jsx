import React from 'react';
import ProductCard from './productCard';
import { Link } from 'react-router-dom';


const ProductByCategoryCard = ({ products }) => {
  if (!products || products.length === 0) {
    return (
<>
{/* <Link to="/"><button className='bg-indigo-600 rounded-full text-white font-semibold px-4 p-2'>Go Back</button></Link> */}
      <div className="flex justify-center items-center  mt-20 mb-36">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded shadow-lg text-center">
          <h4 className="font-semibold text-xl">No products available in this category.</h4>
          <p className="text-md mt-2">Please check back later or explore other categories!</p>
        </div>
      </div>
      </>
      
    );
  }

  return (

    <div className=' mt-10 mb-16'>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard key={product._id} product={product} /> 
        ))}
      </div>
    </div>
 
  );
};

export default ProductByCategoryCard;
