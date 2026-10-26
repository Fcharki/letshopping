import React from 'react';

const BannerCard = ({ banner }) => {
  return (
    
      <div className="bg-white mt-2 w-full h-auto transition-shadow duration-200 mx-2 sm:mx-4">  
     <a href={banner.link} target='_blank' rel="noopener noreferrer">   
        <img 
          src={banner.imageUrl} 
          alt={banner.title} 
          className="w-full h-auto xs:h-32 sm:h-48 object-cover" 
        /> 
        {/* Optional Title and Description */}
        {/* <h3 className="text-base sm:text-lg text-gray-600 font-bold mt-2">{banner.title}</h3>
        <h4 className="text-base sm:text-lg font-bold mt-1">{banner.description}</h4> */}
         </a>
      </div>
   
  );
};

export default BannerCard;