import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import data from "../../../data/data.json";

const ReferralIncentive = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserData = () => {
      setLoading(true);
      try {
        const mainUser = data.admin.users.find(user => user.id === "IND006");
        if (!mainUser) throw new Error("User not found");

        const filteredReferrals = data.admin.users.filter(
          user => 
            user.referralbyIdDirect === mainUser.referralId ||
            user.referralbyIdStage2 === mainUser.referralId ||
            user.referralbyIdStage3 === mainUser.referralId
        ).map(({ id, name, email, plan, incentiveDirect, incentiveStage2, incentiveStage3, companyProfitDueStatus }) => ({
          id,
          name,
          email,
          plan,
          incentives: [incentiveDirect, incentiveStage2, incentiveStage3]
            .filter(incentive => incentive > 0)
            .join(" / ") || "N/A",
          companyProfitDueStatus,
        }));

        setReferrals(filteredReferrals);
      } catch (err) {
        setError(err.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleWithdrawalRequest = (userId, status) => {
    if (status === "Pending") {
      alert("Company profit is pending. Please wait until it becomes active before sending a withdrawal request.");
    } else {
      alert(`Withdrawal request has been sent for user ID: ${userId}`);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) return <div className="error">{error}</div>;

  return (
    <section className="direct-referral">
      <div className="referral-summary">
        <table className="referral-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Incentives</th>
              <th>Company Profit</th>
              <th>Request for Withdrawal</th>
            </tr>
          </thead>
          <tbody>
            {referrals.length > 0 ? (
              referrals.slice(0, 3).map(({ id, name, email, plan, incentives, companyProfitDueStatus }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>{plan}</td>
                  <td>{incentives}</td>
                  <td>{companyProfitDueStatus}</td>
                  <td>
                    {companyProfitDueStatus === "Pending" ? (
                      <button
                        onClick={() => alert("Company Profit Due is pending. Please pay it when it becomes active.")}
                        className="payment-hold-button"
                      >
                        Payment Hold
                      </button>
                    ) : (
                      <button
                        onClick={() => handleWithdrawalRequest(id, companyProfitDueStatus)}
                        className="withdraw-button green-button"
                      >
                        Request Withdrawal
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No direct referrals available.</td>
              </tr>
            )}
          </tbody>
        </table>
        {referrals.length > 3 && <p>Showing 3 of {referrals.length} referrals.</p>}
      </div>
    </section>
  );
};

export default ReferralIncentive;
