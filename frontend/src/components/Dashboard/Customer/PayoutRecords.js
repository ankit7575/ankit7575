import React, { useEffect, useState } from "react";


const PayoutRecords = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch payout records from the backend
  const fetchPayoutRecords = async () => {
    try {
      const response = await fetch("/api/user/payouts"); // Adjust with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch payout records.");
      }
      const data = await response.json();
      setPayouts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayoutRecords();
  }, []);

  return (
    <div className="payout-records">
      <h1>Payout Records</h1>

      {loading ? (
        <p>Loading your payout records...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="payout-records-content">
          {payouts.length > 0 ? (
            <table className="payout-table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout, index) => (
                  <tr key={index}>
                    <td>${payout.amount.toFixed(2)}</td>
                    <td>{new Date(payout.date).toLocaleDateString()}</td>
                    <td>{payout.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No payout records available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PayoutRecords;
