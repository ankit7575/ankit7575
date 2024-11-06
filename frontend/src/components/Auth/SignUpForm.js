// src/pages/Customer/SignUpForm.js

import React, { useState, useEffect } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, register } from "../../actions/userActions";
import TermsModal from '../Modals/TermsModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import FontAwesome icons
import './Form.css';

const SignUpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.user);

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    password: "",
    referralId: "",
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Handle authentication state and errors
  useEffect(() => {
    if (error) {
      const errorTimeout = setTimeout(() => dispatch(clearErrors()), 3000);
      return () => clearTimeout(errorTimeout);
    }
    if (isAuthenticated) {
      navigate("/validate-form");
    }
  }, [dispatch, error, isAuthenticated, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle phone input changes
  const handlePhoneChange = (value) => {
    setFormData((prevData) => ({ ...prevData, phoneNumber: value || "" }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      return alert(validationError);
    }
    setShowTermsModal(true); // Show terms modal on form submission
  };

  // Validate form inputs
  const validateForm = () => {
    const { email, password, phoneNumber, name } = formData;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) return "Invalid email format.";
    if (password.length < 6) return "Password should be at least 6 characters.";
    if (!phoneNumber || phoneNumber.length < 10) return "Please enter a valid phone number.";
    if (!name.trim()) return "Name is required.";

    return null; // No errors
  };

  // Handle acceptance of terms
  const handleTermsAccept = async () => {
    setShowTermsModal(false);
    try {
      await dispatch(register(formData));
      sessionStorage.setItem("userEmail", formData.email); // Store email for verification
      navigate("/validate-form");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  // Handle decline of terms
  const handleTermsDecline = () => {
    setShowTermsModal(false);
    alert("You must accept the terms and conditions to proceed.");
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="signup-form-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <label htmlFor="name" className="form-label">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="phoneNumber" className="form-label">Phone</label>
        <PhoneInput
          country={'in'}
          value={formData.phoneNumber}
          onChange={handlePhoneChange}
          inputStyle={{ width: '100%' }}
          id="phoneNumber"
          required
        />

        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password" className="form-label">Password</label>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"} // Toggle between text and password
            id="password"
            name="password"
            aria-label="Password"
            className="form-input password-input"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span className="toggle-password" onClick={togglePasswordVisibility}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="lg" />
          </span>
        </div>

        <label htmlFor="referralId" className="form-label">Referral ID (optional)</label>
        <input
          type="text"
          id="referralId"
          name="referralId"
          placeholder="Referral ID (optional)"
          value={formData.referralId}
          onChange={handleChange}
        />

        {error && <p className="error-message" role="alert">{error}</p>}
        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      <div className="login-button-container">
        <button 
          onClick={() => navigate("/login")} 
          className="login-button"
        >
          Already have an account? Log In
        </button>
      </div>

      <TermsModal 
        show={showTermsModal} 
        onClose={handleTermsDecline} 
        onAccept={handleTermsAccept} 
      />
    </div>
  );
};

export default SignUpForm;
