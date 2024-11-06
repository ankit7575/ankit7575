import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './PayoutManagement.css'; // Make sure to create a CSS file for styling

const PayoutManagement = () => {
  const navigate = useNavigate();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch payout data from the backend (you can replace the URL with your actual endpoint)
  const fetchPayouts = async () => {
    try {
      const response = await fetch("/api/payouts"); // Replace with your API endpoint
      const data = await response.json();
      setPayouts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payouts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleApprovePayout = async (payoutId) => {
    if (window.confirm("Are you sure you want to approve this payout?")) {
      try {
        await fetch(`/api/payouts/${payoutId}/approve`, {
          method: "POST",
        });
        // Refetch payouts after approval
        fetchPayouts();
      } catch (error) {
        console.error("Error approving payout:", error);
      }
    }
  };

  const handleRejectPayout = async (payoutId) => {
    if (window.confirm("Are you sure you want to reject this payout?")) {
      try {
        await fetch(`/api/payouts/${payoutId}/reject`, {
          method: "POST",
        });
        // Refetch payouts after rejection
        fetchPayouts();
      } catch (error) {
        console.error("Error rejecting payout:", error);
      }
    }
  };

  return (
    <div className="payout-management">
      <h1>Payout Management</h1>

      {loading ? (
        <p>Loading payouts...</p>
      ) : (
        <div className="payout-list">
          <h2>Pending Payouts</h2>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout.id}>
                  <td>{payout.userName}</td>
                  <td>{payout.amount}</td>
                  <td>{payout.status}</td>
                  <td>
                    <button onClick={() => handleApprovePayout(payout.id)}>Approve</button>
                    <button onClick={() => handleRejectPayout(payout.id)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PayoutManagement;
