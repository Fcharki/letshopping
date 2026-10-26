import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_APP_API_URL
// Async thunk to fetch the user's cart from the server
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
    const token = localStorage.getItem('token'); // Ensure you are retrieving the token correctly

    const response = await axios.get(`${apiUrl}/api/cart`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data; // The data will be the cart returned by the server
});


// Thunk to remove an item from the cart
// Remove from Cart Thunk
export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (itemId, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`${apiUrl}/api/cart/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Item removed:", response.data);
            return itemId;
        } catch (error) {
            console.error("Remove from cart error:", error.response.data);
            return rejectWithValue(error.response.data);
        }
    }
);


// Initial cart state
const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// Cart slice
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const item = action.payload;
            const existingItem = state.items.find(
                (i) => i.productId._id === item.productId._id
            );
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                state.items.push(item);
            }
        },
        // This reducer is unused in the current flow; consider removing it
        removeItem: (state, action) => {
            const itemId = action.payload;
            state.items = state.items.filter((item) => item.productId._id !== itemId);
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.items; 
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message; // Capture error message
                console.error('Fetch cart error:', action.error.message); // Log the error
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                console.log("Removing item ID:", action.payload); // Log the ID being removed
                state.items = state.items.filter(item => item.productId._id !== action.payload);
            });
    }
});

// Export the actions and reducer
export const { addItem } = cartSlice.actions; // Keep only addItem if removeItem is not used
export default cartSlice.reducer;
