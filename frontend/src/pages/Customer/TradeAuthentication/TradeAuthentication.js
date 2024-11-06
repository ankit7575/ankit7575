import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout"; // Adjust path if needed
import LoadingSpinner from "../../../components/Shared/LoadingSpinner"; // Loading spinner component
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; // Import the package's CSS
import "../../../styles/global.css"; // Importing CSS for styling
import './TradeAuthentication.css'; // Importing specific CSS for TradeAuthentication

const TradeAuthentication = () => {
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");

  // User form state
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    country: "",
    capital: "",
    plan: "",
  });

  // States for Plan A and Plan B details
  const [planADetails, setPlanADetails] = useState({
    mt5Id: "",
    mt5Password: "",
    brokerName: "",
    showPassword: false,
  });

  const [planBDetails, setPlanBDetails] = useState({
    mt5Id: "",
    mt5Password: "",
    brokerName: "",
    showPassword: false,
  });

  // Error messages for validation
  const [errors, setErrors] = useState({});

  // Simulated user data
  const user = {
    role: "customer", // Replace with dynamic user role
  };

  useEffect(() => {
    const fetchData = () => {
      setLoading(false); // Simulating data fetch
    };
    fetchData(); // Call the function to simulate data fetching
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handlePhoneChange = (value) => {
    setValues({ ...values, phone: value }); // Update phone number in state
  };

  const validateForm = () => {
    const newErrors = {};
    if (!values.name) newErrors.name = "Name is required.";
    if (!values.email) newErrors.email = "Email is required.";
    if (!values.phone) newErrors.phone = "Phone number is required.";
    if (!values.dob) newErrors.dob = "Date of birth is required.";
    if (!values.country) newErrors.country = "Country is required.";
    if (!values.plan) newErrors.plan = "Please select a plan.";
    if (!values.capital) newErrors.capital = "Capital is required.";
    
    // Validate capital based on selected plan
    const capital = parseFloat(values.capital);
    if (values.plan === "Plan A" && (isNaN(capital) || capital < 1000)) {
      newErrors.capital = "Minimum amount for Plan A is 1000.";
    }
    if (values.plan === "Plan B" && (isNaN(capital) || capital < 5000)) {
      newErrors.capital = "Minimum amount for Plan B is 5000.";
    }
    if (values.plan === "Plan C" && (isNaN(capital) || capital < 6000)) {
      newErrors.capital = "Minimum amount for Plan C is 600.";
    }

    // Validate Plan A fields if selected
    if (values.plan === "Plan A") {
      if (!planADetails.mt5Id) newErrors.mt5IdA = "MT5 ID for Plan A is required.";
      if (!planADetails.mt5Password) newErrors.mt5PasswordA = "MT5 Password for Plan A is required.";
      if (!planADetails.brokerName) newErrors.brokerNameA = "Broker Name for Plan A is required.";
    }

    // Validate Plan B fields if selected
    if (values.plan === "Plan B") {
      if (!planBDetails.mt5Id) newErrors.mt5IdB = "MT5 ID for Plan B is required.";
      if (!planBDetails.mt5Password) newErrors.mt5PasswordB = "MT5 Password for Plan B is required.";
      if (!planBDetails.brokerName) newErrors.brokerNameB = "Broker Name for Plan B is required.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Show loading while processing submission

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set validation errors if any
      setLoading(false); // Stop loading
      return;
    }

    // Simulate a support request submission
    setTimeout(() => {
      setLoading(false); // Hide loading
      if (message.trim() === "") {
        setMessage("Message cannot be empty."); // Set an error if the message is empty
      } else {
        setSubmitted(true); // Indicate submission was successful
        setMessage(""); // Clear message
        setValues({
          name: "",
          email: "",
          phone: "",
          dob: "",
          country: "",
          capital: "",
          plan: "",
        }); // Reset form values after submission
        setErrors({}); // Clear errors
        setPlanADetails({ mt5Id: "", mt5Password: "", brokerName: "", showPassword: false }); // Reset Plan A details
        setPlanBDetails({ mt5Id: "", mt5Password: "", brokerName: "", showPassword: false }); // Reset Plan B details
      }
    }, 1000); // Simulate network delay
  };

  if (loading) {
    return <LoadingSpinner />; // Show a loading spinner while fetching data
  }

  return (
    <Layout userRole={user.role}>
      <section className="trade-authentication">
        <h1>Trade Authentication</h1>
        {submitted ? (
          <div className="success-message">
            <h2>Thank you for your message!</h2>
            <p>We will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="trade-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={values.name} onChange={handleChange} />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <PhoneInput
                country={'in'} // Default to India (+91)
                value={values.phone}
                onChange={handlePhoneChange}
                inputStyle={{ width: '100%' }} // Customize input width to fit your form
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={values.email} onChange={handleChange} />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={values.dob} onChange={handleChange} />
              {errors.dob && <span className="error-message">{errors.dob}</span>}
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" value={values.country} onChange={handleChange} />
              {errors.country && <span className="error-message">{errors.country}</span>}
            </div>
            <div className="form-group">
              <label>Plan</label>
              <select name="plan" value={values.plan} onChange={handleChange}>
                <option value="">Select Plan</option>
                <option value="Plan A">Plan A</option>
                <option value="Plan B">Plan B</option>
                <option value="Plan C">Plan C</option>
              </select>
              {errors.plan && <span className="error-message">{errors.plan}</span>}
            </div>
            <div className="form-group">
              <label>Capital</label>
              <input type="number" name="capital" value={values.capital} onChange={handleChange} />
              {errors.capital && <span className="error-message">{errors.capital}</span>}
            </div>

            {values.plan === "Plan A" && (
              <div className="plan-details">
                <h3>Plan A Details</h3>
                <div className="form-group">
                  <label>MT5 ID</label>
                  <input
                    type="text"
                    name="mt5Id"
                    value={planADetails.mt5Id}
                    onChange={(e) => setPlanADetails({ ...planADetails, mt5Id: e.target.value })}
                  />
                  {errors.mt5IdA && <span className="error-message">{errors.mt5IdA}</span>}
                </div>
                <div className="form-group">
                  <label>MT5 Password</label>
                  <input
                    type={planADetails.showPassword ? "text" : "password"}
                    name="mt5Password"
                    value={planADetails.mt5Password}
                    onChange={(e) => setPlanADetails({ ...planADetails, mt5Password: e.target.value })}
                  />
                  <input
                    type="checkbox"
                    checked={planADetails.showPassword}
                    onChange={() => setPlanADetails({ ...planADetails, showPassword: !planADetails.showPassword })}
                  /> Show Password
                  {errors.mt5PasswordA && <span className="error-message">{errors.mt5PasswordA}</span>}
                </div>
                <div className="form-group">
                  <label>Broker Name</label>
                  <input
                    type="text"
                    name="brokerName"
                    value={planADetails.brokerName}
                    onChange={(e) => setPlanADetails({ ...planADetails, brokerName: e.target.value })}
                  />
                  {errors.brokerNameA && <span className="error-message">{errors.brokerNameA}</span>}
                </div>
              </div>
            )}

            {values.plan === "Plan B" && (
              <div className="plan-details">
                <h3>Plan B Details</h3>
                <div className="form-group">
                  <label>MT5 ID</label>
                  <input
                    type="text"
                    name="mt5Id"
                    value={planBDetails.mt5Id}
                    onChange={(e) => setPlanBDetails({ ...planBDetails, mt5Id: e.target.value })}
                  />
                  {errors.mt5IdB && <span className="error-message">{errors.mt5IdB}</span>}
                </div>
                <div className="form-group">
                  <label>MT5 Password</label>
                  <input
                    type={planBDetails.showPassword ? "text" : "password"}
                    name="mt5Password"
                    value={planBDetails.mt5Password}
                    onChange={(e) => setPlanBDetails({ ...planBDetails, mt5Password: e.target.value })}
                  />
                  <input
                    type="checkbox"
                    checked={planBDetails.showPassword}
                    onChange={() => setPlanBDetails({ ...planBDetails, showPassword: !planBDetails.showPassword })}
                  /> Show Password
                  {errors.mt5PasswordB && <span className="error-message">{errors.mt5PasswordB}</span>}
                </div>
                <div className="form-group">
                  <label>Broker Name</label>
                  <input
                    type="text"
                    name="brokerName"
                    value={planBDetails.brokerName}
                    onChange={(e) => setPlanBDetails({ ...planBDetails, brokerName: e.target.value })}
                  />
                  {errors.brokerNameB && <span className="error-message">{errors.brokerNameB}</span>}
                </div>
              </div>
            )}

            {values.plan === "Plan C" && (
              <>
                <div className="plan-details">
                  <h3>Plan A Details</h3>
                  <div className="form-group">
                    <label>MT5 ID</label>
                    <input
                      type="text"
                      name="mt5Id"
                      value={planADetails.mt5Id}
                      onChange={(e) => setPlanADetails({ ...planADetails, mt5Id: e.target.value })}
                    />
                    {errors.mt5IdA && <span className="error-message">{errors.mt5IdA}</span>}
                  </div>
                  <div className="form-group">
                    <label>MT5 Password</label>
                    <input
                      type={planADetails.showPassword ? "text" : "password"}
                      name="mt5Password"
                      value={planADetails.mt5Password}
                      onChange={(e) => setPlanADetails({ ...planADetails, mt5Password: e.target.value })}
                    />
                    <input
                      type="checkbox"
                      checked={planADetails.showPassword}
                      onChange={() => setPlanADetails({ ...planADetails, showPassword: !planADetails.showPassword })}
                    /> Show Password
                    {errors.mt5PasswordA && <span className="error-message">{errors.mt5PasswordA}</span>}
                  </div>
                  <div className="form-group">
                    <label>Broker Name</label>
                    <input
                      type="text"
                      name="brokerName"
                      value={planADetails.brokerName}
                      onChange={(e) => setPlanADetails({ ...planADetails, brokerName: e.target.value })}
                    />
                    {errors.brokerNameA && <span className="error-message">{errors.brokerNameA}</span>}
                  </div>
                </div>

                <div className="plan-details">
                  <h3>Plan B Details</h3>
                  <div className="form-group">
                    <label>MT5 ID</label>
                    <input
                      type="text"
                      name="mt5Id"
                      value={planBDetails.mt5Id}
                      onChange={(e) => setPlanBDetails({ ...planBDetails, mt5Id: e.target.value })}
                    />
                    {errors.mt5IdB && <span className="error-message">{errors.mt5IdB}</span>}
                  </div>
                  <div className="form-group">
                    <label>MT5 Password</label>
                    <input
                      type={planBDetails.showPassword ? "text" : "password"}
                      name="mt5Password"
                      value={planBDetails.mt5Password}
                      onChange={(e) => setPlanBDetails({ ...planBDetails, mt5Password: e.target.value })}
                    />
                    <input
                      type="checkbox"
                      checked={planBDetails.showPassword}
                      onChange={() => setPlanBDetails({ ...planBDetails, showPassword: !planBDetails.showPassword })}
                    /> Show Password
                    {errors.mt5PasswordB && <span className="error-message">{errors.mt5PasswordB}</span>}
                  </div>
                  <div className="form-group">
                    <label>Broker Name</label>
                    <input
                      type="text"
                      name="brokerName"
                      value={planBDetails.brokerName}
                      onChange={(e) => setPlanBDetails({ ...planBDetails, brokerName: e.target.value })}
                    />
                    {errors.brokerNameB && <span className="error-message">{errors.brokerNameB}</span>}
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        )}
      </section>
    </Layout>
  );
};

export default TradeAuthentication; // Export the component
