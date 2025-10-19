import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");

  // If token exists, allow access, otherwise redirect to login page
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
