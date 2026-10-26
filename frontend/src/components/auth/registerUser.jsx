import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Joi from 'joi';
import regimg from "../../assets/images/reg-img.avif";
import hplogo from "../../assets/images/logo1.png";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Define your Joi validation schema
const validateSignUp = (obj) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)).required()
            .messages({ 'string.pattern.base': `The email address is not valid. Here is an example of a valid email: example@gmail.com.` }),
        password: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).required()
            .messages({ 'string.pattern.base': `The password must contain at least 8 characters, including at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&).` }),
        address: Joi.string().required(),
        phone: Joi.string().trim().length(10).required().messages({ 'string.length': `The phone number must contain exactly 10 digits.` }),
        role: Joi.string().valid('customer', 'admin')
    });

    return schema.validate(obj);
}

const apiUrl = import.meta.env.VITE_APP_API_URL
const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [validationSchema, setValidationSchema] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // Fetch the validation schema
    useEffect(() => {
        const fetchValidationSchema = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/users/validation-schema`);
                setValidationSchema(response.data);
                console.log("Validation Schema Fetched: ", response.data);
            } catch (error) {
                console.error("Error fetching validation schema: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchValidationSchema();
    }, []);

    const notifySuccess = () => {
        toast.success('🎉 Success! Please verify your email!', {});
    };

    const notifyError = (message) => {
        toast.error(`❌ Registration Failed: ${message}`, {});
    };

    const validateInputs = () => {
        if (!validationSchema) {
            return { error: { details: [{ message: "Validation schema is not yet loaded." }] } };
        }

        // Use the local Joi validation
        const { error } = validateSignUp({
            name,
            email,
            password,
            address,
            phone
        });
        
        return error;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("Attempting to validate inputs...");
        const error = validateInputs();

        console.log("Validation Result: ", error);

        if (error) {
            notifyError(error.details[0].message);
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/users/register`, {
                name,
                email,
                password,
                address,
                phone,
            });

            console.log("Registration Response: ", response);

            if (response.data) {
                notifySuccess();
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            }

            // Clear the form fields after successful registration
            setName('');
            setEmail('');
            setPhone('');
            setPassword("");
            setAddress('');

        } catch (error) {
            console.error("Registration Error: ", error);
            notifyError(error.response?.data?.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="max-h-screen flex flex-col items-center justify-center bg-gray-50 pb-20">
            <div>
                <a href='/'>
                    <img src={hplogo} alt="Logo" className="w-64" />
                </a>
            </div>
            <div className="bg-white mx-auto shadow-lg mb-10 rounded-lg flex flex-col lg:flex-row w-11/12 lg:w-3/5">
                <div className="w-full lg:w-1/2 p-8 space-y-6 pt-5 p-4 bg-indigo-200">
                    <h1 className="text-3xl font-semibold text-center">Create an account</h1>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div  className="relative">
                            <input
                                type="text"
                                placeholder='Name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="placeholder-gray-600 px-4 text-gray-700 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 p-2"
                            />
                        </div>
                        <div className="relative w-full">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="placeholder-gray-600 px-4 text-gray-700 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 p-2 pr-10"
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </span>
                    </div>
                    <div>
                        <div className="relative">
                            <input 
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className="block w-full px-4 placeholder-gray-600 py-3 rounded-lg border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                            />
                            <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                            >
                            {showPassword ? (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                            </button>
                        </div>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder='Address'
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className="placeholder-gray-600  px-4 text-gray-700 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 p-2"
                            />
                        </div>
                        <div>
                            <input
                                type="tel"
                                placeholder='Phone'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="placeholder-gray-600 px-4 text-gray-700 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300 p-2"
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-3 mt-4 ${loading ? "bg-gray-300" : "bg-blue-600"} text-white font-medium rounded-lg hover:bg-blue-700 transition-colors`}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Register"}
                        </button>
                    </form>
                </div>
                <div className="hidden lg:flex w-full lg:w-1/2 bg-white-500 text-white flex justify-center items-center relative">
                    <img
                        src={regimg}
                        alt="sign up image"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Register;
