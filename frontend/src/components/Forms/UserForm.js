import React, { useState } from "react";
import './UserForm.css'; // Import your CSS for styling

const UserForm = ({ onSubmit, loading, error, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData ? initialData.name : "",
    email: initialData ? initialData.email : "",
    role: initialData ? initialData.role : "customer", // Default role
    password: "", // For new users
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="user-form-container">
      <h2>{initialData ? "Edit User" : "Add New User"}</h2>
      <form className="user-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="role">Role:</label>
        <select
          name="role"
          id="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
          <option value="affiliateMarketing">Affiliate Marketing</option>
          <option value="channelPartner">Channel Partner</option>
          <option value="franchise">Franchise</option>
        </select>

        {/* Password field only for new users */}
        {!initialData && (
          <>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </>
        )}

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save User"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
