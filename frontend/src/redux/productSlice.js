import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const apiUrl = import.meta.env.VITE_APP_API_URL
// Async thunk to fetch all products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch(`${apiUrl}/api/products`);
  const data = await response.json();
  return data;
});

// Async thunk to fetch a single product by ID
export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${apiUrl}/api/products/${id}`);
    if (!response.ok) {
      throw new Error('Product not found');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk to fetch products by category
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (category, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${apiUrl}/api/category/${category}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        return []; // Return an empty array if no products are found
      }

      if (!response.ok) {
        throw new Error('Failed to fetch products by category');
      }

      const data = await response.json();
      return data; // Return the array of products in the category
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to search products by keyword
export const searchProducts = createAsyncThunk('products/searchProducts', async (keyword, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ keyword }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    const data = await response.json();
    return data; // Return the array of matching products
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [], // This holds all products
    product: null, // This holds the single product details
    searchResults: [], // This holds the search results
    categoryProducts: [], // This holds the products for a specific category
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    resetProductStatus: (state) => {
      state.status = 'idle';
      state.product = null; // Reset product details too if necessary
      state.searchResults = []; // Reset search results
      state.categoryProducts = []; // Reset category products
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling fetching all products
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Assuming payload is an array of products
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Handling fetching a single product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.product = action.payload; // Single product details
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Handling fetching products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categoryProducts = action.payload; // Store category-specific products
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      // Handling searching products by keyword
      .addCase(searchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchResults = action.payload; // Update search results
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { resetProductStatus } = productSlice.actions;
export default productSlice.reducer;
