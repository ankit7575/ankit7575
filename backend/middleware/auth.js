const ErrorHandler = require("../utils/errorhandler"); // Ensure the import matches the actual file case
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to authenticate user based on JWT
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    // Retrieve token from cookies
    const token = req.cookies.token;

    // Check if the token exists
    if (!token) {
        return next(new ErrorHandler("Access denied. Please log in to continue.", 401));
    }

    try {
        // Verify and decode the JWT token
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        // Log the decoded user data for debugging
        console.log("Decoded user data:", decodedData);

        // Fetch user details excluding the password
        req.user = await User.findById(decodedData.id).select('-password').lean(); // Use lean() for a plain JavaScript object

        // Check if the user exists
        if (!req.user) {
            return next(new ErrorHandler("User not found. Please register or log in.", 404));
        }

        // Proceed to the next middleware if authenticated
        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            console.error("Invalid JWT token:", error);
            return next(new ErrorHandler("Invalid session. Please log in again.", 401));
        } else if (error.name === 'TokenExpiredError') {
            console.error("JWT token has expired:", error);
            return next(new ErrorHandler("Session expired. Please log in again.", 401));
        }

        console.error("JWT Verification Error:", error); // Log other errors
        return next(new ErrorHandler("Invalid session. Please log in again.", 401));
    }
});

// Middleware to authorize specific user roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Check if the user is authenticated
        if (!req.user) {
            return next(new ErrorHandler("User not authenticated.", 403));
        }

        // Check if the user's role is authorized
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Access denied. Role '${req.user.role}' is not authorized.`, 403));
        }

        // User is authorized, proceed to the next middleware
        next();
    };
};

// Protect middleware that ensures both authentication and authorization if needed
exports.protect = catchAsyncErrors(async (req, res, next) => {
    await exports.isAuthenticatedUser(req, res, next); // Ensure user is authenticated
    // No need to call next() here as isAuthenticatedUser already calls it
});
