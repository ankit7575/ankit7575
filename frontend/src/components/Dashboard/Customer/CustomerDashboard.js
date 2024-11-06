import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './CustomerDashboard.css'; // Import your CSS file for styling

const CustomerDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data from the backend (assuming you have a user API endpoint)
  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/me"); // Adjust with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch user data.");
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="customer-dashboard">
      <h1>Welcome to Your Dashboard</h1>
      
      {loading ? (
        <p>Loading your data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="dashboard-content">
          <div className="user-info">
            <h2>User Information</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <p>MT5 ID: {user.mt5Id}</p>
            {/* Add more user info as needed */}
          </div>

          <div className="dashboard-links">
            <h2>Dashboard Menu</h2>
            <ul>
              <li>
                <Link to="/customer/funds">Funds</Link>
              </li>
              <li>
                <Link to="/customer/team-info">Team Info</Link>
              </li>
              <li>
                <Link to="/customer/referral-incentive">Referral Incentive</Link>
              </li>
              <li>
                <Link to="/customer/trade-authentication">Trade Authentication</Link>
              </li>
              <li>
                <Link to="/customer/payout-records">Payout Records</Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
