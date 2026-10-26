import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const apiUrl = import.meta.env.VITE_APP_API_URL
// Async thunk to fetch customer orders
export const fetchCustomersOrders = createAsyncThunk(
  'orders/fetchCustomersOrders',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${apiUrl}/api/orders/myorders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to cancel an order
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${apiUrl}/api/orders/${id}/cancel`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      const data = await response.json();
      return data; // Return the canceled order or a success message
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to activate a canceled order (using fetch instead of axios)
export const activateOrder = createAsyncThunk(
  'orders/activateOrder',
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${apiUrl}/api/orders/${id}/activate`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to activate order');
      }

      const data = await response.json();
      return data; // Return the activated order
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete an order (using fetch instead of axios)
export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${apiUrl}/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      return { id }; // Return the deleted order ID
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to create a payment intent for an order
// The server computes the amount from the order, it is never trusted from the client.
export const createPaymentIntent = createAsyncThunk(
  'orders/createPaymentIntent',
  async (orderId, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${apiUrl}/api/orders/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create payment intent');
      return { clientSecret: data.clientSecret, paymentIntentId: data.paymentIntentId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to confirm payment
export const confirmPayment = createAsyncThunk(
  'orders/confirmPayment',
  async ({ stripe, clientSecret, paymentMethod }, { rejectWithValue }) => {
    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod,  // Use the payment method passed from the component
      });

      if (error) {
        throw new Error(error.message);
      }

      return { paymentIntent };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Thunk to confirm the payment on the server after Stripe succeeds.
// The backend re-checks the PaymentIntent with Stripe before marking the order paid.
export const confirmOrderPayment = createAsyncThunk(
  'orders/confirmOrderPayment',
  async ({ orderId, paymentIntentId }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No authentication token found');
    }

    try {
      const response = await fetch(`${apiUrl}/api/orders/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, paymentIntentId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to confirm payment');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to update the order payment status (admin only)
export const updatePaymentStatus = createAsyncThunk(
  'orders/updatePaymentStatus',
  async ({ orderId, paymentStatus }, { rejectWithValue }) => {

    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No authentication token found');
    }

    try {
      const response = await fetch(`${apiUrl}/api/orders/update-payment-status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Slice definition
const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [], // all orders
    status: 'idle',
    clientSecret: null,
    paymentIntentId: null,
    paymentStatus: 'idle',
    paymentError: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetching orders
      .addCase(fetchCustomersOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCustomersOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Replace old orders with the fetched ones
      })
      .addCase(fetchCustomersOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Handling canceling orders
      .addCase(cancelOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const canceledOrder = action.payload.order;
        const index = state.items.findIndex((order) => order._id === canceledOrder._id);
        if (index !== -1) {
          state.items[index] = canceledOrder; // Update the specific order
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Handling activating orders
      .addCase(activateOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(activateOrder.fulfilled, (state, action) => {
        const activatedOrder = action.payload.order;
        const index = state.items.findIndex((order) => order._id === activatedOrder._id);
        if (index !== -1) {
          state.items[index].status = 'pending'; // Set the status to pending
        }
      })
      .addCase(activateOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Handling deleting orders
      .addCase(deleteOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.items = state.items.filter((order) => order._id !== action.payload.id); 
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.clientSecret = action.payload.clientSecret;
        state.paymentIntentId = action.payload.paymentIntentId;
      })

      // Handling orders payment process
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.paymentError = action.payload;
      })
      .addCase(confirmPayment.pending, (state) => {
        state.paymentStatus = 'processing';
      })
      .addCase(confirmPayment.fulfilled, (state) => {
        state.paymentStatus = 'succeeded';
        state.paymentError = null;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.paymentStatus = 'failed';
        state.paymentError = action.payload;
      })
      .addCase(confirmOrderPayment.fulfilled, (state) => {
        state.paymentStatus = 'succeeded';
        state.paymentError = null;
      })
      .addCase(confirmOrderPayment.rejected, (state, action) => {
        state.paymentStatus = 'failed';
        state.paymentError = action.payload;
      });
  },
});

export default ordersSlice.reducer;
