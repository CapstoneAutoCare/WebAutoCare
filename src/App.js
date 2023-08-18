import "./App.css";
import Login from "./components/Authen/Login";
import Sidebar from "./components/Sidebar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import RightSide from "./components/RigtSide/RightSide";
import Register from "./components/Authen/Register";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <div className="AppGlass">
          <Routes>
            <Route path="/dashboard" element={<Sidebar />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
