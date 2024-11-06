import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout"; // Adjust path if needed
import LoadingSpinner from "../../components/Shared/LoadingSpinner"; // Loading spinner component
import data from "../../data/data.json"; // Import the data from JSON
import './PayoutRecords.css'; 

const PayoutRecords = () => {
  const [payoutRecords, setPayoutRecords] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [userProfile, setUserProfile] = useState(null); 

  useEffect(() => {
    const loadUserData = () => {
      setLoading(true);
      try {
        const mainUser = data.admin.users.find(user => user.id === "IND006"); // Use the appropriate user ID here
        if (!mainUser) throw new Error("User not found");
        
        console.log("Main User:", mainUser); // Debug log
        
        setUserProfile(mainUser);
        
        const filteredPayouts = getFilteredPayouts(mainUser);
        console.log("Filtered Payouts:", filteredPayouts); // Debug log
        
        setPayoutRecords(filteredPayouts);
      } catch (err) {
        console.error(err); // Log error
        setError(err.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    loadUserData(); // Load user profile and payout records
  }, []);

  const getFilteredPayouts = (mainUser) => {
    // Collect the main user's referral ID
    const mainUserReferralId = mainUser.referralId;

    console.log("Main User Referral ID:", mainUserReferralId); // Debug log

    // Collect all payouts from users, filtering by matching referral IDs
    const filteredPayouts = data.admin.users.flatMap(user =>
      user.payoutRecords
        .filter(payout => 
          [user.referralbyIdDirect, user.referralbyIdStage2, user.referralbyIdStage3].includes(mainUserReferralId) // Check if any referral IDs match the main user's referral ID
        )
        .map(payout => ({
          ...payout,
          userId: user.id,
          name: user.name,
        }))
    );

    console.log("Filtered Payouts:", filteredPayouts); // Debug log
    return filteredPayouts;
  };

  const totalPendingPayments = payoutRecords.reduce((acc, payout) => (
    payout.status === "Pending" ? acc + payout.amount : acc
  ), 0);

  const totalReceivedPayments = payoutRecords.reduce((acc, payout) => (
    payout.status === "Completed" ? acc + payout.amount : acc
  ), 0);

  const renderPayoutRow = (payout) => {
    const rowClass = payout.status === "Completed" ? "completed-row" : "pending-row";
    return (
      <tr key={payout.payoutId} className={rowClass}>
        <td>{payout.userId || "N/A"}</td>
        <td>{payout.name}</td>
        <td>{payout.payoutId}</td>
        <td>{new Date(payout.date).toLocaleDateString()}</td>
        <td>${payout.amount.toFixed(2)}</td>
        <td>{payout.paymentMethod}</td>
        <td>{payout.transactionId}</td>
        <td>{payout.purpose}</td>
        <td>{payout.status}</td>
      </tr>
    );
  };

  if (loading) {
    return <LoadingSpinner />; 
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <Layout userRole={userProfile?.role}>
      <section className="payout-records">
        <h1>Payout Records</h1>
        <div className="payout-summary">
          <h2>All Payouts</h2>
          <h3>Total Pending Payments: ${totalPendingPayments.toFixed(2)}</h3>
          <h3>Total Received Payments: ${totalReceivedPayments.toFixed(2)}</h3>
          <table className="payout-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Payout ID</th>
                <th>Date of Payout</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Transaction ID</th>
                <th>Purpose of Payout</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payoutRecords.length > 0 ? (
                payoutRecords.map(renderPayoutRow)
              ) : (
                <tr>
                  <td colSpan="9">No payout records available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
};

export default PayoutRecords;
