import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { UserContextProvider } from "./components/contextAPI/UserContextProvider.jsx";
import { ChatContextProvider } from "./components/contextAPI/ChatContextProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
