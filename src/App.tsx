import { ThemeProvider } from "@emotion/react";
import defaultTheme from "./theme";
import VerticalLayout from "./common/layout/VerticalLayout";
import { Navigate, Route, Routes } from "react-router";
import { publicRoutes } from "./routes";
import ProtectedRoute from "./common/ProtectedRoute/ProtectedRoute";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
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
}

export default App;
