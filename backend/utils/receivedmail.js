const nodemailer = require("nodemailer");

// Function to create a nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Define your SMTP host here
    port: process.env.SMTP_PORT || 587, // Default to 587 if not provided
    secure: process.env.SMTP_PORT == 465, // Secure if port is 465
    auth: {
      user: process.env.SMTP_MAIL, // Your SMTP mail (from .env)
      pass: process.env.SMTP_PASSWORD, // Your SMTP password (from .env)
    },
  });
};

// Function to send email
const sendEmailNotification = async (options) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`, // Sender's name and email
    to: options.email, // Recipient email (user's email or admin's email)
    subject: options.subject,
    text: options.message,
    attachments: options.attachments || [], // Optional attachments (if any)
  };

  try {
    await transporter.sendMail(mailOptions);  // Send email
    console.log(`Email sent to: ${options.email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Function to send registration data to the admin email
const sendAdminNotification = async (userData) => {
  const adminEmail = 'kyriosfxadvisory01@gmail.com'; // Admin email address

  // Format the registration details
  const adminMessage = `
    A new user has registered:

    Name: ${userData.name}
    Email: ${userData.email}
    Phone: ${userData.phoneNumber}
    Referral ID: ${userData.referralId}
  `;

  // Send email to the admin
  try {
    await sendEmailNotification({
      email: adminEmail, // Send the notification to admin's email
      subject: 'New User Registration', // Subject of the email
      message: adminMessage, // Registration details message
    });
    console.log('Admin notified about new registration');
  } catch (error) {
    console.error('Error notifying admin:', error);
    throw new Error(`Failed to send admin notification: ${error.message}`);
  }
};

// Export the OTP and registration notification functions
module.exports = {
  sendEmailNotification,
  sendAdminNotification,
};
