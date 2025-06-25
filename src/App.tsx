import { ThemeProvider } from "@emotion/react";
import defaultTheme from "./theme";
import VerticalLayout from "./common/layout/VerticalLayout";

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <VerticalLayout />
    </ThemeProvider>
  );
}

export default App;
