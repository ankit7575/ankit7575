import React from "react";
import './Tables.css'; // Optional: Add CSS for table styles

const ReferralTable = ({ referrals }) => {
  return (
    <div className="referral-table-container">
      <h2>Referral Records</h2>
      <table className="referral-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Referrer Name</th>
            <th>Referral Name</th>
            <th>Email</th>
            <th>Date Referred</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {referrals.length > 0 ? (
            referrals.map((referral) => (
              <tr key={referral.id}>
                <td>{referral.id}</td>
                <td>{referral.referrerName}</td>
                <td>{referral.referralName}</td>
                <td>{referral.email}</td>
                <td>{new Date(referral.dateReferred).toLocaleDateString()}</td>
                <td>{referral.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No referral records available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReferralTable;
