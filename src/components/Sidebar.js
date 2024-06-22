import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { UilSignOutAlt } from "@iconscout/react-unicons";
import { SidebarDataAdmin } from "../Data/Data";
import { SidebarDataCompany } from "../Data/Data";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import MainDash from "./MainDash/MainDash";
import Apply from "./Scheduler/Scheduler";
import { useNavigate } from "react-router-dom";
import RightSide from "./RigtSide/RightSide";
import jwt_decode from "jwt-decode";
import ProfilePage from "./Updates/ProfilePage";

import Booking from "./Booking/Booking";
import { CheckRole } from "../redux/authSlice";
import Staff from "./StaffCompany/Staff";
import SparePartItems from "./SparePart/SparePartItems";
import MaintenanceServices from "./Service/MaintenanceServices";

const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [showRightSide, setShowRightSide] = useState(false);
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();

  const [expanded, setExpaned] = useState(true);

  const sidebarVariants = {
    true: {
      left: "0",
    },
    false: {
      left: "-60%",
    },
  };
  // const tokenFromSessionStorage = sessionStorage.getItem("token");
  const tokenlocal = localStorage.getItem("localtoken");

  const decodeToken = (token) => {
    try {
      const decodedData = jwt_decode(token);
      return decodedData;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };
  const [id, setId] = useState("");
  const currentSidebarData =
    userRole === "CENTER" ? SidebarDataAdmin : SidebarDataCompany;
  const sidebarComponentsCenter = [
    <MainDash />,
    <Staff />,
    // <AddLand />,
    <Booking />,
    <SparePartItems />,
    <MaintenanceServices />,
    <Apply />,
    <ProfilePage />,
  ];
  const sidebarComponentsCompany = [
    <MainDash />,
    // <Position />,
    // <AddLand />,
    <Booking />,
    <Apply />,
    <ProfilePage />,
  ];
  const renderRightSide = () => {
    if (userRole === "CENTER") {
      return selected < 7;
    } else if (userRole === "OWNER") {
      return selected === 1 && <RightSide />;
    } else {
      return null;
    }
  };
  // const { customercares, status, error } = useSelector((state) =>
  //   GetListByCenter(state)
  // );

  useEffect(() => {
    var code = decodeToken(tokenlocal);
    const role =
      code["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const accountId = code.sub;
    localStorage.setItem("AccountId", accountId);
    localStorage.setItem("ROLE", role);

    setUserRole(role);
    CheckRole(tokenlocal, role);
    if (role === "CLIENT") {
      navigate("/");
    }
  }, [selected, userRole]);

  const handleSidebarItemClick = (index) => {
    // console.log(token);
    setSelected(index);
  };

  const handleSubmitLogOut = (e) => {
    e.preventDefault();
    localStorage.clear(); // Removes all data from localStorage
    sessionStorage.clear();
    navigate("/");
  };
  // const ADMIN = "ADMIN";
  // const COMPANY = "CENTER";
  console.log(window.innerWidth);
  return (
    <>
      <div
        className="bars"
        style={expanded ? { left: "60%" } : { left: "5%" }}
        onClick={() => setExpaned(!expanded)}
      >
        <UilBars />
      </div>
      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ""}
      >
        {/* logo */}
        {/* <div className="logo">
          <img src={Logo} alt="logo" />
          <span>
            {userRole === "ADMIN" ? (
              <span className="admin">{ADMIN}</span>
            ) : (
              <span className="company">{COMPANY}</span>
            )}
          </span>
        </div> */}

        <div className="menu">
          {currentSidebarData.map((item, index) => {
            return (
              <div
                className={selected === index ? "menuItem active" : "menuItem"}
                key={index}
                onClick={() => handleSidebarItemClick(index)}
              >
                <item.icon />
                <span>{item.heading}</span>
              </div>
            );
          })}
          {/* signoutIcon */}
          <div className="menuItem">
            <UilSignOutAlt onClick={handleSubmitLogOut}></UilSignOutAlt>
          </div>
        </div>
      </motion.div>

      {userRole === "CENTER"
        ? sidebarComponentsCenter[selected]
        : sidebarComponentsCompany[selected]}
      {renderRightSide()}
    </>
  );
};

export default Sidebar;
