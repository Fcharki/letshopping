import { useState, useEffect } from 'react';

const apiUrl = import.meta.env.VITE_APP_API_URL
const GlobalRatingElement = ({ productId }) => {
  const [globalRating, setGlobalRating] = useState(0); 
  const [count, setCount] = useState(0); // To store the number of reviews

  useEffect(() => {
    const fetchGlobalRating = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/products/${productId}/global-rating`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        setGlobalRating(data.globalRating);
        setCount(data.count); 
      } catch (error) {
        throw new Error(error);
      }
    };
  
    fetchGlobalRating();
  }, [productId]); 
  
  const stars = Array(5).fill(0);

  return (
    <div className="flex items-center">
      {stars.map((_, index) => (
        <svg
          key={index}
          className={`w-8 h-8 ${globalRating >= index + 1 ? 'text-orange-500' : 'text-gray-300'}`} 
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        > 
          <path d="M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 3.73L3.82 18z" />
        </svg>
      ))}
      {count > 0 && <span className="ml-2 text-md mt-2 focnt-medium text-gray-500">({count} reviews)</span>}
    </div>
  );
};

export default GlobalRatingElement;
