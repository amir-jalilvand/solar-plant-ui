import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./lib/theme";
import { RoleProvider } from "./lib/role";
import { DemoStateProvider } from "./lib/demo";
import { ToastProvider } from "./components/Toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RoleProvider>
        <DemoStateProvider>
          <ToastProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ToastProvider>
        </DemoStateProvider>
      </RoleProvider>
    </ThemeProvider>
  </StrictMode>,
);
