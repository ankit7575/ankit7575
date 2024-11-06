// src/store/store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // Middleware for handling async actions
import { composeWithDevTools } from 'redux-devtools-extension'; // For integrating Redux DevTools
import {userReducer} from '../reducers/userReducer'; // Import your user management reducer

// Combine all your reducers into a root reducer
const reducer = combineReducers({
  user: userReducer, // User management reducer
  // Additional reducers can be added here as needed
  // e.g., productReducer, orderReducer, etc.
});

const initialState = {};

// Create an array of middleware to use in the store
const middleware = [thunk]; // Add more middleware here if needed

// Create the Redux store
const store = createStore(
   reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware)) // Enable Redux DevTools support
);

// Export the store for use in your application
export default store;
