import type React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

type ProtectedRoute = {
  children: React.ReactNode;
};
const ProtectedRoute = ({ children }: ProtectedRoute) => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/auth/login");
    }
  }, [navigate]);
  return <>{children}</>;
};

export default ProtectedRoute;
