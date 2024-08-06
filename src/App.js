import "./App.css";
import Login from "./components/Authen/Login";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./components/Authen/Register";

function App() {
  return (
    <Router>
      {/* <div className="App">
        <Routes></Routes>
      </div> */}

      <div className="AppGlass">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Sidebar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
