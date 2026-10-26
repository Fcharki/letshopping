import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByCategory } from '../../redux/productSlice'; 
import ProductByCategoryCard from '../product/productByCategoryCard';
import { useParams } from 'react-router-dom';
import Navbar from '../layout/navbar';
 import Footer from '../layout/footer';


const CategoryProductsPage = () => {
  const { category } = useParams(); // Extracting category from URL
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.categoryProducts); // Get products by category
  const { status, error } = useSelector((state) => state.products); // Accessing the right state slice

  useEffect(() => {
    dispatch(fetchProductsByCategory(category)); // Fetch products by category
  }, [dispatch, category]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <>
    <Navbar/>
    <div className="container mx-auto mt-9 px-4 py-3  xl:mx-8 2xl:mx-8">
      {products && products.length > 0 && (  // Conditionally render the title
        <h2 className="text-2xl font-semibold mt-10">Products in "{category}" Category:</h2>
      )}
      <ProductByCategoryCard products={products} /> {/* Use new card here */}
    </div>
    <Footer/>
    </>
  );
};

export default CategoryProductsPage;
