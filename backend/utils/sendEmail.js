const nodemailer = require("nodemailer");

// OTP in-memory store
const otpStore = {};

// Function to generate a random OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Function to create a nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587, // Default to 587 if not provided
    secure: process.env.SMTP_PORT == 465, // Secure if port is 465
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Function to send email
const sendEmail = async (options) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    attachments: options.attachments || [], // Optional attachments
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${options.email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Function to send OTP via email
const sendOtp = async (email) => {
  const otp = generateOtp(); // Generate a new OTP
  const message = `Your OTP code is: ${otp}. It is valid for 10 minutes.`;

  // Store OTP with expiration time (10 minutes)
  otpStore[email] = {
    otp,
    expires: Date.now() + 10 * 60 * 1000, // Expires in 10 minutes
  };

  // Send the OTP email
  try {
    await sendEmail({
      email,
      subject: 'Your OTP Code',
      message,
    });
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

// Export the OTP functions
module.exports = {
  sendOtp,
  verifyOtp,
  sendEmail,
};
