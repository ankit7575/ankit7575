// src/pages/ForgotPasswordPage.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import ForgotPasswordForm from "../components/Auth/ForgotPasswordForm"; // Import the form component

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate a six-digit code
  const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  // Send reset email (replace with actual API call if needed)
  const sendResetEmail = (email, code) => {
    console.log(`Sending password reset code ${code} to email: ${email}`);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    const code = generateVerificationCode();
    setGeneratedCode(code);
    sendResetEmail(email, code);

    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 2000);
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (verificationCode === generatedCode) {
      setStep(3);
    } else {
      setError("Invalid verification code. Please try again.");
    }
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }
    console.log("Password has been reset for:", email);
    navigate("/login");
  };

  return (
    <div className="registration-page">
      <div className="registration-form-box">
        <h1>Forgot Password</h1>
        <ForgotPasswordForm
          step={step}
          email={email}
          verificationCode={verificationCode}
          newPassword={newPassword}
          error={error}
          loading={loading}
          handleEmailSubmit={handleEmailSubmit}
          handleCodeSubmit={handleCodeSubmit}
          handlePasswordReset={handlePasswordReset}
          setEmail={setEmail}
          setVerificationCode={setVerificationCode}
          setNewPassword={setNewPassword}
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
