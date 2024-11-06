import React, { useEffect, useState } from "react"; // Import React and hooks
import Layout from "../../../components/Layout/Layout"; // Adjust path if needed
import LoadingSpinner from "../../../components/Shared/LoadingSpinner"; // Loading spinner component
import data from "../../../data/data.json"; // Import the data from JSON
import './FortnightlyProfit.css'; // Adjust path if needed

const CompanyProfitDue = () => {
  const [profitData, setProfitData] = useState([]); // State to store profit data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const userId = "IND006"; // Replace with the actual user ID you want to load

  useEffect(() => {
    const loadUserData = () => {
      setLoading(true); // Show loading while fetching data
      try {
        // Find the specific user from the data
        const mainUser = data.admin.users.find(user => user.id === userId);
        if (!mainUser) throw new Error(`User with ID "${userId}" not found`);

        // Prepare profit data from the user's payoutRecords
        const profitRecords = mainUser.payoutRecords.map(({ date }) => ({
          name: mainUser.name,
          date,
          profitAmount: mainUser.fortnightlyProfit, // Accessing fortnightly profit
          companyStatus: mainUser.companyProfitDueStatus, // Accessing company profit due status
          companyProfitDue: mainUser.companyProfitDue // Accessing company profit due
        }));

        setProfitData(profitRecords); // Set the prepared profit records
      } catch (err) {
        console.error("Error loading user data:", err); // Log error
        setError(err.message || "Failed to load data.");
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    loadUserData(); // Call the function to load user data on component mount
  }, []); // No dependencies needed

  if (loading) {
    return <LoadingSpinner />; // Show a loading spinner while fetching data
  }

  if (error) {
    return <div className="error">{error}</div>; // Display an error message if there's an error
  }

  // Calculate totals
  const totalCompanyProfitDue = profitData.reduce((total, record) => total + record.companyProfitDue, 0);

  return (
    <Layout userRole="customer"> {/* Replace with actual user role if necessary */}
      <section className="company-profit-due">
        <h1>Company Profit Due Overview</h1>
        <h2>
          Total Company Profit Due: <span className="total-amount">${totalCompanyProfitDue.toFixed(2)}</span>
        </h2>
        <table className="profit-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Date</th>
              <th scope="col">Profit Amount</th>
              <th scope="col">Company Profit Due</th>
              <th scope="col">Company Project Status</th>
            </tr>
          </thead>
          <tbody>
            {profitData.length > 0 ? (
              profitData.map(({ name, date, profitAmount, companyStatus, companyProfitDue }, index) => (
                <tr key={index}> {/* Use index as key if there's no unique id */}
                  <td>{name}</td>
                  <td>{new Date(date).toLocaleDateString()}</td>
                  <td>${profitAmount.toFixed(2)}</td>
                  <td>${companyProfitDue.toFixed(2)}</td> {/* Display company profit due */}
                  <td>
                    <span style={{ 
                      color: companyStatus === "Completed" ? "green" : "red" // Change color based on status
                    }}>
                      {companyStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No profit data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </Layout>
  );
};

export default CompanyProfitDue; // Export the component
