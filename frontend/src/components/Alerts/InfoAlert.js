import React from "react";
import "./InfoAlert.css"; // Import a CSS file for custom styling

const InfoAlert = ({ message }) => {
  if (!message) return null; // If no message, don't render the alert

  return (
    <div className="info-alert">
      <div className="alert-content">
        <span className="info-icon" role="img" aria-label="info">
          ℹ️
        </span>
        <span className="info-message">{message}</span>
      </div>
    </div>
  );
};

export default InfoAlert;
