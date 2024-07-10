import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { UilSignOutAlt } from "@iconscout/react-unicons";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import MainDash from "./MainDash/MainDash";
// import Apply from "./Scheduler/Scheduler";
import { useNavigate } from "react-router-dom";
import RightSide from "./RigtSide/RightSide";
import jwt_decode from "jwt-decode";
import ProfilePage from "./Updates/ProfilePage";

import Booking from "./Booking/Booking";
import { CheckRole } from "../redux/authSlice";
import CustomerCare from "./CustomerCare/CustomerCare";
import SparePartItems from "./SparePart/SparePartItems";
import MaintenanceServices from "./Service/MaintenanceServices";
import ProfileCardWidget from "./Updates/ProfileCardWidget";
import { SidebarDataAdmin, SidebarDataCenter } from "../Data/Data";
import Technician from "./Technician/Technician";
import MaintenanceInformations from "./MaintenanceInformations/MaintenanceInformations";
import HorizontalNonLinearStepper from "./MaintenanceInformations/HorizontalNon";

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
    userRole === "CENTER" ? SidebarDataCenter : SidebarDataAdmin;

  const sidebarComponentsCenter = [
    <></>,
    // <MainDash />,
    <CustomerCare />,
    <Technician />,
    <Booking />,
    <SparePartItems setShowRightSide={setShowRightSide} />,
    <MaintenanceServices />,
    // <Apply />,
    <ProfilePage />,
    <MaintenanceInformations/>,
    <HorizontalNonLinearStepper/>
  ];
  const sidebarComponentsAdmin = [
    <MainDash />,
    // <Position />,
    // <AddLand />,
    <Booking />,
    // <Apply />,
    <ProfilePage />,
  ];

  
  useEffect(() => {
    var code = decodeToken(tokenlocal);
    const role =
      code["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const accountId = code.sub;
    localStorage.setItem("AccountId", accountId);
    localStorage.setItem("ROLE", role);

    setUserRole(role);
    CheckRole(tokenlocal, role);
    if (role === "CUSTOMER" || role === "TECHNICIAN" || role === "CUSTOMERCARE") {
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
        : sidebarComponentsAdmin[selected]}

      {showRightSide && (
        <div className="right-side-section">
          <ProfileCardWidget />
        </div>
      )}
    </>
  );
};

export default Sidebar;
