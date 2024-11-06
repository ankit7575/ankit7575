// src/reducers/userReducer.js

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  LOGOUT_USER,
  CLEAR_ERRORS,
  LOAD_USER_REQUEST,     // Added
  LOAD_USER_SUCCESS,     // Added
  LOAD_USER_FAIL,        // Added
} from "../constants/userConstants";

// Initial state for the user reducer
const initialState = {
  user: {},
  loading: false,
  isAuthenticated: false,
  error: null,
  message: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USER_REQUEST:
      return {
        ...state,
        loading: true,     // Set loading to true while fetching user
      };

    case LOAD_USER_SUCCESS:
      return {
        ...state,
        loading: false,    // Set loading to false after loading data
        user: action.payload, // Set the user data from action payload
        isAuthenticated: true, // User is authenticated
      };

    case LOAD_USER_FAIL:
      return {
        ...state,
        loading: false,    // Set loading to false if failed
        error: action.payload, // Set error message
      };

      
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case VERIFY_OTP_REQUEST:
    case FORGOT_PASSWORD_REQUEST:
    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        isAuthenticated: false,
      };

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        user: action.payload.user, // Assuming action.payload contains user object
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case FORGOT_PASSWORD_SUCCESS:
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload, // Action payload should be a message
        error: null,
      };

    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case VERIFY_OTP_FAIL:
    case FORGOT_PASSWORD_FAIL:
    case RESET_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload, // Set error from the action payload
      };

    case LOGOUT_USER:
      return {
        ...state,
        user: {},
        isAuthenticated: false,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        message: null,
      };

    default:
      return state;
  }
};
