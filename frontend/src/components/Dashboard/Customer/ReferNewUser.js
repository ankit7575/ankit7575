import React, { useState } from "react";
import './ReferNewUser.css'; // Import your CSS file for styling

const ReferNewUser = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    // Simple validation
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true); // Show loading state

    try {
      await onSubmit(formData); // Call the onSubmit function passed as a prop
      // Reset the form after successful submission
      setFormData({ name: "", email: "", phone: "" });
    } catch (err) {
      setError("An error occurred while referring the user. Please try again.");
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="refer-new-user-container">
      <h1>Refer a New User</h1>
      <form className="refer-new-user-form" onSubmit={handleSubmit}>
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
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Refer User"}
        </button>
      </form>
    </div>
  );
};

export default ReferNewUser;
