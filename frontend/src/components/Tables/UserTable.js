import React from "react";
import './Tables.css'; // Optional: Add CSS for table styles

const UserTable = ({ users }) => {
  return (
    <div className="user-table-container">
      <h2>User Records</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(user.id)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No user records available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Dummy handler functions for editing and deleting users
const handleEdit = (id) => {
  console.log(`Edit user with ID: ${id}`);
  // Implement edit functionality here
};

const handleDelete = (id) => {
  console.log(`Delete user with ID: ${id}`);
  // Implement delete functionality here
};

export default UserTable;
