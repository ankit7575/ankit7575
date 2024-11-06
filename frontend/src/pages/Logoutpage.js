// src/pages/LogoutPage.js

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../actions/userActions'; // Adjust the import path as necessary

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await dispatch(logout());
      navigate('/login'); // Redirect to the login page after logging out
    };

    handleLogout();
  }, [dispatch, navigate]);

  return (
    <div className="logout-page">
      <h2>Logging Out...</h2>
      <p>Please wait while we log you out.</p>
    </div>
  );
};

export default LogoutPage;
