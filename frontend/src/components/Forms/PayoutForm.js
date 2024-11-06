import React, { useState } from "react";
import './PayoutForm.css'; // Import your CSS for styling

const PayoutForm = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    payoutAmount: "",
    payoutMethod: "Bank Transfer", // Default payout method
    accountDetails: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="payout-form-container">
      <h2>Request Payout</h2>
      <form className="payout-form" onSubmit={handleSubmit}>
        <label htmlFor="payoutAmount">Payout Amount:</label>
        <input
          type="number"
          name="payoutAmount"
          id="payoutAmount"
          placeholder="Enter amount"
          value={formData.payoutAmount}
          onChange={handleChange}
          required
        />

        <label htmlFor="payoutMethod">Payout Method:</label>
        <select
          name="payoutMethod"
          id="payoutMethod"
          value={formData.payoutMethod}
          onChange={handleChange}
        >
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="PayPal">PayPal</option>
          <option value="Cryptocurrency">Cryptocurrency</option>
          {/* Add more options as needed */}
        </select>

        <label htmlFor="accountDetails">Account Details:</label>
        <input
          type="text"
          name="accountDetails"
          id="accountDetails"
          placeholder="Enter account details"
          value={formData.accountDetails}
          onChange={handleChange}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit Payout Request"}
        </button>
      </form>
    </div>
  );
};

export default PayoutForm;
