import React, { useState } from "react";
import './TradeForm.css'; // Import your CSS for styling

const TradeForm = ({ onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    tradeType: "buy", // Default trade type
    amount: "",
    leverage: "",
    symbol: "",
    stopLoss: "",
    takeProfit: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="trade-form-container">
      <h2>Create a New Trade</h2>
      <form className="trade-form" onSubmit={handleSubmit}>
        <label htmlFor="tradeType">Trade Type:</label>
        <select
          name="tradeType"
          id="tradeType"
          value={formData.tradeType}
          onChange={handleChange}
          required
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>

        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          name="amount"
          id="amount"
          placeholder="Enter trade amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />

        <label htmlFor="leverage">Leverage:</label>
        <input
          type="number"
          name="leverage"
          id="leverage"
          placeholder="Enter leverage"
          value={formData.leverage}
          onChange={handleChange}
          required
        />

        <label htmlFor="symbol">Trading Symbol:</label>
        <input
          type="text"
          name="symbol"
          id="symbol"
          placeholder="Enter trading symbol (e.g., BTC/USD)"
          value={formData.symbol}
          onChange={handleChange}
          required
        />

        <label htmlFor="stopLoss">Stop Loss:</label>
        <input
          type="number"
          name="stopLoss"
          id="stopLoss"
          placeholder="Enter stop loss value"
          value={formData.stopLoss}
          onChange={handleChange}
          required
        />

        <label htmlFor="takeProfit">Take Profit:</label>
        <input
          type="number"
          name="takeProfit"
          id="takeProfit"
          placeholder="Enter take profit value"
          value={formData.takeProfit}
          onChange={handleChange}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Processing Trade..." : "Submit Trade"}
        </button>
      </form>
    </div>
  );
};

export default TradeForm;
