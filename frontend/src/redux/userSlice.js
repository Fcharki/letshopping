import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

// Initial state for the user
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user; 
      state.token = action.payload.token; 
      state.isAuthenticated = true; 
      state.loading = false;
    
      // Store the token in localStorage
      localStorage.setItem('token', action.payload.token);
    }
    ,
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; 
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserProfileSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload }; 
    },
    setUserFromToken: (state, action) => {
        const token = action.payload.token;

        if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
          state.isAuthenticated = false;
          state.token = null;
          state.user = null;
          return;
        }

        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
          } else {
            state.user = {
              id: decodedToken.id,
              role: decodedToken.role,
              name: decodedToken.name,
            };
            state.token = token;
            state.isAuthenticated = true;
          }
        } catch (e) {
          state.isAuthenticated = false;
          state.token = null;
          state.user = null;
        }
      },
          
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload }; 
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError, setUserFromToken, updateUserProfileSuccess } = userSlice.actions;

export default userSlice.reducer;
