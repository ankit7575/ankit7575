import React from "react";
import './Tables.css'; // Optional: Add CSS for table styles

const PayoutTable = ({ payouts }) => {
  return (
    <div className="payout-table-container">
      <h2>Payout Records</h2>
      <table className="payout-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payouts.length > 0 ? (
            payouts.map((payout) => (
              <tr key={payout.id}>
                <td>{payout.id}</td>
                <td>{payout.clientName}</td>
                <td>{`$${payout.amount.toFixed(2)}`}</td>
                <td>{new Date(payout.date).toLocaleDateString()}</td>
                <td>{payout.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No payout records available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PayoutTable;
