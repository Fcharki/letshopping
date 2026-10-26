import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent, confirmPayment, confirmOrderPayment } from '../../redux/ordersSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderPaymentForm = ({ orderId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { clientSecret, paymentIntentId, paymentStatus, paymentError } = useSelector((state) => state.orders);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      dispatch(createPaymentIntent(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (paymentError) {
      console.error("Payment Error:", paymentError);
    }
  }, [paymentError]);
  


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    if (!stripe || !elements || !clientSecret) {
      setLoading(false);
      return;
    }
  
    const cardElement = elements.getElement(CardElement);  // Get the cardElement here
  
    try {
      // Create a payment method using the card element
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
  
      if (error) {
        console.log('Errors in orderpayemtform in handlesubmit: ', error);
        
        throw new Error(error.message);
      }

  
      // Dispatch the confirmPayment action with the paymentMethod ID
      const paymentResult = await dispatch(
        confirmPayment({ stripe, clientSecret, paymentMethod: paymentMethod.id })
      ).unwrap();
  
      if (paymentResult && paymentResult.paymentIntent && paymentResult.paymentIntent.status === 'succeeded') {
        toast.success('Payment succeeded!');

        if (orderId) {
          try {
            await dispatch(
              confirmOrderPayment({
                orderId,
                paymentIntentId: paymentResult.paymentIntent.id || paymentIntentId,
              })
            ).unwrap();
            toast.success('Order marked as paid!');
          } catch (error) {
            toast.error(`Failed to confirm order payment: ${error}`);
          }
        } else {
          toast.error('Order ID is missing, cannot confirm payment.');
        }
      }
      
    } catch (error) {
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="md:flex md:flex-col md:min-h-screen min-h-[600px] sm:min-h-[500px]">
    <form className="w-full max-w-md mx-auto p-12 bg-white border md:mt-44 mt-30 mb-8 border-gray-300 lg:mb-24 shadow-lg rounded-lg" onSubmit={handleSubmit}>
      <h2 className="text-center text-xl font-semibold mb-6">Complete Your Payment</h2>
  
      <div className="mb-6 p-3 border border-gray-300 rounded-md">
        {/* Adding horizontal margin for mobile (mx-4) and larger devices (mx-0) */}
        <CardElement options={{ hidePostalCode: true }} />
      </div>
  
      <button
        className={`w-full py-3 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-500'}`}
        type="submit"
        disabled={!stripe || loading || paymentStatus === 'processing'}
      >
        {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
  
      {paymentError && <p className="text-red-500 mt-4">{paymentError}</p>}
    </form>
    {/* <ToastContainer /> */}
  </div>
  

  );
};

export default OrderPaymentForm;
