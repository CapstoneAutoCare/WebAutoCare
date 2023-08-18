import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import Logo from "../imgs/logo.png";
import { UilSignOutAlt } from "@iconscout/react-unicons";
import { SidebarDataAdmin } from "../Data/Data";
import { SidebarDataCompany } from "../Data/Data";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import MainDash from "./MainDash/MainDash";
import Staff from "./StaffCompany/Staff";
import Job from "./Job/Job";
import Apply from "./Apply/Apply";
import { useNavigate } from "react-router-dom";
import RightSide from "./RigtSide/RightSide";
import Post from "./Post/Post";
import jwt_decode from "jwt-decode";
import ProfilePage from "./Updates/ProfilePage";
import Position from "./Position/Position";

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
    userRole === "ADMIN" ? SidebarDataAdmin : SidebarDataCompany;
  const sidebarComponentsAdmin = [
    <MainDash />,
    <Staff />,
    <Job />,
    <Post />,
    <Apply />,
    <ProfilePage />,
  ];
  const sidebarComponentsCompany = [
    <MainDash />,
    <Position />,
    <Job />,
    <Post />,
    <Apply />,
    <ProfilePage />,
  ];
  const renderRightSide = () => {
    if (userRole === "ADMIN") {
      return selected < 7 && <RightSide />;
    } else if (userRole === "COMPANY") {
      // Add your logic to show RightSide component for COMPANY role
      // For example:
      return selected === 1 && <RightSide />;
    } else {
      return null; // If userRole is neither ADMIN nor COMPANY, don't show RightSide
    }
  };
  useEffect(() => {
    // Kiểm tra nếu selected === 0 thì hiển thị "RightSide"
    // var session = decodeToken(tokenFromSessionStorage);
    var code = decodeToken(tokenlocal);
    const role =
      code["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const accountId = code.sub;
    localStorage.setItem("AccountId", accountId);
    localStorage.setItem("ROLE", role);
    // localStorage.setItem();
    setUserRole(role);
    // console.log(accountId);
    // console.log(role);
    // setShowRightSide(selected < 7);
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
  const ADMIN = "Admin";
  const COMPANY = "Company";
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
        <div className="logo">
          <img src={Logo} alt="logo" />
          <span>
            {userRole === "ADMIN" ? (
              <span className="admin">{ADMIN}</span>
            ) : (
              <span className="company">{COMPANY}</span>
            )}
          </span>
        </div>

        <div className="menu">
          {currentSidebarData.map((item, index) => {
            return (
              <div
                className={selected === index ? "menuItem active" : "menuItem"}
                key={index}
                onClick={() => handleSidebarItemClick(index)} // Call the click handler with the index of the clicked item
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

      {userRole === "ADMIN"
        ? sidebarComponentsAdmin[selected]
        : sidebarComponentsCompany[selected]}
      {renderRightSide()}
    </>
  );
};

export default Sidebar;
