import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from '../components/auth/registerUser';
import Login from '../components/auth/loginInUser';
import Homepage from '../Home/homePage';
import Navbar from '../components/layout/navbar';
import AddProduct from '../components/product/addProduct';
import EditProduct from '../components/product/editProduct';
import VerifyEmail from '../components/auth/emailVerify';
import AddCategory from '../components/categories/addCategory';
import EditCategory from '../components/categories/editCategory';
import AddBanner from '../components/banners/addBanner'; 
import EditBanner from '../components/banners/editBanner'; 
// import BannerList from '../components/banners/bannerList'; 
import AdminDashboard from '../components/admin/adminDashboard';
import Products from '../components/admin/adminScreens/manageProducts';
import RequestPasswordReset from '../components/auth/password-reset-request-form';
import ResetPassword from '../components/auth/password-reset-form';
import NotFoundPage from '../components/auth/notFoundPage';
import AdminRoute from '../components/auth/adminRoute';
import AddReview from '../components/reviews/addReview';
import ProductDetail from '../components/product/productDetails';
import ViewCart from '../components/cart/viewCart';
import AuthRoute from '../components/auth/authRoute';
import ViewOrders from '../components/orders/viewCustmrOrders';
import Checkout from '../components/orders/checkout';
import OrderSummary from '../components/orders/orderSummary';
import SearchResultsPage from '../components/product/searchResults';
import CategoryProductsPage from '../components/categories/categoryProductsPage';
import OrderPayment from '../components/orders/orderPayment';
import AboutPage from '../components/footer-links/aboutPage';
import ContactPage from '../components/footer-links/contactPage';
import FAQPage from '../components/footer-links/faqPage';
import UserProfile from '../components/user/userProfil';
import { ToastContainer } from 'react-toastify';

const Router = () => {
  return (
    <>
      <ToastContainer /> 
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/nav" element={<Navbar />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
      <Route path="/edit-product/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/add-category" element={<AdminRoute><AddCategory /></AdminRoute>} />
      <Route path="/edit-category/:id" element={<AdminRoute><EditCategory /></AdminRoute>} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/add-review" element={<AuthRoute><AddReview /></AuthRoute>} />
      <Route path="/checkout" element={<AuthRoute><Checkout /></AuthRoute>} />
      <Route path="/pay" element={<AuthRoute><OrderPayment /></AuthRoute>} />
      <Route path="/order-summary" element={<AuthRoute><OrderSummary /></AuthRoute>} />
      <Route path="/orders" element={<AuthRoute><ViewOrders /></AuthRoute>} />
      <Route path="/cart" element={<AuthRoute><ViewCart /></AuthRoute>} />
      <Route path="/profile" element={<AuthRoute><UserProfile /></AuthRoute>} />
      <Route path="/category/:category" element={<CategoryProductsPage />} />
      <Route path="/search/:searchTerm" element={<SearchResultsPage />} />
      <Route path="/reset-password" element={<RequestPasswordReset />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/banners/add-banner" element={<AdminRoute><AddBanner /></AdminRoute>} />
      <Route path="/banners/edit-banner/:id" element={<AdminRoute><EditBanner /></AdminRoute>} />
      <Route path="/not-found" element={<NotFoundPage />} />
    </Routes>
    </>
  );
};

export default Router;


