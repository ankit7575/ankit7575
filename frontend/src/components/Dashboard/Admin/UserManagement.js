import React, { useEffect, useState } from "react";


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  // Fetch users data from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users"); // Replace with your API endpoint
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, phone: user.phone });
  };

  const handleDeleteClick = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      try {
        await fetch(`/api/users/${userId}`, { method: "DELETE" }); // Replace with your API endpoint
        fetchUsers(); // Refresh user list after deletion
      } catch (error) {
        console.error("Error deleting user:", error);
        setError("Failed to delete user.");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = selectedUser ? "PUT" : "POST"; // Update if editing, otherwise create
      const response = await fetch(`/api/users${selectedUser ? `/${selectedUser.id}` : ""}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchUsers(); // Refresh user list
        setSelectedUser(null); // Reset selected user
        setFormData({ name: "", email: "", phone: "" }); // Reset form
      } else {
        throw new Error("Failed to save user.");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      setError("Failed to save user.");
    }
  };

  return (
    <div className="user-management">
      <h1>User Management</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <button onClick={() => handleEditClick(user)}>Edit</button>
                    <button onClick={() => handleDeleteClick(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>{selectedUser ? "Edit User" : "Add User"}</h2>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <button type="submit">{selectedUser ? "Update" : "Add User"}</button>
            {selectedUser && <button type="button" onClick={() => setSelectedUser(null)}>Cancel</button>}
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
