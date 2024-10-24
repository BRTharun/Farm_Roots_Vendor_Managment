import  { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import "./index.css";
// import { BrowserRouter as Router } from "react-router-dom";
import store from "./components/utils/store";
import ErrorBoundary from "./components/pages/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ErrorBoundary>
            <Provider store={store}>
                <App />
            </Provider>
        </ErrorBoundary>
    </StrictMode>
);
