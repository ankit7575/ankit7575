// src/pages/LoginPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/Auth/LoginForm";


const LoginPage = () => {
  const navigate = useNavigate();

  const handleRegistrationRedirect = () => {
    navigate("/"); // Redirect to registration page
  };

  const handleForgotPasswordRedirect = () => {
    navigate("/forgot-password"); // Redirect to forgot password page
  };

  return (
    
    <div className="registration-page">
    <div className="registration-form-box">
        <h1>Log In</h1>

        {/* Login form component */}
        <LoginForm onRegister={handleRegistrationRedirect} />

        {/* Button to redirect to registration */}
   

        {/* Button to redirect to forgot password */}
        <div className="forgot-password-container pt-2">
          <button 
            onClick={handleForgotPasswordRedirect} 
            className="forgot-password-button"
            aria-label="Redirect to forgot password page"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
