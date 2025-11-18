import React from "react";
import { BrowserRouter } from "react-router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-tabs/style/react-tabs.css";
import { Provider } from "react-redux";
import "react-loading-skeleton/dist/skeleton.css";
import "./bootstrap";
import ReactDOM from "react-dom/client";
import App from "./src/App.jsx";
import store, { persistor } from "./src/redux/store.js";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("app")).render(
    <BrowserRouter>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </BrowserRouter>
);
