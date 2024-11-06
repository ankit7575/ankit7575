import React, { useEffect, useState } from "react"; // Import React and hooks
import Layout from "../../../components/Layout/Layout"; // Adjust path if needed
import LoadingSpinner from "../../../components/Shared/LoadingSpinner"; // Loading spinner component
import UserTable from "../../../components/Tables/UserTable"; // User table component

const UserManagement = () => {
  const [users, setUsers] = useState([]); // State for storing user data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Hardcoded user data
  const hardcodedUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      registrationDate: "2024-01-15",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "098-765-4321",
      registrationDate: "2024-02-20",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "555-123-4567",
      registrationDate: "2024-03-10",
      status: "Active",
    },
    {
      id: 4,
      name: "Bob Brown",
      email: "bob.brown@example.com",
      phone: "444-555-6666",
      registrationDate: "2024-04-25",
      status: "Pending",
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Simulating a network request
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay
        setUsers(hardcodedUsers); // Set hardcoded data
      } catch (err) {
        setError("Failed to fetch users."); // Set error message
      } finally {
        setLoading(false); // Set loading to false after data fetch
      }
    };

    fetchUsers();
  }, [hardcodedUsers]); // Include hardcodedUsers in the dependency array to avoid warnings

  if (loading) {
    return <LoadingSpinner />; // Show a loading spinner while fetching data
  }

  if (error) {
    return <div className="error">{error}</div>; // Display an error message if there's an error
  }

  return (
    <Layout>
      <section className="user-management">
        <h1>User Management</h1>
        {users.length > 0 ? (
          <UserTable users={users} /> // Render the UserTable with fetched data
        ) : (
          <p>No users found.</p> // Message if no users are available
        )}
      </section>
    </Layout>
  );
};

export default UserManagement; // Export the component
