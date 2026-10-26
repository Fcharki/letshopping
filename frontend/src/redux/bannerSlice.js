import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_APP_API_URL

export const fetchBanners = createAsyncThunk('banners/fetchBanners', async () => {
  const response = await axios.get(`${apiUrl}/api/banners`);
  return response.data;
});

export const fetchBannerById = createAsyncThunk('banners/fetchBannerById', async (id) => {
  const response = await axios.get(`${apiUrl}/api/banners/${id}`);
  return response.data;
});

export const updateBanner = createAsyncThunk(
  'banners/updateBanner',
  async ({ id, updatedBanner }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${apiUrl}/api/banners/${id}`, updatedBanner, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || 'Failed to update banner.'
        : 'Network error occurred.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteBanner = createAsyncThunk(
  'banners/deleteBanner',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${apiUrl}/api/banners/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return id; // Return the ID of the deleted banner
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || 'Failed to delete banner.'
        : 'Network error occurred.';
      return rejectWithValue(errorMessage);
    }
  }
);

const bannerSlice = createSlice({
  name: 'banners',
  initialState: {
    banners: [],
    loading: false,
    error: null,
    selectedBanner: null, // Ensure selectedBanner is initialized
  },
  reducers: {
    clearBanner: (state) => {
      state.selectedBanner = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.banners = action.payload;
        state.loading = false;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBannerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBannerById.fulfilled, (state, action) => {
        state.selectedBanner = action.payload;
        state.loading = false;
      })
      .addCase(fetchBannerById.rejected, (state, action) => {
        state.loading = false;
        state.selectedBanner = null;
        state.error = action.error.message;
      })
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous error
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted banner from the state
        state.banners = state.banners.filter(banner => banner._id !== action.payload);
        // toast.success('Banner deleted successfully!');
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Use the error message
      }).addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        // Find the banner in the list and update it
        const index = state.banners.findIndex(banner => banner._id === action.payload._id);
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
        // toast.success('Banner updated successfully!');
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to update banner.');
      });;
  },
});

export const { clearBanner } = bannerSlice.actions;
export default bannerSlice.reducer;
