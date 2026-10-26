import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; 
import productReducer from './productSlice';
import categoryReducer from './categorySlice';
import bannerReducer from './bannerSlice';
import cartReducer from './cartSlice';
import ordersReducer from './ordersSlice';

const store = configureStore({
  reducer: {
    user: userReducer, 
    products: productReducer,
    categories: categoryReducer,
    banners: bannerReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
});

export default store;
