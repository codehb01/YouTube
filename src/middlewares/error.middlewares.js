import mongoose from "mongoose";
import { apiError } from "../utils/apiError.js";

// Centralized error-handling middleware
const errorHandler = (err, req, res, next) => {
  let error = err;

  // If the error is NOT already an instance of our custom apiError class,
  // wrap it inside an apiError for consistent structure
  if (!(error instanceof apiError)) {
    let statusCode = 500; // Default to 500 (Internal Server Error)

    // If the error has a statusCode, use it
    if (error.statusCode) {
      statusCode = error.statusCode;
    }
    // If it's a Mongoose validation or database error, use 400 (Bad Request)
    else if (error instanceof mongoose.Error) {
      statusCode = 400;
    }

    // Use the provided error message or fallback to a generic one
    const message = error.message || "Something went wrong";

    // Wrap the raw error into our apiError format
    error = new apiError(
      statusCode, // HTTP status code
      message, // Error message
      error?.errors || [], // Extra error details (e.g., validation errors)
      err.stack // Stack trace for debugging
    );
  }

  // Build the error response object
  const response = {
    success: false, // Indicate failure
    statusCode: error.statusCode || 500, // Ensure a valid status code is set
    message: error.message, // Final error message
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }), // Only include stack in development
  };

  // Send the error response to the client
  return res.status(response.statusCode).json(response);
};

export { errorHandler };
