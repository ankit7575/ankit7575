import React, { useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import SignUpForm from "../components/Auth/SignUpForm";
import TermsModal from "../components/Modals/TermsModal";
import { register } from "../actions/userActions"; // Import register action
import { useNavigate } from "react-router-dom";
import '../styles/global.css';

const SignUpPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate();

  const handleRegistration = (data) => {
    setFormData(data);
    setShowModal(true);
  };

  const handleTermsAccept = async () => {
    if (!formData) return; // Prevent proceeding without formData

    setLoading(true);
    setErrorMessage("");

    try {
      await dispatch(register(formData)); // Dispatch register action with formData
      navigate('/some-route-after-registration'); // Navigate after successful registration
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed. Please try again."); // Display error message
    } finally {
      setLoading(false);
      setShowModal(false); // Close modal after handling response
    }
  };

  const handleTermsDecline = () => {
    setShowModal(false);
    setErrorMessage("You must accept the terms and conditions to proceed.");
  };

  return (
    <div className="registration-page">
      <div className="registration-form-box">
        <h1>Create Your Account</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <SignUpForm onSubmit={handleRegistration} />

        <TermsModal 
          show={showModal} 
          onClose={handleTermsDecline} 
          onAccept={handleTermsAccept} 
        />

        {loading && <p>Registering, please wait...</p>}
      </div>
    </div>
  );
};

export default SignUpPage;
