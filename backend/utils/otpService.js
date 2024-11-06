const nodemailer = require("nodemailer");
// OTP management
const otpStore = {}; // A simple in-memory store for OTPs

// Function to generate a random OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Function to send OTP to the user's email
const sendOtp = async (email, otp) => {
  // Configure nodemailer transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Use a specified host
    port: process.env.SMTP_PORT || 587, // Default port to 587 if not specified
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_MAIL, // Your email address
      pass: process.env.SMTP_PASSWORD, // Your email password or app password
    },
  });

  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`, // Sender's email
    to: email, // Recipient's email
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
  };

  // Store the OTP with an expiration time (10 minutes)
  otpStore[email] = {
    otp,
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes from now
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to: ${email}`);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
};

// Function to verify the OTP
const verifyOtp = (email, otp) => {
  const entry = otpStore[email];

  // Check if OTP exists and is not expired
  if (entry && entry.otp === otp && entry.expires > Date.now()) {
    delete otpStore[email]; // OTP used, delete it
    return true; // OTP is valid
  }
  
  return false; // OTP is invalid or expired
};

// Export the functions
module.exports = {
  generateOtp,
  sendOtp,
  verifyOtp,
};