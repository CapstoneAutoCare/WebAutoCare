import "./App.css";
import Login from "./components/Authen/Login";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./components/Authen/Register";
import LayoutWithGlass from "./Data/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<LayoutWithGlass />}>
          <Route index element={<Sidebar />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
