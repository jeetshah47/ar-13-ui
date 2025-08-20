import type React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector, type RootState } from "../../store/store";

type ProtectedRoute = {
  children: React.ReactNode;
};
const ProtectedRoute = ({ children }: ProtectedRoute) => {
  const navigate = useNavigate();
  const authState = useAppSelector((state: RootState) => state.authReducer);

  useEffect(() => {
    if (!authState.loading && !authState.common.isLogin) {
      navigate("/auth/login");
    }
  }, [authState.common.isLogin, authState.loading, navigate]);
  return <>{children}</>;
};

export default ProtectedRoute;
