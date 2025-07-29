import { ThemeProvider } from "@emotion/react";
import defaultTheme from "./theme";
import VerticalLayout from "./common/layout/VerticalLayout";
import { Route, Routes } from "react-router";
import { publicRoutes } from "./routes";

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Routes>
        <Route path="/app/*" element={<VerticalLayout />} />
        {publicRoutes.map((route) => (
          <Route path={route.path} element={route.component} />
        ))}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
