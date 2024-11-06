import React, { useEffect, useState } from "react"; // Import React and hooks
import Layout from "../../../components/Layout/Layout"; // Adjust path if needed
import LoadingSpinner from "../../../components/Shared/LoadingSpinner"; // Import a loading spinner
import ReportsTable from "../../../components/Tables/ReportsTable"; // Import your ReportsTable component

const Reports = () => {
  const [reports, setReports] = useState([]); // State to store reports data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Hardcoded reports data for demonstration purposes
  const hardcodedReports = [
    {
      id: 1,
      title: "Monthly Earnings",
      date: "2024-10-01",
      status: "Completed",
      total: 2000,
    },
    {
      id: 2,
      title: "Weekly Performance",
      date: "2024-10-08",
      status: "In Progress",
      total: 1500,
    },
    {
      id: 3,
      title: "Daily Summary",
      date: "2024-10-20",
      status: "Completed",
      total: 300,
    },
    {
      id: 4,
      title: "User Engagement Report",
      date: "2024-10-15",
      status: "Pending",
      total: 500,
    },
  ];

  // Fetch reports data on component mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setReports(hardcodedReports); // Set hardcoded data
      } catch (err) {
        setError("Failed to load reports. Please try again later."); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [hardcodedReports]); // Include hardcodedReports in the dependency array

  // Loading state
  if (loading) {
    return <LoadingSpinner />; // Show a loading spinner while fetching data
  }

  // Error state
  if (error) {
    return <div className="error">{error}</div>; // Display an error message if there's an error
  }

  return (
    <Layout>
      <section className="reports">
        <h1>Reports</h1>
        {reports.length > 0 ? (
          <ReportsTable reports={reports} /> // Render the ReportsTable with fetched data
        ) : (
          <p>No reports available.</p> // Message if no reports are found
        )}
      </section>
    </Layout>
  );
};

export default Reports; // Export the component
