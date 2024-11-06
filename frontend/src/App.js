// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import 'bootstrap/dist/css/bootstrap.min.css';

// Authentication pages
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; 
import SignUpPage from "./pages/SignUpPage"; 
import ValidateForm from "./components/Auth/ValidateForm";
import ResetPasswordPage from "./pages/ResetPassword"; 
import LogoutPage from "./pages/Logoutpage"; 
import LoginPage from "./pages/LoginPage"; 

// Customer dashboard pages
import Teseter from "./pages/Teseter"; 


// 404 Not Found page
import NotFoundPage from "./pages/NotFoundPage"; 

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Authentication routes */}
        <Route path="/" element={<SignUpPage />} /> 
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
        <Route path="/validate-form" element={<ValidateForm />} /> 
        <Route path="/password/reset/:token" element={<ResetPasswordPage />} />
        <Route path="/Logout" element={<LogoutPage />} />
        
        {/* Customer dashboard routes */}
        <Route path="/dashboard" element={<Teseter />} /> 

        {/* 404 Not Found route */}
        <Route path="*" element={<NotFoundPage />} /> 
      </Routes>
    </Router>
  );
};

export default App;
