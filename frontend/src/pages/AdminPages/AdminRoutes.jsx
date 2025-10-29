
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoutes = () => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    if (!decoded.isAdmin) return <Navigate to="/" />;
    return <Outlet />;
  } catch {
    return <Navigate to="/login" />;
  }
};

export default AdminRoutes;
