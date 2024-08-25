import { useSelector } from "react-redux";
import "../components/navabar.css";

const Navbar = () => {
    const { profile } = useSelector((state) => state.account); 
    const avatarUrl = profile?.avatarUrl || "default-avatar.png"; 
  
    return (
      <div className="navbar">
        <div className="navbar-avatar">
          <img src={avatarUrl} alt="Avatar" className="avatar-image" />
        </div>
      </div>
    );
  };
  
  export default Navbar;