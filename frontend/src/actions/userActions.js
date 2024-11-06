// src/actions/userActions.js

import axios from 'axios'; // Ensure axios is imported
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  CLEAR_ERRORS,
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
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
} from '../constants/userConstants';

// Set up default headers for axios
const config = { headers: { "Content-Type": "application/json" } };

// Login action
export const login = (email, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });

  try {
    const { data } = await axios.post(`/api/v1/login`, { email, password }, config);
    dispatch({ type: LOGIN_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: LOGIN_FAIL,
      payload: errorMessage,
    });
  }
};

// Register action
export const register = (formData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });

  try {
    const { data } = await axios.post(`/api/v1/register`, formData, config);
    dispatch({ type: REGISTER_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: REGISTER_FAIL,
      payload: errorMessage,
    });
  }
};

// Verify OTP action
export const verifyOtp = (otpData) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });

  try {
    const { data } = await axios.post(`/api/v1/verify-otp`, otpData, config);
    dispatch({ type: VERIFY_OTP_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "OTP verification failed";
    dispatch({
      type: VERIFY_OTP_FAIL,
      payload: errorMessage,
    });
    throw new Error(errorMessage);
  }
};

// Load User action
export const loadUser = () => async (dispatch) => {
  dispatch({ type: LOAD_USER_REQUEST });

  try {
    // Retrieve the token from localStorage and include it in the request headers
    const token = localStorage.getItem('token');
    const configWithAuth = token ? {
      ...config,
      headers: {
        ...config.headers,
        'Authorization': `Bearer ${token}`  // Add token to the header
      }
    } : config;

    const { data } = await axios.get(`/api/v1/user/me`, configWithAuth); // Ensure the endpoint returns correct data

    // Dispatch success action with data.user or fallback to entire data object
    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: data.user || data // Handle possible structure variations
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to load user"; // Better error fallback
    dispatch({
      type: LOAD_USER_FAIL,
      payload: errorMessage,
    });
  }
};

// Forgot Password action
export const forgotPassword = (email) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });

  try {
    const { data } = await axios.post("/api/v1/password/forgot", { email }, config);
    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: errorMessage,
    });
  }
};

// Reset Password action
export const resetPassword = (token, newPassword, confirmPassword) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });

  try {
    const { data } = await axios.put(
      `/api/v1/password/reset/${token}`, // URL with the token
      { password: newPassword, confirmPassword }, // Passwords in the request body
      config
    );
    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Something went wrong";
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: errorMessage,
    });
  }
};

// Logout action
export const logout = () => async (dispatch) => {
  try {
    await axios.post('/api/v1/logout'); // Call the logout endpoint
    dispatch({ type: LOGOUT_USER }); // Dispatch the logout action
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// Clear errors action
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
