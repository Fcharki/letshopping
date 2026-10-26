import React, { useState } from 'react';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';

// todo: to be implemented dynamically later
const FAQPage = () => {
  const faqs = [
    {
      question: "What is LetShopping?",
      answer: "LetShopping is an eCommerce platform that offers a wide variety of high-quality products across multiple categories."
    },
    {
      question: "How can I create an account?",
      answer: "You can create an account by clicking on the 'Register' button on our homepage and filling out the required information."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods, including credit/debit cards, PayPal, and other secure payment options."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you will receive an email with a tracking number to monitor your order's status."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unopened and unused products. Please check our return policy for more details."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team through the 'Contact Us' page or email us at support@letshopping.com."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null); // State to track the currently open FAQ

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle the open state
  };

  return (
    <>
    <Navbar/>
    <div className="container mx-auto  mt-10 px-4 py-8  min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h1>
      <div className="bg-white shadow-md rounded-lg">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b last:border-b-0">
            <h2 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleFAQ(index)} 
            >
              <span className="font-medium text-lg">{faq.question}</span>
              <span className="text-gray-500">{openIndex === index ? '-' : '+'}</span>
            </h2>
            {openIndex === index && ( // Display the answer if the current FAQ is open
              <div className="p-4 text-gray-700">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default FAQPage;
