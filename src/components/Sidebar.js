import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { UilSignOutAlt } from "@iconscout/react-unicons";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import ProfilePage from "./Updates/ProfilePage";

import Booking from "./Booking/Booking";
import CustomerCare from "./CustomerCare/CustomerCare";
import SparePartItems from "./SparePart/SparePartItems";
import MaintenanceServices from "./Service/MaintenanceServices";
import ProfileCardWidget from "./Updates/ProfileCardWidget";
import {
  SidebarDataAdmin,
  SidebarDataCenter,
  SidebarDataCustomerCare,
} from "../Data/Data";
import Technician from "./Technician/Technician";
import MaintenanceInformations from "./MaintenanceInformations/MaintenanceInformations";
import HorizontalNonLinearStepper from "./MaintenanceInformations/HorizontalNon";
import Task from "./Task/Task";
import { MainDash } from "./MainDash/MainDash";
import { CheckRole } from "../redux/authSlice";
import Center from "./PageAdmin/Center";
import ScheduleList from "./PageAdmin/ScheduleList";
import BrandVehicle from "./PageAdmin/BrandVehicle";
import VehicleModel from "./PageAdmin/VehicleModel";
import SparePart from "./PageAdmin/SparePart";
import ServiceCare from "./PageAdmin/ServiceCare";
const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  const sidebarVariants = {
    true: { left: "0" },
    false: { left: "-60%" },
  };

  const tokenlocal = localStorage.getItem("localtoken");

  const decodeToken = (token) => {
    try {
      return jwt_decode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const getSidebarData = () => {
    switch (userRole) {
      case "CENTER":
        return SidebarDataCenter;
      case "CUSTOMERCARE":
        return SidebarDataCustomerCare;
      default:
        return SidebarDataAdmin;
    }
  };

  const sidebarComponents = {
    CENTER: [
      <MainDash />,
      <MaintenanceInformations />,
      <Booking />,
      <Task />,
      <SparePartItems />,
      <MaintenanceServices />,
      <CustomerCare />,
      <Technician />,
      <HorizontalNonLinearStepper />,
    ],
    CUSTOMERCARE: [
      <MaintenanceInformations />,
      <Booking />,
      <Task />,
      <SparePartItems />,
      <MaintenanceServices />,
    ],
    ADMIN: [
      <MainDash />,
      <Center />,
      <ScheduleList />,
      <BrandVehicle />,
      <VehicleModel />,
      <SparePart />,
      <ServiceCare />,
      <ProfilePage />,
    ],
  };

  useEffect(() => {
    const code = decodeToken(tokenlocal);
    const role =
      code["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    localStorage.setItem("AccountId", code.sub);
    localStorage.setItem("ROLE", role);
    CheckRole(tokenlocal, role);
    setUserRole(role);

    if (role === "CUSTOMER" || role === "TECHNICIAN") {
      navigate("/");
    }
  }, [selected, tokenlocal, navigate]);

  const handleSidebarItemClick = (index) => {
    setSelected(index);
  };

  const handleSubmitLogOut = (e) => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <>
      <div
        className="bars"
        style={expanded ? { left: "60%" } : { left: "5%" }}
        onClick={() => setExpanded(!expanded)}
      >
        <UilBars />
      </div>
      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ""}
      >
        <div className="logo">
          <img
            src="https://img.freepik.com/premium-vector/car-auto-garage-concept-premium-logo-design_645012-278.jpg"
            alt="logo"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "70%",
              border: "1px solid #000",
            }}
          />
        </div>
        <div className="menu">
          {getSidebarData().map((item, index) => (
            <div
              className={selected === index ? "menuItem active" : "menuItem"}
              key={index}
              onClick={() => handleSidebarItemClick(index)}
            >
              <item.icon />
              <span>{item.heading}</span>
            </div>
          ))}
          <div className="menuItem">
            <UilSignOutAlt onClick={handleSubmitLogOut}>Logout</UilSignOutAlt>
          </div>
        </div>
      </motion.div>
      {sidebarComponents[userRole] ? (
        sidebarComponents[userRole][selected]
      ) : (
        <MainDash />
      )}
    </>
  );
};

export default Sidebar;
