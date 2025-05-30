import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./redux/store";
import { Provider } from "react-redux";
import SnackbarProvider from "./Data/SnackbarProvider";

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <SnackbarProvider >
        <App />
      </SnackbarProvider>

    </Provider>

  </React.StrictMode>,
  document.getElementById("root")
);
