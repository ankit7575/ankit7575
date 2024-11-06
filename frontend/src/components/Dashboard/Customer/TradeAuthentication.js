import React, { useState } from "react";


const TradeAuthentication = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    country: "",
    mt5Id: "",
    mt5Password: "",
    brokerName: "",
    plan: "",
    capital: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    setLoading(true); // Start loading

    try {
      // Basic validation
      if (!formData.name || !formData.email || !formData.mt5Id || !formData.mt5Password) {
        setError("Please fill in all required fields.");
        return;
      }

      // Simulate an API call to authenticate trading information
      const response = await fetch("/api/authenticate-trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to authenticate. Please try again.");
      }

      const result = await response.json();
      console.log("Authentication result:", result);
      // Handle successful authentication (e.g., navigate to another page or show success message)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="trade-authentication-container">
      <h1>Trade Authentication</h1>
      <form className="trade-authentication-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
          value={formData.dob}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country or Region"
          value={formData.country}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="mt5Id"
          placeholder="MT5 ID"
          value={formData.mt5Id}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="mt5Password"
          placeholder="MT5 Password"
          value={formData.mt5Password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="brokerName"
          placeholder="Broker Name"
          value={formData.brokerName}
          onChange={handleChange}
          required
        />
        <select
          name="plan"
          value={formData.plan}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select Plan</option>
          <option value="Plan A">Plan A</option>
          <option value="Plan B">Plan B</option>
          <option value="Plan C">Plan C</option>
        </select>
        <input
          type="number"
          name="capital"
          placeholder="Capital"
          value={formData.capital}
          onChange={handleChange}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Authenticating..." : "Authenticate"}
        </button>
      </form>
    </div>
  );
};

export default TradeAuthentication;
