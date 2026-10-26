import React from 'react';
// import aboutImage from '../../assets/images/brand.png';
import aboutImage from '../../assets/images/brand2.webp';
// import aboutImage from '../../assets/images/lets-brand.webp';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';

const AboutPage = () => {
  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden mb-10">
        <div className="flex flex-col md:flex-row">
          {/* Brand Image */}
          <div className="md:w-1/2">
            <img 
              src={aboutImage} 
              alt="LetShopping Brand"
              className="object-cover w-full h-full"
            />
          </div>
          
          {/* About Content */}
          <div className="md:w-1/2 p-10 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-center md:text-left mb-4 text-gray-800">
              Welcome to LetShopping!
            </h1>
            <p className="text-gray-700 text-lg mb-4">
              At LetShopping, we offer a wide range of high quality products across various categories, ensuring that you find exactly what you need.
            </p>
            <p className="text-gray-600 mb-4">
              Our mission is to provide an enjoyable shopping experience, with an emphasis on quality and customer satisfaction. Whether you're looking for the latest fashion trends, electronics, home goods, or more, we have something for everyone.
            </p>
            <p className="text-gray-600 mb-4">
              Join us today and discover the joy of shopping at LetShopping, where quality meets convenience.
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default AboutPage;
