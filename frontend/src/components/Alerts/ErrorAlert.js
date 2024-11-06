import React from "react";
import "./ErrorAlert.css"; // Import a CSS file for custom styling

const ErrorAlert = ({ message }) => {
  if (!message) return null; // If no error message, do not render the alert

  return (
    <div className="error-alert">
      <div className="alert-content">
        <span className="error-icon" role="img" aria-label="error">
          ⚠️
        </span>
        <span className="error-message">{message}</span>
      </div>
    </div>
  );
};

export default ErrorAlert;
