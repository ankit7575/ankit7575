import React, { useEffect, useState } from "react"; // Import React and hooks
import Layout from "../../../components/Layout/Layout"; // Adjust path if needed
import LoadingSpinner from "../../../components/Shared/LoadingSpinner"; // Loading spinner component
import data from "../../../data/data.json"; // Import the data from JSON

const DirectReferral = () => {
  const [referrals, setReferrals] = useState([]); // State to store referral data
  const [loading, setLoading] = useState(true); // State for loading status
  const [userProfile, setUserProfile] = useState(null); // State to store user profile data
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const loadUserData = () => {
      setLoading(true); // Show loading while fetching data
      try {
        const mainUser = data.admin.users.find(user => user.id === "IND006"); // Use the appropriate user ID here
        if (!mainUser) throw new Error("User not found");

        setUserProfile(mainUser); // Set the main user profile

        // Filter referrals based on matching referralId and referralbyIdDirect
        const filteredReferrals = data.admin.users
        .filter(user => user.referralbyIdDirect === mainUser.referralId) // Match only referralbyIdStage3
          
          .map(({ id, name, email, plan, referRequestStatus, status, registrationDate }) => ({
            id,
            name,
            email,
            plan,
            referRequestStatus,
            accountStatus: status || "N/A", // Fallback for account status
            postedDate: registrationDate // Assuming registrationDate is the posted date
          }));

        setReferrals(filteredReferrals); // Set the filtered referrals
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

  return (
    <Layout userRole={userProfile?.role}> {/* Pass userRole to Layout */}
      <section className="direct-referral">
        <h1>Direct Referral Overview</h1>
        <div className="referral-summary">
          <h2>Your Direct Referrals</h2>
          <table className="referral-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th> {/* Added Plan Column */}
                <th>Referral Request Status</th> {/* Added Referral Request Status Column */}
                <th>Account Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {referrals.length > 0 ? (
                referrals.map(({ id, name, email, plan, referRequestStatus, accountStatus, postedDate }) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{plan}</td> {/* Display Plan */}
                    <td>{referRequestStatus}</td> {/* Display Referral Request Status */}
                    <td>{accountStatus}</td>
                    <td>{postedDate ? new Date(postedDate).toLocaleDateString() : "N/A"}</td> {/* Handle date display */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No direct referrals available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
};

export default DirectReferral; // Export the component
