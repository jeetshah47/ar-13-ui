import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, HashRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

// Use HashRouter for Electron (file:// protocol), BrowserRouter for web
// Check if we're running in Electron by checking for file:// protocol or electronAPI
const isElectron = typeof window !== 'undefined' && (
  window.location.protocol === 'file:' || 
  window.electronAPI !== undefined
);
const Router = isElectron ? HashRouter : BrowserRouter;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </StrictMode>
);
