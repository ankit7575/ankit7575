import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout"; // Adjust path if needed
import LoadingSpinner from "../../components/Shared/LoadingSpinner"; // Loading spinner component
import './Support.css'; // Import CSS for styling

const Support = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null); // Error state for handling submission errors

  // Simulated user data
  const user = {
    role: "customer", // Replace with dynamic user role
  };

  useEffect(() => {
    // Simulate loading data if needed
    const fetchData = () => {
      setLoading(false); // Set loading to false after data is "fetched"
    };

    fetchData(); // Call the function to simulate data fetching
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Show loading while processing submission

    // Simulate a support request submission
    setTimeout(() => {
      setLoading(false); // Hide loading

      // Simulate a success condition; you can replace this with actual error handling
      if (message.trim() === "") {
        setError("Message cannot be empty."); // Set an error if the message is empty
      } else {
        setSubmitted(true); // Indicate submission was successful
        setMessage(""); // Clear message
        setError(null); // Clear any previous errors
      }
    }, 1000); // Simulate network delay
  };

  if (loading) {
    return <LoadingSpinner />; // Show a loading spinner while fetching data
  }

  if (error) {
    return <div className="error">{error}</div>; // Display an error message if there's an error
  }

  return (
    <Layout userRole={user.role}> {/* Pass userRole to Layout */}
      <section className="support">
        <h1>Support</h1>
        {submitted ? (
          <div className="success-message">
            <h2>Thank you for your message!</h2>
            <p>We will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="support-form">
            <div className="form-group">
              <label htmlFor="supportMessage">Your Message:</label>
              <textarea
                id="supportMessage"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows="4"
                placeholder="Enter your message here..."
              ></textarea>
            </div>
            <button type="submit" className="submit-button">Submit</button>
          </form>
        )}
        
        {/* Contact Information Section */}
        <div className="contact-info">
          <h2>Contact Us</h2>
          <p>If you need immediate assistance, feel free to reach out via:</p>
          <div className="contact-details">
            <p>
              WhatsApp:{" "}
              <a href="https://wa.me/447454455319" target="_blank" rel="noopener noreferrer">
                +44 7454 455319
              </a>
            </p>
            <p>Email: 
              <a href="mailto:Support@kyriosfxadvisory.com"> Support@kyriosfxadvisory.com</a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Support; // Export the component
