import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import ProductCard from "../components/product/productCard";
import Categories from "../components/categories/categories";
import BannerList from "../components/banners/userBannerList";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./../redux/productSlice";
import ReactPaginate from "react-paginate"; // to paginate products
import Spinner from "../components/auth/Spinner";

const HomePage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items); // Get all products
  const { status, error } = useSelector((state) => state.products); // Get status and error
  
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8; // Number of products per page

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Get paginated products
  const startIndex = currentPage * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen p-4">
        <div className="container mx-auto px-4 py- mb-20">
          <h3 className="text-3xl font-bold text-gray-700 mt-16 mb-10 px-5">Our Good Deals</h3>
          <BannerList />
          <Categories />

          <h3 className="text-3xl font-bold text-gray-700 mt-8 mb-10 px-4">You may like</h3>
          
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:px-8 2x:px-8">
            {status === "loading" ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error: {error}</div>
            ) : products && products.length > 0 ? (
              paginatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div>No products available.</div>
            )}
          </div>

          {/* Pagination Controls */}
          {products.length > itemsPerPage && (
            <div className="flex justify-center mt-8">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={Math.ceil(products.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination flex space-x-2"}
                activeClassName={"active bg-indigo-500 text-white px-3 py-1 rounded"}
                pageClassName={"border px-3 py-1 rounded"}
                previousClassName={"border px-3 py-1 rounded"}
                nextClassName={"border px-3 py-1 rounded"}
              />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
