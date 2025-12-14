import type React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppSelector, useAppDispatch, type RootState } from "../../store/store";
import { fetchPermissionsAction } from "../../store/features/auth/authAction";

type ProtectedRoute = {
  children: React.ReactNode;
};
const ProtectedRoute = ({ children }: ProtectedRoute) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state: RootState) => state.authReducer);

  // Fetch permissions when user is logged in and permissions haven't been loaded yet
  useEffect(() => {
    if (authState.common.isLogin && authState.api.token && authState.user.permissions.length === 0 && !authState.permissionsLoading) {
      dispatch(fetchPermissionsAction());
    }
  }, [authState.common.isLogin, authState.api.token, authState.user.permissions.length, authState.permissionsLoading, dispatch]);

  useEffect(() => {
    if (!authState.loading && !authState.common.isLogin) {
      navigate("/auth/login");
    }
  }, [authState.common.isLogin, authState.loading, navigate]);
  return <>{children}</>;
};

export default ProtectedRoute;
