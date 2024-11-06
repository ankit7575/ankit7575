import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AdminDashboard.css'; // Make sure to create a CSS file for styling

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Custom JSON data representing user list
  const initialUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "123-456-7890",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "janesmith@example.com",
      phone: "987-654-3210",
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michaelj@example.com",
      phone: "456-789-1234",
    },
  ];

  const [users, setUsers] = useState(initialUsers); // Use local JSON data as state
  const [loading, setLoading] = useState(false);    // Loading state for consistency, even though data is static

  const handleEditUser = (userId) => {
    // Redirect to the edit user page (this will work if you have a separate edit user page)
    navigate(`/admin/edit-user/${userId}`);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // Filter out the deleted user from the list
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="user-list">
          <h2>User Management</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
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
                    <button onClick={() => handleEditUser(user.id)}>Edit</button>
                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
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

export default AdminDashboard;
