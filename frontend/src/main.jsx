import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';
import store from './redux/store';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
    <Provider store={store}><App /></Provider>
  
)
