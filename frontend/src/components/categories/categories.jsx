import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, selectCategories, selectLoading, selectError } from '../../redux/categorySlice';
import { useNavigate } from 'react-router-dom';
import Spinner from '../auth/Spinner';

const Categories = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const categories = useSelector(selectCategories);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleCategoryClick = (category) => {
        navigate(`/category/${category}`); 
    };

    if (loading) return <Spinner/>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="flex flex-col px-5">
            <h2 className="text-3xl font-bold mt-8 mb-10 text-gray-700">Browse our categories</h2>
            {/* Responsive Grid: 3 columns on small devices, 6 columns on medium and up */}
            <div className="grid grid-cols-3 md:grid-cols-4 sm:grid-cols-3 gap-4 mb-10">
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className="m-4 flex flex-col items-center cursor-pointer"
                        onClick={() => handleCategoryClick(category.name)} 
                    >
                        {/* Adjusting size to make sure images resize well on phones */}
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
                            <img 
                                src={category.imageURL}
                                alt={category.name}
                                className="w-full h-full rounded-full object-cover border-4 border-gray-400"
                            />
                        </div>
                        <span className="mt-2 text-center text-lg font-semibold">{category.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;
