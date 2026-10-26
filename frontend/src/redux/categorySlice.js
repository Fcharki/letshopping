import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const apiUrl = import.meta.env.VITE_APP_API_URL
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
    const response = await fetch(`${apiUrl}/api/categories`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return response.json();
});

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const selectCategories = (state) => state.categories.categories;
export const selectLoading = (state) => state.categories.loading;
export const selectError = (state) => state.categories.error;

export default categorySlice.reducer;
