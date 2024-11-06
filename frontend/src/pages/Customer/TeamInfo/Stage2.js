import React, { useEffect, useState } from "react"; // Import React and hooks
import Layout from "../../../components/Layout/Layout"; // Adjust path if needed
import LoadingSpinner from "../../../components/Shared/LoadingSpinner"; // Loading spinner component
import data from "../../../data/data.json"; // Import the data from JSON

const Stage2 = () => {
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
        
        // Filter referrals based on matching referralId and referralbyIdStage2
        const filteredReferrals = data.admin.users
        .filter(user => user.referralbyIdStage2 === mainUser.referralId) // Match only referralbyIdStage3
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
        console.error("Error loading user data:", err); // Log error for debugging
        setError(err.message || "Failed to load data."); // Set error message
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
      <section className="stage2-referrals">
        <h1>Stage 2 Referral Overview</h1>
        <div className="referral-summary">
          <h2>Your Stage 2 Referrals</h2>
          <table className="referral-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th> {/* Added Email Column */}
                <th>Plan</th> {/* Added Plan Column */}
                <th>Referral Request Status</th> {/* Added Referral Request Status Column */}
                <th>Account Status</th> {/* Added Account Status Column */}
              </tr>
            </thead>
            <tbody>
              {referrals.length > 0 ? (
                referrals.map(({ id, name, email, plan, referRequestStatus, accountStatus }) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{email}</td> {/* Display Email */}
                    <td>{plan}</td> {/* Display Plan */}
                    <td>{referRequestStatus}</td> {/* Display Referral Request Status */}
                    <td>{accountStatus}</td> {/* Display Account Status */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No Stage 2 referrals available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
};

export default Stage2; // Export the component
