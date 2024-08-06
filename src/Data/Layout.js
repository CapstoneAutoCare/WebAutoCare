import { Outlet } from "react-router-dom";

function LayoutWithGlass() {
    return (
      <div className="AppGlass">
        <Outlet />
      </div>
    );
  }
  
  export default LayoutWithGlass;