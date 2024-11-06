// Load necessary modules
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDatabase = require("./config/database");
const app = require("./app");
const bcrypt = require("bcrypt"); // Ensure bcrypt is included
const User = require("./models/userModel"); // Adjust to the correct User model path

// Config
dotenv.config({ path: path.join(__dirname, "config", "config.env") });

// Set proxy trust to support features like rate limiting
app.set("trust proxy", 1); // Trust the first proxy for secure header handling

// Connect to the database
connectDatabase();

// Define constants
const PORT = process.env.PORT || 5000;

// Start the Express server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Graceful shutdown on uncaught exceptions and unhandled promise rejections
process.on("uncaughtException", (err) => {
  console.error(`Error: ${err.message}`);
  console.error("Shutting down due to uncaught exception");
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  console.error("Shutting down due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});

// Terminate server gracefully on SIGTERM or SIGINT
const shutdownServer = () => {
  console.log("Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdownServer);
process.on("SIGINT", shutdownServer);

module.exports = app; // Export the app for testing or further configurations
