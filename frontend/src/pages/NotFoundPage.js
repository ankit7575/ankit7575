import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/global.css'; // Import any necessary styles

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleHomeRedirect = () => {
    navigate("/"); // Redirect to the home page
  };

  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <button onClick={handleHomeRedirect} className="home-button">
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
