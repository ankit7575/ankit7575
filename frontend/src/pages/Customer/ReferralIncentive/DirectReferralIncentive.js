import React, { useEffect, useState } from "react"; // Import React and hooks
import Layout from "../../../components/Layout/Layout"; // Adjust path if needed
import LoadingSpinner from "../../../components/Shared/LoadingSpinner"; // Loading spinner component
import data from "../../../data/data.json"; // Import the data from JSON

const ReferralIncentive = () => {
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
        const filteredReferrals = data.admin.users.filter(user => 
          user.referralbyIdDirect === mainUser.referralId || 
      
          user.referralbyIdDirect === mainUser.referralId // Check for all referral levels
        ).map(({ id, name, email, plan, incentiveDirect, incentiveStage2, incentiveStage3, companyProfitDueStatus }) => ({
          id,
          name,
          email,
          plan,
          incentiveDirect,
          incentiveStage2,
          incentiveStage3,
          companyProfitDueStatus,
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

  const handleWithdrawalRequest = (userId, companyProfitDueStatus) => {
    if (companyProfitDueStatus === "Pending") {
      alert("Company profit is pending. Please wait until it becomes active before sending a withdrawal request.");
    } else {
      console.log(`Withdrawal request sent for user ID: ${userId}`);
      alert(`Withdrawal request has been sent for user ID: ${userId}`);
      // You can also add more complex logic here, such as making an API call
    }
  };

  const handlePaymentHoldClick = () => {
    alert("Company Profit Due is pending. Please pay it when it becomes active.");
  };

  if (loading) {
    return <LoadingSpinner />; // Show a loading spinner while fetching data
  }

  if (error) {
    return <div className="error">{error}</div>; // Display an error message if there's an error
  }

  return (
    <Layout userRole={userProfile?.role}> {/* Pass userRole to Layout */}
      <section className="direct-referral">
        <h1>Referral Incentive</h1>
        <div className="referral-summary">

          <table className="referral-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th> {/* Added Plan Column */}
                <th>Incentives</th> {/* Combined Incentives Column */}
                <th>Company Profit Due Status</th>
                <th>Request for Withdrawal</th> {/* Added Withdrawal Request Column */}
              </tr>
            </thead>
            <tbody>
              {referrals.length > 0 ? (
                referrals.map(({ id, name, email, plan, incentiveDirect, incentiveStage2, incentiveStage3, companyProfitDueStatus }) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{plan}</td> {/* Display Plan */}
                    <td>
                      {[incentiveDirect > 0 ? incentiveDirect : null,
                        incentiveStage2 > 0 ? incentiveStage2 : null,
                        incentiveStage3 > 0 ? incentiveStage3 : null
                      ]
                        .filter(Boolean) // Removes any null values from the array
                        .join(' / ') || "N/A" // Join the amounts or show "N/A" if none
                      }
                    </td> {/* Display Incentives */}
                    <td>{companyProfitDueStatus}</td>
                    <td>
                      {companyProfitDueStatus === "Pending" ? (
                        <button 
                          onClick={handlePaymentHoldClick} // Call the function on click
                          className="payment-hold-button"
                        >
                          Payment Hold
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleWithdrawalRequest(id, companyProfitDueStatus)} // Call the function on click
                          className="withdraw-button green-button" // Added "green-button" class
                        >
                          Request Withdrawal
                        </button>
                      )}
                    </td> {/* Withdrawal Request Button */}
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

export default ReferralIncentive; // Export the component
