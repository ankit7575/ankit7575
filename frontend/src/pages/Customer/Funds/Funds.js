import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout"; // Adjust path if needed
import LoadingSpinner from "../../../components/Shared/LoadingSpinner"; // Loading spinner component

// Sample data to simulate fetched funds data
const sampleFundsData = {
  availableBalance: 2500.00,
  depositHistory: [
    { id: 1, amount: 1000.00, date: "2024-10-01" },
    { id: 2, amount: 500.00, date: "2024-10-05" },
  ],
  withdrawalHistory: [
    { id: 1, amount: 200.00, date: "2024-10-10" },
    { id: 2, amount: 150.00, date: "2024-10-15" },
  ],
};

const Funds = () => {
  const [fundsData, setFundsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulated user data
  const user = {
    role: "customer", // Replace with dynamic user role
  };

  useEffect(() => {
    const getFundsData = () => {
      try {
        // Instead of fetching from API, use the sample data
        setFundsData(sampleFundsData);
      } catch (err) {
        setError("Failed to load funds data."); // Handle any errors
      } finally {
        setLoading(false);
      }
    };

    getFundsData(); // Call the function to simulate fetching funds data on component mount
  }, []);

  if (loading) {
    return <LoadingSpinner />; // Show a loading spinner while fetching data
  }

  if (error) {
    return <div className="error">{error}</div>; // Display an error message if there's an error
  }

  const { availableBalance, depositHistory, withdrawalHistory } = fundsData;

  return (
    <Layout userRole={user.role}> {/* Pass userRole to Layout */}
      <section className="funds">
        <h1>Funds Overview</h1>
        <div className="balance">
          <h2>Available Balance: <span className="balance-amount">${availableBalance.toFixed(2)}</span></h2>
        </div>
        <div className="transactions-summary">
          <h3>Transaction History</h3>
          <h4>Deposit History</h4>
          <table className="funds-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {depositHistory && depositHistory.length > 0 ? (
                depositHistory.map((deposit) => (
                  <tr key={deposit.id}>
                    <td>{deposit.id}</td>
                    <td>${deposit.amount.toFixed(2)}</td>
                    <td>{new Date(deposit.date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No deposits available.</td>
                </tr>
              )}
            </tbody>
          </table>

          <h4>Withdrawal History</h4>
          <table className="funds-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalHistory && withdrawalHistory.length > 0 ? (
                withdrawalHistory.map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td>{withdrawal.id}</td>
                    <td>${withdrawal.amount.toFixed(2)}</td>
                    <td>{new Date(withdrawal.date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No withdrawals available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
};

export default Funds;
