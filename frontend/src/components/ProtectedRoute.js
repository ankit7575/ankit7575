import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, element: Component, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading) return null; // Optionally render a loading spinner or nothing while loading

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if the route requires an admin, and if the user is not an admin
  if (isAdmin && user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // Render the requested component if everything is fine
  return <Component {...rest} />;
};

export default ProtectedRoute;
