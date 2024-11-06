import React, { useEffect, useState } from "react";
import './Funds.css'; // Import your CSS file for styling

const Funds = () => {
  const [funds, setFunds] = useState({
    availableBalance: 0,
    depositHistory: [],
    withdrawalHistory: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch funds data from the backend
  const fetchFundsData = async () => {
    try {
      const response = await fetch("/api/user/funds"); // Adjust with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch funds data.");
      }
      const data = await response.json();
      setFunds(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundsData();
  }, []);

  return (
    <div className="funds">
      <h1>Funds Overview</h1>
      
      {loading ? (
        <p>Loading your funds...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="funds-content">
          <h2>Available Balance: ${funds.availableBalance.toFixed(2)}</h2>
          
          <div className="transaction-history">
            <h3>Deposit History</h3>
            <ul>
              {funds.depositHistory.length > 0 ? (
                funds.depositHistory.map((deposit, index) => (
                  <li key={index}>
                    ${deposit.amount} - {new Date(deposit.date).toLocaleDateString()}
                  </li>
                ))
              ) : (
                <li>No deposit history available.</li>
              )}
            </ul>
          </div>

          <div className="transaction-history">
            <h3>Withdrawal History</h3>
            <ul>
              {funds.withdrawalHistory.length > 0 ? (
                funds.withdrawalHistory.map((withdrawal, index) => (
                  <li key={index}>
                    ${withdrawal.amount} - {new Date(withdrawal.date).toLocaleDateString()}
                  </li>
                ))
              ) : (
                <li>No withdrawal history available.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funds;
