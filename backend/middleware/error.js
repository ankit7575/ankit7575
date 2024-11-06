// Error handling middleware
const handleCastError = (err) => {
  const message = `Resource not found. Invalid: ${err.path}`;
  return new ErrorHandler(message, 400);
};

const handleDuplicateKeyError = (err) => {
  const message = `Duplicate field: ${Object.keys(err.keyValue).join(', ')} entered.`;
  return new ErrorHandler(message, 400);
};

const handleJsonWebTokenError = () => {
  const message = `Invalid token. Please log in again.`;
  return new ErrorHandler(message, 401);
};

const handleTokenExpiredError = () => {
  const message = `Your session has expired. Please log in again.`;
  return new ErrorHandler(message, 401);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Validation Error: ${errors.join(", ")}`;
  return new ErrorHandler(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Log error for debugging purposes
  console.error(`Error: ${err.stack}`);

  // Handling specific Mongoose errors
  if (err.name === "CastError") {
    err = handleCastError(err);
  } else if (err.code === 11000) {
    err = handleDuplicateKeyError(err);
  } else if (err.name === "JsonWebTokenError") {
    err = handleJsonWebTokenError();
  } else if (err.name === "TokenExpiredError") {
    err = handleTokenExpiredError();
  } else if (err.name === "ValidationError") {
    err = handleValidationError(err);
  }

  // Handling file upload errors if multer is used
  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Development mode: Send full error details
  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      stack: err.stack,
    });
  }

  // Production mode: Send generic error message
  res.status(err.statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};
