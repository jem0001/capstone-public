import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const verify = async () => {
    try {
      const response = await axios.get("/auth/verify");
      console.log(response);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    verify();
  }, []);

  if (isAuthenticated === null) {
    return <></>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login"></Navigate>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
