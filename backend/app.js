// app.js
const express = require("express");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const errorMiddleware = require("./middleware/error"); // Ensure this path is correct
const userRoutes = require("./routes/userRoute"); // Ensure this path is correct

const app = express();

// Trust the first proxy (adjust this if needed based on your configuration)
app.set('trust proxy', 1); // Use 1 to trust the first proxy

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies from the request
app.use(limiter); // Apply the rate limiting middleware

// Route Imports
app.use("/api/v1", userRoutes); // Mount user routes

// Error Middleware
app.use(errorMiddleware); // Handle errors

// Export the app for use in server.js or elsewhere
module.exports = app;
