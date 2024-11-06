// src/components/Auth/LoginForm.js

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, login } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";
import './Form.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginForm = ({ onRegister }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const errorTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) return;

    dispatch(login(loginEmail, loginPassword));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }

    if (error) {
      // Reset login fields on error
      setLoginEmail("");
      setLoginPassword("");

      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      errorTimeoutRef.current = setTimeout(() => dispatch(clearErrors()), 3000);
    }

    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    };
  }, [dispatch, error, isAuthenticated, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          aria-label="Email"
          className="form-input"
          placeholder="Enter your email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          required
        />

        <label htmlFor="password" className="form-label">Password</label>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            aria-label="Password"
            className="form-input password-input"
            placeholder="Enter your password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <span className="toggle-password" onClick={togglePasswordVisibility}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="lg" />
          </span>
        </div>

        {error && <p className="error-message" role="alert">{`Error: ${error}`}</p>}

        <div className="form-actions">
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging In..." : "Log In"}
          </button>
          <button type="button" className="register-button" onClick={onRegister}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
