import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "../../redux/productSlice";
import SearchCard from "./searchCard";
import { useParams } from "react-router-dom";
import Navbar from "../layout/navbar";
import Footer from "../layout/footer";
import Spinner from "../auth/Spinner";

const SearchResultsPage = () => {
  const dispatch = useDispatch();
  const { searchTerm } = useParams();
  const { searchResults, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (searchTerm) {
      dispatch(searchProducts(searchTerm)); // Dispatch search action with the term
    }
  }, [dispatch, searchTerm]);

  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "failed") {
    return <div className="text-center text-red-500 font-semibold mt-6">Error: {error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-screen-xl py-3 mt-9 sm:mb-12 md:mb-72 min-h-[500px]">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Search Results for "<span className="text-gray-600">{searchTerm}</span>"
        </h2>

        {/* Search Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-hidden">
          {searchResults.length > 0 ? (
            searchResults.map((product) => <SearchCard key={product._id} product={product} />)
          ) : (
            <div className="col-span-full text-center text-gray-600">
              No products found for "<span className="font-semibold">{searchTerm}</span>"
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResultsPage;
