import React, { useEffect, useState } from "react"; // Import React and hooks
import Layout from "../../components/Layout/Layout"; // Adjust the path as needed
import LoadingSpinner from "../../components/Shared/LoadingSpinner"; // Loading spinner component
import data from "../../data/data.json"; // Import the data from JSON
import FortnightlyProfit from "./home/FortnightlyProfit"; // Import FortnightlyProfit component
import ReferralIncentive from "./home/ReferralIncentive";

const CustomerDashboard = () => {
  const [userProfile, setUserProfile] = useState(null); // State to store user profile data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const loadUserData = () => {
      setLoading(true); // Show loading while fetching data
      try {
        const mainUser = data.admin.users.find(user => user.id === "IND006"); // Replace with the appropriate user ID
        if (!mainUser) throw new Error("User not found");

        setUserProfile(mainUser); // Set the main user profile
      } catch (err) {
        console.error("Error loading user data:", err); // Log error for debugging
        setError(err.message || "Failed to load data."); // Set error message
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    loadUserData(); // Call the function to load user data on component mount
  }, []); // Empty dependency array ensures the effect runs only once

  if (loading) {
    return <LoadingSpinner />; // Show a loading spinner while fetching data
  }

  if (error) {
    return <div className="error">{error}</div>; // Display an error message if there's an error
  }

  return (
    <Layout userRole={userProfile?.role}> {/* Pass userRole to Layout */}
      <div className="customer-dashboard">
        <h1 className="dashboard-title">Welcome, {userProfile?.name}</h1> {/* Display the main user's name */}
        <div className="user-details card">
         
          <p><strong>Email:</strong> {userProfile?.email}</p>
          <p><strong>Phone:</strong> {userProfile?.phone}</p>
          <p><strong>Country:</strong> {userProfile?.country}</p>
          <p><strong>Plan:</strong> {userProfile?.plan}</p>
          <p><strong>Capital:</strong> ${userProfile?.capital}</p>
          <p><strong>Fortnightly Profit:</strong> ${userProfile?.fortnightlyProfit}</p>
          <p><strong>Referral ID:</strong> {userProfile?.referralId}</p>
          <p><strong>Company Profit Due Status:</strong> {userProfile?.companyProfitDue === 0 ? "Active" : userProfile?.companyProfitDueStatus}</p>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <div className="card">
              <h2>Referral Incentive</h2>
              <ReferralIncentive /> {/* Render the ReferralIncentive component */}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card">
              <h2>Fortnightly Profit</h2>
              <FortnightlyProfit /> {/* Render the FortnightlyProfit component */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerDashboard; // Export the component
