import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom"; // 👈 import this
import { AuthProvider } from "./context/AuthContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
     <React.StrictMode>
   <BrowserRouter>          {/* 👈 wrap the app */}
      <AuthProvider>         {/* make sure AuthProvider wraps App */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
