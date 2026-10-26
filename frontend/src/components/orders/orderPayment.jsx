import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useLocation } from 'react-router-dom';
import OrderPaymentForm from './orderPaymentForm';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';

// Load Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const OrderPayment = () => {
  const location = useLocation();
  const { totalAmount, orderId } = location.state || { totalAmount: 0, orderId: null };
  // console.log("Order Total Amount:", totalAmount);
  // console.log("Order ID:", orderId);
  

  return (
    <>
      <Navbar />
      <Elements stripe={stripePromise}>
      <OrderPaymentForm amount={totalAmount * 100} orderId={orderId} />{/* Convert dollars to cents and pass orderId */}

      </Elements>
      <Footer />
    </>
  );
};

export default OrderPayment;
