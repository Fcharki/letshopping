import React, { useState } from 'react';
import contactImage from '../../assets/images/lets-brand.webp';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';
import axios from 'axios';


const apiUrl = import.meta.env.VITE_APP_API_URL
const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    // const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
    
        try {
            const response = await axios.post(`${apiUrl}/api/contact`, {
                name,
                email,
                message,
            });
    
            if (response.status === 200) {
                toast.success('Message sent successfully!');
                setName('');
                setEmail('');
                setMessage('');
            }
        } catch (err) {
            toast.error('Failed to send message. Please try again later.');
            setError('Failed to send message. Please try again later.');
        }
    };
    

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden mb-10">
                    <div className="flex flex-col md:flex-row">
                        {/* Brand Image */}
                        <div className="md:w-1/2">
                            <img 
                                src={contactImage}
                                alt="LetShopping Brand"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        
                        {/* Contact Information and Form */}
                        <div className="md:w-1/2 p-10 flex flex-col justify-center">
                            <h1 className="text-3xl font-bold text-center md:text-left mb-4 text-gray-800">
                                Contact Us
                            </h1>
                            <p className="text-gray-700 text-lg mb-4">
                                We would love to hear from you! Whether you have questions about our products, need assistance, or just want to share feedback, feel free to reach out.
                            </p>
                            
                            {/* Display success or error messages */}
                            {error && <p className="text-red-500">{error}</p>}
                            {/* {success && <p className="text-green-500">{success}</p>} */}
                            
                            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                                <input 
                                    type="text" 
                                    placeholder="Your Name" 
                                    className="p-2 border border-gray-300 rounded"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <input 
                                    type="email" 
                                    placeholder="Your Email" 
                                    className="p-2 border border-gray-300 rounded"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <textarea 
                                    placeholder="Your Message" 
                                    className="p-2 border border-gray-300 rounded"
                                    rows="4"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                ></textarea>
                                <button 
                                    type="submit" 
                                    className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                {/* <ToastContainer/> */}
            </div>
            <Footer />
        </>
    );
};

export default ContactPage;
