import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutButton from '../auth/logOutUser';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate(); // Use navigate for redirection
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [isMediumDevice, setIsMediumDevice] = useState(false);
  const [isLarge, setIsLarge] = useState(false);


  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`); // Navigate to search results page
    }
  };

  const checkDeviceSize = () => {
    const width = window.innerWidth;

    // Set isMediumDevice to true if width is between 768px and 1024px
    setIsMediumDevice(width >= 768 && width <= 1024);

    // Set isLarge to true if width is greater than 1024px
    setIsLarge(width > 1024);
  };

  useEffect(() => {
    checkDeviceSize(); // Check on initial render
    window.addEventListener('resize', checkDeviceSize); // Check on resize

    return () => {
      window.removeEventListener('resize', checkDeviceSize); // Cleanup listener
    };
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10 p-2 lg:px-3 xl:px-5">
     <div className="container mx-auto px-4 py-3 flex justify-between items-center">

      {/* Navbar rendering for large devices */}
     { isLarge && (
    <>
   {/* Logo */}
   <Link to="/" className="text-3xl font-bold text-indigo-600 brand-font">
          <span >Let'Shopping</span>
        </Link>

        {/* Large Screen Items */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Conditional rendering based on user role */}
          {isAuthenticated && user?.role === 'admin' ? (
            <>
              {/* Admin View */}
              {/* Search Bar */}
                <div className="relative flex items-center">
                  <input
                    type="text"
                    className="w-full pl-12 pr-12 py-3.5 bg-white rounded-xl border-2 
                              transition-all duration-300 placeholder:text-gray-400
                              focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                              border-indigo-100 hover:border-indigo-200
                              text-gray-700 font-medium"
                    placeholder="I'm shopping for..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  
                  {/* Search Icon */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="absolute left-4 w-5 h-5 text-gray-400"
                    viewBox="0 -960 960 960"
                  >
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                  </svg>

                  {/* Clear button (optional) */}
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-12 p-1 hover:bg-gray-100 rounded-full"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="w-4 h-4 text-gray-400" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}

                  {/* Search button */}
                  <button
                    onClick={handleSearch}
                    className={`absolute right-3 px-3 py-1.5 rounded-lg transition-all duration-300 
                              ${searchTerm ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-100 text-gray-400'}`}
                  >
                    Search
                  </button>
                </div>
              <>
            {/* Greeting */}
            <span className="text-gray-700 font-medium flex items-center space-x-4">
              {/* Cart Link */}
              <Link to="/cart" className="flex items-center text-gray-700 font-medium hover:text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                  <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
                </svg>
                <span className="ml-2">Cart</span>
              </Link>

              {/* Orders Link */}
              <Link to="/orders" className="flex items-center text-gray-700 font-medium hover:text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                  <path d="M160-160v-516L82-846l72-34 94 202h464l94-202 72 34-78 170v516H160Zm240-280h160q17 0 28.5-11.5T600-480q0-17-11.5-28.5T560-520H400q-17 0-28.5 11.5T360-480q0 17 11.5 28.5T400-440ZM240-240h480v-358H240v358Zm0 0v-358 358Z"/>
                </svg>
                <span className="ml-2">Orders</span>
              </Link>

              {/* Admin Name */}
              <div className="flex items-center text-gray-700 font-medium hover:text-blue-500 space-x-1">
               <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m430-500 283-283q12-12 28-12t28 12q12 12 12 28t-12 28L487-444l-57-56Zm99 99 254-255q12-12 28.5-12t28.5 12q12 12 12 28.5T840-599L586-345l-57-56ZM211-211q-91-91-91-219t91-219l120-120 59 59q7 7 12 14.5t10 15.5l148-149q12-12 28.5-12t28.5 12q12 12 12 28.5T617-772L444-599l-85 84 19 19q46 46 44 110t-49 111l-57-56q23-23 25.5-54.5T321-440l-47-46q-12-12-12-28.5t12-28.5l57-56q12-12 12-28.5T331-656l-64 64q-68 68-68 162.5T267-267q68 68 163 68t163-68l239-240q12-12 28.5-12t28.5 12q12 12 12 28.5T889-450L649-211q-91 91-219 91t-219-91Zm219-219ZM680-39v-81q66 0 113-47t47-113h81q0 100-70.5 170.5T680-39ZM39-680q0-100 70.5-170.5T280-921v81q-66 0-113 47t-47 113H39Z"/></svg>
               <span className="text-gray-800 font-medium">
                      Hello, Admin {user?.name || 'Admin'}
               </span>
               </div>

              {/* Profile Link */}
              <Link to="/profile" className="flex items-center text-gray-700 font-medium hover:text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                  <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Z"/>
                </svg>
                <span className="ml-2">Profile</span>
              </Link>

              {/* Dashboard Link */}
              <Link to="/admin/dashboard" className="flex items-center text-gray-700 font-medium hover:text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                  <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
                </svg>
                <span className="ml-2">Dashboard</span>
              </Link>

              {/* Logout Button */}
              <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EF4444">
                   <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
                 </svg>
                 <LogoutButton />
               </div>
                </span>
              </>

              </>

          ) : (
            <>
              {/* Non-admin view */}
              {/* Search Bar */}
              
              <div className="relative flex items-center">
                  <input
                    type="text"
                    className="w-full pl-12 pr-12 py-3.5 bg-white rounded-xl border-2 
                              transition-all duration-300 placeholder:text-gray-400
                              focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                              border-indigo-100 hover:border-indigo-200
                              text-gray-700 font-medium"
                    placeholder="I'm shopping for..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  
                  {/* Search Icon */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="absolute left-4 w-5 h-5 text-gray-400"
                    viewBox="0 -960 960 960"
                  >
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                  </svg>

                  {/* Clear button (optional) */}
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-12 p-1 hover:bg-gray-100 rounded-full"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="w-4 h-4 text-gray-400" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}

                  {/* Search button */}
                  <button
                    onClick={handleSearch}
                    className={`absolute right-3 px-3 py-1.5 rounded-lg transition-all duration-300 
                              ${searchTerm ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-100 text-gray-400'}`}
                  >
                    Search
                  </button>
                </div>

              {/* Authenticated User Greeting and Logout */}
              {isAuthenticated ? (
               <>
               {/* Cart Icon */}
               <Link to="/cart" className="flex items-center text-gray-700 font-medium hover:text-blue-500 space-x-1">
                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                   <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
                 </svg>
                 <span>Cart</span>
               </Link>
             
               {/* Orders Icon */}
               <Link to="/orders" className="flex items-center text-gray-700 font-medium hover:text-blue-500 space-x-1">
                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                   <path d="M160-160v-516L82-846l72-34 94 202h464l94-202 72 34-78 170v516H160Zm240-280h160q17 0 28.5-11.5T600-480q0-17-11.5-28.5T560-520H400q-17 0-28.5 11.5T360-480q0 17 11.5 28.5T400-440ZM240-240h480v-358H240v358Zm0 0v-358 358Z"/>
                 </svg>
                 <span>Orders</span>
               </Link>
             
               {/* Profile Icon */}
               <Link to="/profile" className="flex items-center text-gray-700 font-medium hover:text-indigo-600 space-x-1">
                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                   <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Z"/>
                 </svg>
                 <span>Profile</span>
               </Link>
             
               {/* Greeting */}
               <div className="flex items-center text-gray-700 font-medium hover:text-blue-500 space-x-1">
               <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m430-500 283-283q12-12 28-12t28 12q12 12 12 28t-12 28L487-444l-57-56Zm99 99 254-255q12-12 28.5-12t28.5 12q12 12 12 28.5T840-599L586-345l-57-56ZM211-211q-91-91-91-219t91-219l120-120 59 59q7 7 12 14.5t10 15.5l148-149q12-12 28.5-12t28.5 12q12 12 12 28.5T617-772L444-599l-85 84 19 19q46 46 44 110t-49 111l-57-56q23-23 25.5-54.5T321-440l-47-46q-12-12-12-28.5t12-28.5l57-56q12-12 12-28.5T331-656l-64 64q-68 68-68 162.5T267-267q68 68 163 68t163-68l239-240q12-12 28.5-12t28.5 12q12 12 12 28.5T889-450L649-211q-91 91-219 91t-219-91Zm219-219ZM680-39v-81q66 0 113-47t47-113h81q0 100-70.5 170.5T680-39ZM39-680q0-100 70.5-170.5T280-921v81q-66 0-113 47t-47 113H39Z"/></svg>
               <span className="text-gray-800 font-medium">
                    Hello, {user?.name || 'Customer'}
               </span>
               </div>
             
               {/* Logout Icon */}
               <div className="flex items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EF4444">
                   <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
                 </svg>
                 <LogoutButton />
               </div>
             </>
             
              ) : (
                <>
                  {/* Non-authenticated view */}
                  <Link to="/login" className="text-gray-700 font-medium hover:text-blue-500">
                    Login
                  </Link>
                  <Link to="/register" className="bg-indigo-500  font-medium  text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
        </>
  )}
      {/* Navbar rendering for medium devices */}
      {isMediumDevice && (
  <>
    {/* Logo */}
    <Link to="/" className="text-3xl font-bold text-indigo-600 brand-font">
      <span>Let'Shopping</span>
    </Link>

    {/* Navbar Items */}
    <div className="hidden md:flex flex-col items-start space-y-2 mt-2">
      <div className="flex items-center space-x-4">
        
        {/* Search Bar - Visible for all users */}
        <div className="relative mx-3">
          <input
            type="text"
            className="border-2 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-400 w-60"
            placeholder="I'm shopping for..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            onClick={handleSearch}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
            </svg>
          </button>
        </div>

        {/* Conditional Rendering for Authenticated Users */}
        {isAuthenticated ? (
          user?.role === 'admin' ? (
            <>
              {/* Admin View */}
              <Link to="/cart" className="text-gray-700 font-medium hover:text-blue-500">Cart</Link>
              <Link to="/orders" className="text-gray-700 font-medium hover:text-blue-500">Orders</Link>
              <Link to="/profile" className="text-gray-700 font-medium hover:text-indigo-600">Profile</Link>
              <Link to="/admin/dashboard" className="text-gray-700 font-medium hover:text-indigo-600">Dashboard</Link>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EF4444">
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
                </svg>
                <LogoutButton />
              </div>
            </>
          ) : (
            <>
              {/* Non-admin Authenticated View */}
              <Link to="/cart" className="text-gray-700 font-medium hover:text-blue-500">Cart</Link>
              <Link to="/orders" className="text-gray-700 font-medium hover:text-blue-500">Orders</Link>
              <Link to="/profile" className="text-gray-700 font-medium hover:text-indigo-600">Profile</Link>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EF4444">
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
                </svg>
                <LogoutButton />
              </div>
            </>
          )
        ) : (
          <>
            {/* Non-authenticated View */}
            <Link to="/login" className="text-gray-700 font-medium hover:text-blue-500 mx-3">Login</Link>
            <Link to="/register" className="bg-indigo-500 font-medium text-white py-2 px-4 rounded-lg hover:bg-blue-600">Sign Up</Link>
          </>
        )}
      </div>
    </div>
  </>
)}


      {/* Navbar rendering for mobile devices */}
  
        {/* Mobile Menu Icon */}
          {/* Brand Name (Visible Only on Small Devices) */}
          <span className="text-lg font-semibold text-gray-700 flex xl:hidden lg:hidden md:hidden 2xl:hidden">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              Let'Shopping
            </Link>
          </span>
        <button
            className="md:hidden focus:outline-none text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#5f6368"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#5f6368"
              >
                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
              </svg>
            )}
          </button>
                </div>

      {/* Mobile Menu Items */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg md:hidden">
          <div className="p-4 flex flex-col space-y-4">
            {/* Search Bar for mobile */}
            <div className="relative">
              <input
                type="text"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none"
                placeholder="I'm shopping for"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                onClick={handleSearch}
              >
               <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
              </button>
            </div>

            {/* Mobile Conditional rendering based on user role */}
            {isAuthenticated && user?.role === 'admin' ? (
             <>
                <Link to="/" className="flex items-center text-gray-700 font-medium hover:text-blue-500 space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>
                 <span>Home</span>
               </Link>
             {/* Admin View */}
             <Link to="/cart" className="flex items-center text-gray-700 font-medium hover:text-blue-500 space-x-1">
                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                   <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
                 </svg>
                 <span>Cart</span>
               </Link>
               {/* Orders Icon */}
               <Link to="/orders" className="flex items-center text-gray-700 font-medium hover:text-blue-500 space-x-1">
                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                   <path d="M160-160v-516L82-846l72-34 94 202h464l94-202 72 34-78 170v516H160Zm240-280h160q17 0 28.5-11.5T600-480q0-17-11.5-28.5T560-520H400q-17 0-28.5 11.5T360-480q0 17 11.5 28.5T400-440ZM240-240h480v-358H240v358Zm0 0v-358 358Z"/>
                 </svg>
                 <span>Orders</span>
               </Link>
               <div className="flex items-center text-gray-700 font-medium hover:text-blue-500 space-x-1">
               <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m430-500 283-283q12-12 28-12t28 12q12 12 12 28t-12 28L487-444l-57-56Zm99 99 254-255q12-12 28.5-12t28.5 12q12 12 12 28.5T840-599L586-345l-57-56ZM211-211q-91-91-91-219t91-219l120-120 59 59q7 7 12 14.5t10 15.5l148-149q12-12 28.5-12t28.5 12q12 12 12 28.5T617-772L444-599l-85 84 19 19q46 46 44 110t-49 111l-57-56q23-23 25.5-54.5T321-440l-47-46q-12-12-12-28.5t12-28.5l57-56q12-12 12-28.5T331-656l-64 64q-68 68-68 162.5T267-267q68 68 163 68t163-68l239-240q12-12 28.5-12t28.5 12q12 12 12 28.5T889-450L649-211q-91 91-219 91t-219-91Zm219-219ZM680-39v-81q66 0 113-47t47-113h81q0 100-70.5 170.5T680-39ZM39-680q0-100 70.5-170.5T280-921v81q-66 0-113 47t-47 113H39Z"/></svg>
               <span className="text-gray-800 font-medium">
                        Hello, Admin {user.name || 'Admin'}
               </span>
               </div>
           
               <Link to="/profile" className="flex items-center text-gray-700 font-medium hover:text-indigo-600 space-x-1">
                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                   <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Z"/>
                 </svg>
                 <span>Profile</span>
               </Link>
               <Link to="/admin/dashboard" className="flex items-center text-gray-700 font-medium hover:text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                  <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
                </svg>
                <span className="ml-2">Dashboard</span>
              </Link>
             <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EF4444">
                   <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
                 </svg>
                 <LogoutButton />
               </div>
           </>
           
            ) : (
              <>
                {/* Non-admin view */}
                

                {isAuthenticated ? (
                  <>
                <Link to="/" className="flex items-center text-gray-700 font-medium hover:text-blue-500 space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>
                 <span>Home</span>
               </Link>
                  <Link to="/cart" className="flex items-center text-gray-700 font-medium hover:text-blue-500 space-x-1">
                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                   <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/>
                 </svg>
                 <span>Cart</span>
               </Link>
                     <Link to="/orders" className="flex items-center text-gray-700 font-medium hover:text-blue-500 space-x-1">
                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                   <path d="M160-160v-516L82-846l72-34 94 202h464l94-202 72 34-78 170v516H160Zm240-280h160q17 0 28.5-11.5T600-480q0-17-11.5-28.5T560-520H400q-17 0-28.5 11.5T360-480q0 17 11.5 28.5T400-440ZM240-240h480v-358H240v358Zm0 0v-358 358Z"/>
                 </svg>
                 <span>Orders</span>
               </Link>
                      
               <Link to="/profile" className="flex items-center text-gray-700 font-medium hover:text-indigo-600 space-x-1">
                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                   <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Z"/>
                 </svg>
                 <span>Profile</span>
               </Link>

               <div className="flex items-center text-gray-700 font-medium hover:text-blue-500 space-x-1">
               <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m430-500 283-283q12-12 28-12t28 12q12 12 12 28t-12 28L487-444l-57-56Zm99 99 254-255q12-12 28.5-12t28.5 12q12 12 12 28.5T840-599L586-345l-57-56ZM211-211q-91-91-91-219t91-219l120-120 59 59q7 7 12 14.5t10 15.5l148-149q12-12 28.5-12t28.5 12q12 12 12 28.5T617-772L444-599l-85 84 19 19q46 46 44 110t-49 111l-57-56q23-23 25.5-54.5T321-440l-47-46q-12-12-12-28.5t12-28.5l57-56q12-12 12-28.5T331-656l-64 64q-68 68-68 162.5T267-267q68 68 163 68t163-68l239-240q12-12 28.5-12t28.5 12q12 12 12 28.5T889-450L649-211q-91 91-219 91t-219-91Zm219-219ZM680-39v-81q66 0 113-47t47-113h81q0 100-70.5 170.5T680-39ZM39-680q0-100 70.5-170.5T280-921v81q-66 0-113 47t-47 113H39Z"/></svg>
               <span className="text-gray-800 font-medium">
                      Hello, {user?.name || 'Customer'}
               </span>
               </div>
                    <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EF4444">
                   <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
                 </svg>
                 <LogoutButton />
               </div>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-700 font-medium">Login</Link>
                    <Link to="/register" className="text-blue-500 font-medium  py-2 rounded-lg hover:text-blue-600">Sign Up</Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
