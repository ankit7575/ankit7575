import React, { useEffect, useState } from "react";
import './TeamInfo.css'; // Import your CSS file for styling

const TeamInfo = () => {
  const [teamData, setTeamData] = useState({
    directReferrals: [],
    stage2: [],
    stage3: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch team info data from the backend API
    const fetchTeamData = async () => {
      try {
        const response = await fetch("/api/team-info");
        if (!response.ok) {
          throw new Error("Failed to fetch team data.");
        }
        const data = await response.json();
        setTeamData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  if (loading) {
    return <p>Loading team information...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="team-info-container">
      <h1>Team Information</h1>

      {/* Direct Referrals */}
      <div className="team-section">
        <h2>Direct Referrals</h2>
        {teamData.directReferrals.length > 0 ? (
          <ul>
            {teamData.directReferrals.map((member) => (
              <li key={member.id}>
                {member.name} - {member.email} - {member.phone}
              </li>
            ))}
          </ul>
        ) : (
          <p>No direct referrals found.</p>
        )}
      </div>

      {/* Stage 2 Referrals */}
      <div className="team-section">
        <h2>Stage 2 Referrals</h2>
        {teamData.stage2.length > 0 ? (
          <ul>
            {teamData.stage2.map((member) => (
              <li key={member.id}>
                {member.name} - {member.email} - {member.phone}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Stage 2 referrals found.</p>
        )}
      </div>

      {/* Stage 3 Referrals */}
      <div className="team-section">
        <h2>Stage 3 Referrals</h2>
        {teamData.stage3.length > 0 ? (
          <ul>
            {teamData.stage3.map((member) => (
              <li key={member.id}>
                {member.name} - {member.email} - {member.phone}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Stage 3 referrals found.</p>
        )}
      </div>
    </div>
  );
};

export default TeamInfo;
