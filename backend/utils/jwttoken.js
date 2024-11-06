const sendToken = (user, statusCode, res) => {
  // Generate JWT token for the user
  const token = user.getJWTToken();

  // Options for the cookie with added security measures
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true, // Accessible only by web server
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: 'Strict', // Prevent CSRF attacks
  };

  // Set cookie and send response
  return res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Include user role if necessary
      // You can include other user details as needed
    },
    token,
  });
};

module.exports = sendToken;
