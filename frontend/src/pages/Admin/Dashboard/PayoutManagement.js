import React, { useEffect, useState } from "react"; // Import React and hooks
import Layout from "../../../components/Layout/Layout"; // Adjust path if needed
import PayoutTable from "../../../components/Tables/PayoutTable"; // Import the PayoutTable component
import LoadingSpinner from "../../../components/Shared/LoadingSpinner"; // Import a loading spinner for async operations

const PayoutManagement = () => {
  const [payouts, setPayouts] = useState([]); // State to store payout data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Hardcoded payout data
  const hardcodedPayouts = [
    {
      id: 1,
      userId: 101,
      amount: 1000,
      status: "Pending",
      date: "2024-10-01",
    },
    {
      id: 2,
      userId: 102,
      amount: 1500,
      status: "Completed",
      date: "2024-10-02",
    },
    {
      id: 3,
      userId: 103,
      amount: 500,
      status: "Failed",
      date: "2024-10-03",
    },
    {
      id: 4,
      userId: 104,
      amount: 1200,
      status: "Pending",
      date: "2024-10-04",
    },
  ];

  // Fetch payouts on component mount
  useEffect(() => {
    const fetchPayouts = async () => {
      setLoading(true);
      try {
        // Simulating an API call with a timeout
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setPayouts(hardcodedPayouts); // Set hardcoded data
      } catch (err) {
        console.error(err); // Log the actual error
        setError("Failed to fetch payout data."); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
  }, [hardcodedPayouts]); // Include hardcodedPayouts in the dependency array

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
      <section className="payout-management">
        <h1>Payout Management</h1>
        {payouts.length > 0 ? (
          <PayoutTable payouts={payouts} /> // Render the PayoutTable with fetched data
        ) : (
          <div className="no-payouts">No payouts available.</div> // Message when no payouts exist
        )}
      </section>
    </Layout>
  );
};

export default PayoutManagement; // Export the component
