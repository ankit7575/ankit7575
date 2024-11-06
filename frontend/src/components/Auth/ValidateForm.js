// src/pages/Customer/validate-form.js

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../actions/userActions"; // Import your verifyOtp action
import { useNavigate } from "react-router-dom";
import './Form.css'; // Import your styles

const ValidateForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.user);

    const [verificationCode, setVerificationCode] = useState("");
    const [email, setEmail] = useState("");

    // Set the email once the component mounts
    useEffect(() => {
        const storedEmail = sessionStorage.getItem("userEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            alert("No email found. Please register first.");
            navigate("/"); // Redirect to sign up if no email is found
        }
    }, [navigate]);

    // Handle input changes
    const handleChange = (e) => {
        setVerificationCode(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare the payload according to the required JSON structure
            const payload = {
                email: email,
                otp: verificationCode,
            };

            // Dispatch the action with the payload
            await dispatch(verifyOtp(payload));

            // If verification is successful, navigate to the dashboard
            navigate("/dashboard"); // Adjust this to your actual dashboard route
        } catch (err) {
            // Handle specific error responses
            if (err.response && err.response.data) {
                alert(err.response.data.message || "OTP verification failed");
            } else {
                alert("OTP verification failed");
            }
        }
    };

    // Redirect to dashboard if user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/validate-form"); // Redirect to dashboard if already authenticated
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="registration-page">
            <div className="registration-form-box">
                <div className="signup-form-container">
                    <form className="validate-form" onSubmit={handleSubmit}>
                        <h2>Verify Your Email</h2>
                        <p>We have sent a verification code to your email: <strong>{email}</strong></p>
                        <label htmlFor="verificationCode" className="form-label">Verification Code</label>
                        <input
                            type="text"
                            id="verificationCode"
                            name="verificationCode"
                            placeholder="Enter Verification Code"
                            value={verificationCode}
                            onChange={handleChange}
                            required
                        />
                        {error && <p className="error-message" role="alert">{error}</p>}
                        <button type="submit" className="verify-button" disabled={loading}>
                            {loading ? "Verifying..." : "Verify"}
                        </button>
                    </form>
                    <div className="login-button-container">
                        <button 
                            onClick={() => navigate("/login")} 
                            className="login-button"
                        >
                            Already have an account? Log In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ValidateForm;
