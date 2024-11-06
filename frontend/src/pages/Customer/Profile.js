import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout"; // Adjust path if needed
import LoadingSpinner from "../../components/Shared/LoadingSpinner"; // Loading spinner component
import data from "../../data/data.json"; // Import the data from JSON
import './Profile.css'; // Importing the CSS file

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const mainUser = data.admin.users.find(user => user.id === "IND006");
        setUserProfile(mainUser);
        setFormData({
          name: mainUser.name,
          email: mainUser.email,
          phoneNumber: mainUser.phone,
        });
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value })); // Update form data
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserProfile(prevProfile => ({ ...prevProfile, ...formData }));
    setIsEditing(false); // Exit editing mode
  };

  if (loading) {
    return <LoadingSpinner />; // Show loading spinner
  }

  return (
    <Layout userRole={userProfile?.category}>
      <section className="profile">
        <h1>User Profile</h1>

        {error && <div className="error">{error}</div>}

        {!isEditing && userProfile && (
          <ProfileInfo userProfile={userProfile} setIsEditing={setIsEditing} />
        )}

        {isEditing && (
          <ProfileForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleSubmit={handleSubmit} 
            setIsEditing={setIsEditing} 
          />
        )}
      </section>
    </Layout>
  );
};

const ProfileInfo = ({ userProfile, setIsEditing }) => (
  <div className="profile-info">
    <div className="info-group">
      <p><strong>Name:</strong> {userProfile.name}</p>
      <p><strong>Email:</strong> {userProfile.email}</p>
      <p><strong>Phone Number:</strong> {userProfile.phone}</p>
    </div>
    <div className="info-group">
      <p><strong>Account Category:</strong> {userProfile.category}</p>
      <p><strong>Date of Birth:</strong> {userProfile.dob || "N/A"}</p>
      <p><strong>Country:</strong> {userProfile.country || "N/A"}</p>
    </div>
    <div className="info-group">
      <p><strong>Broker Name:</strong> {userProfile.brokerName || "N/A"}</p>
      <p><strong>Plan:</strong> {userProfile.plan || "N/A"}</p>
      <p><strong>Capital:</strong> ${userProfile.capital || "N/A"}</p>
    </div>
    <button onClick={() => setIsEditing(true)} className="btn-edit">Edit Profile</button>
  </div>
);

const ProfileForm = ({ formData, handleInputChange, handleSubmit, setIsEditing }) => (
  <form onSubmit={handleSubmit} className="profile-form">
    <div className="form-group">
      <label>Name:</label>
      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
    </div>
    <div className="form-group">
      <label>Email:</label>
      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
    </div>
    <div className="form-group">
      <label>Phone Number:</label>
      <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
    </div>
    <div className="button-group">
      <button type="submit" className="btn-save">Save Changes</button>
      <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
    </div>
  </form>
);

export default Profile;
