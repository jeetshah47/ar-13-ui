import { ThemeProvider } from "@emotion/react";
import { createAppTheme } from "./theme";
import { ThemeProvider as CustomThemeProvider, useTheme } from "./contexts/ThemeContext";
import { NetworkErrorProvider, useNetworkError } from "./contexts/NetworkErrorContext";
import VerticalLayout from "./common/layout/VerticalLayout";
import { Navigate, Route, Routes } from "react-router";
import { publicRoutes } from "./routes";
import ProtectedRoute from "./common/ProtectedRoute/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { useMemo } from "react";
import ServerOffline from "./common/components/ServerOffline/ServerOffline";

const AppContent = () => {
  const { mode } = useTheme();
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  const { isNetworkError } = useNetworkError();

  return (
    <ThemeProvider theme={theme}>
      {isNetworkError && <ServerOffline />}
      <Routes>
        <Route
          key="/app/*"
          path="/app/*"
          element={
            <ProtectedRoute>
              <VerticalLayout />
            </ProtectedRoute>
          }
        />
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
        <Route key="/" path="/" element={<Navigate to={"/app/dashboard"} />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
};

function App() {
  return (
    <CustomThemeProvider>
      <NetworkErrorProvider>
        <AppContent />
      </NetworkErrorProvider>
    </CustomThemeProvider>
  );
}

export default App;
