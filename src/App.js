import React from "react";
import "./App.css";
import Login from "./components/Authen/Login";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Register from "./components/Authen/Register";
import LayoutWithGlass from "./Data/Layout";
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation();

  const isAuthPage = location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<LayoutWithGlass />}>
          <Route index element={<Sidebar />} />
        </Route>
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
