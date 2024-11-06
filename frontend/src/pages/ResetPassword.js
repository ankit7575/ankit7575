// src/pages/ResetPasswordPage.js

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../actions/userActions";
import "../styles/global.css";

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams(); // Get the reset token from the URL params

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  
  const { loading, message } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    dispatch(resetPassword(token, newPassword, confirmPassword))
      .then(() => navigate("/login")) // Redirect on successful password reset
      .catch((err) => setError(err.message));
  };

  return (
    <div className="registration-page">
    <div className="registration-form-box">
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="form-input"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="form-input"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="error-message" role="alert">{error}</p>}
          {message && <p className="success-message" role="alert">{message}</p>}

          <button type="submit" className="form-button" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
