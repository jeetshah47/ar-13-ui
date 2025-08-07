import { ThemeProvider } from "@emotion/react";
import defaultTheme from "./theme";
import VerticalLayout from "./common/layout/VerticalLayout";
import { Navigate, Route, Routes } from "react-router";
import { publicRoutes } from "./routes";

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Routes>
        <Route path="/app/*" element={<VerticalLayout />} />
        {publicRoutes.map((route) => (
          <Route path={route.path} element={route.component} />
        ))}
        <Route path="/" element={<Navigate to={"/app/dashboard"} />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
