import React, { useEffect } from 'react';
import './styles/App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserFromToken } from './redux/userSlice'; 
import RouterComponent from './App-Routing/router'; 
import { inject} from "@vercel/analytics"; // vercel analytics package to enable vercel analytics

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setUserFromToken({ token }));  // Dispatch the token to Redux
    }
  }, [dispatch]);

  inject(); // the call to the injection function

  return (
    <div className='App'>
      <Router basename='/'>
        <RouterComponent /> 
        <ToastContainer />
      </Router>
    </div>
  );
}

export default App;
