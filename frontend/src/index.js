// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // CSS styles for the application
import App from './App'; // Main application component
import store from './store/store'; // Redux store
import { Provider } from 'react-redux'; // Redux Provider


// Create a root for React 18
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Render the App component within the Redux Provider and AuthProvider
root.render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>
);
