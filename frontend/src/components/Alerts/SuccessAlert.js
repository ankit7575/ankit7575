import React from "react";
import "./SuccessAlert.css"; // Import a CSS file for custom styling

const SuccessAlert = ({ message }) => {
  if (!message) return null; // If no success message, do not render the alert

  return (
    <div className="success-alert" role="alert">
      <div className="alert-content">
        <span className="success-icon" role="img" aria-label="success">
          ✅
        </span>
        <span className="success-message">{message}</span>
      </div>
    </div>
  );
};

export default SuccessAlert;
