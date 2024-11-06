import React, { useEffect, useState } from "react";
import './ReferralIncome.css'; // Import your CSS file for styling

const ReferralIncome = () => {
  const [incomeData, setIncomeData] = useState({
    directReferral: 0,
    stage2: 0,
    stage3: 0,
    totalIncome: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch referral income data from the backend API
    const fetchIncomeData = async () => {
      try {
        const response = await fetch("/api/referral-income");
        if (!response.ok) {
          throw new Error("Failed to fetch income data.");
        }
        const data = await response.json();
        setIncomeData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeData();
  }, []);

  if (loading) {
    return <p>Loading referral income...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="referral-income-container">
      <h1>Referral Income</h1>
      <div className="income-details">
        <div className="income-item">
          <h2>Direct Referral Income</h2>
          <p>${incomeData.directReferral.toFixed(2)}</p>
        </div>
        <div className="income-item">
          <h2>Stage 2 Income</h2>
          <p>${incomeData.stage2.toFixed(2)}</p>
        </div>
        <div className="income-item">
          <h2>Stage 3 Income</h2>
          <p>${incomeData.stage3.toFixed(2)}</p>
        </div>
        <div className="income-item">
          <h2>Total Available Income</h2>
          <p>${incomeData.totalIncome.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ReferralIncome;
