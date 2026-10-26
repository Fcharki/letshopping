const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
  const stars = Array(5).fill(0); // Create an array for 5 stars

  return (
    <div className="flex items-center">
      {stars.map((_, index) => {
        const starRating = index + 1;
        return (
          <svg
            key={index}
            onClick={() => !readOnly && onRatingChange(starRating)}
            className={`w-6 h-6 cursor-pointer ${starRating <= rating ? 'text-orange-500' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 3.73L3.82 18z" />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;
