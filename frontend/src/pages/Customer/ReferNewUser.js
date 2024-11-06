import React, { useState } from "react";
import Layout from "../../components/Layout/Layout"; // Adjust path if needed
import LoadingSpinner from "../../components/Shared/LoadingSpinner"; // Loading spinner component
import PhoneInput from 'react-phone-input-2'; // Import PhoneInput
import 'react-phone-input-2/lib/style.css'; // Import styles for PhoneInput

const ReferNewUser = () => {
  const [referralData, setReferralData] = useState({
    name: "",
    email: "",
    phoneNumber: "", // Ensure this matches the state key
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Simulated user data
  const user = {
    role: "customer", // Replace with dynamic user role
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReferralData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value) => {
    setReferralData((prevData) => ({
      ...prevData,
      phoneNumber: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Simulate an API call to submit the referral data
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate success or failure of the API call
          Math.random() > 0.2 ? resolve() : reject("Failed to refer new user.");
        }, 1000); // Simulate network delay
      });

      setSuccess(true); // Set success state on successful referral
      setReferralData({ name: "", email: "", phoneNumber: "" }); // Reset form
    } catch (err) {
      setError(err); // Handle any errors
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <Layout userRole={user.role}> {/* Pass userRole to Layout */}
      <section className="refer-new-user">
        <h1>Refer a New User</h1>
        {loading && <LoadingSpinner />} {/* Show loading spinner if in loading state */}
        {error && <div className="error">{error}</div>} {/* Display error message if there's an error */}
        {success && <div className="success">Referral submitted successfully!</div>} {/* Success message */}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={referralData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={referralData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber">Phone Number:</label>
            <PhoneInput
              country={'in'} // Default to India (+91)
              value={referralData.phoneNumber}
              onChange={handlePhoneChange}
              inputStyle={{ width: '100%' }} // Customize input width to fit your form
            />
          </div>
          <br></br>
          <button type="submit">Refer New User</button>
        </form>
      </section>
    </Layout>
  );
};

export default ReferNewUser;
