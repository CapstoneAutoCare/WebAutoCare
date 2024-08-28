import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { UilSignOutAlt, UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProfilePage from "./Updates/ProfilePage";
import Booking from "./Booking/Booking";
import CustomerCare from "./CustomerCare/CustomerCare";
import SparePartItems from "./SparePart/SparePartItems";
import MaintenanceServices from "./Service/MaintenanceServices";
import Technician from "./Technician/Technician";
import MaintenanceInformations from "./MaintenanceInformations/MaintenanceInformations";
import Task from "./Task/Task";
import { MainDash } from "./MainDash/MainDash";
import { CheckRole } from "../redux/authSlice";
import Center from "./PageAdmin/Center";
import ScheduleList from "./PageAdmin/ScheduleList";
import BrandVehicle from "./PageAdmin/BrandVehicle";
import VehicleModel from "./PageAdmin/VehicleModel";
import SparePart from "./PageAdmin/SparePart";
import ServiceCare from "./PageAdmin/ServiceCare";
import { BrandGetAllList } from "../redux/brandSlice";
import { VehicleModelsGetAllList } from "../redux/vehiclemodelsSlice";
import { ScheduleListGetall } from "../redux/scheduleSlice";
import { SparePartsAll } from "../redux/sparepartsSlice";
import { Profile } from "../redux/accountSlice";
import ProfilePageV1 from "./Authen/Profile";
import { ServicesListGetAll } from "../redux/servicesSlice";
import Dashboard from "./MainDash/Dashboard";
import { VehiclesMaintenancesByCenter } from "../redux/vehiclemainSlice";
import { SidebarDataAdmin, SidebarDataCenter, SidebarDataCustomerCare } from "../Data/Data";
import Navbar from "./Navbar";
import Package from "./PageAdmin/Package";

const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      toast.error("Failed to decode token. Please log in again.");
      navigate("/");
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
      <ProfilePageV1 />,
    ],
    CUSTOMERCARE: [
      <MaintenanceInformations />,
      <Booking />,
      <Task />,
      <SparePartItems />,
      <MaintenanceServices />,
      <ProfilePageV1 />,
    ],
    ADMIN: [
      <Center />,
      <Package />,
      <ScheduleList />,
      <BrandVehicle />,
      <VehicleModel />,
      <SparePart />,
      <ServiceCare />,
      <ProfilePageV1 />,
    ],
  };

  useEffect(() => {
    const code = decodeToken(tokenlocal);
    if (!code) return;

    const role =
      code["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    dispatch(BrandGetAllList(tokenlocal));
    dispatch(VehicleModelsGetAllList(tokenlocal));
    dispatch(ScheduleListGetall(tokenlocal));
    dispatch(SparePartsAll(tokenlocal));
    dispatch(Profile(tokenlocal));
    dispatch(ServicesListGetAll(tokenlocal));

    localStorage.setItem("AccountId", code.sub);
    localStorage.setItem("ROLE", role);
    CheckRole(tokenlocal, role);
    setUserRole(role);

    if (role === "CENTER" || role === "CUSTOMERCARE") {
      const centerId = localStorage.getItem("CenterId");
      dispatch(VehiclesMaintenancesByCenter(centerId));
      toast.success(`Welcome, ${role}!`);
    }
    if (role === "CUSTOMER" || role === "TECHNICIAN") {
      navigate("/");
      toast.info("Redirecting to home page.");
    }
  }, [selected, tokenlocal, navigate, dispatch, <Navbar />]);

  const handleSidebarItemClick = (index) => {
    setSelected(index);
    toast.info(`You selected ${getSidebarData()[index].heading}`);
  };

  const handleSubmitLogOut = (e) => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    toast.success("Logged out successfully.");
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
        {/* 
        {userRole === "CENTER" && (
          <div className="logo">
            <img
              src="https://img.pikbest.com/origin/10/14/70/27tpIkbEsThjY.jpg!sw800"
              alt="logo"
              style={{
                width: "150px",
                height: "120px",
                borderRadius: "50%",
                border: "1px solid #000",
              }}
            />
          </div>
        )}
        {userRole === "ADMIN" && (
          <div className="logo">
            <img
              src="https://thumbs.dreamstime.com/b/red-admin-sign-pc-laptop-vector-illustration-administrator-icon-screen-controller-man-system-box-88756468.jpg"
              alt="logo"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "70%",
                border: "1px solid #000",
              }}
            />
          </div>
        )}
        {userRole === "CUSTOMERCARE" && (
          <div className="logo">
            <img
              src="{profile?.Logo}"
              alt="logo"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "70%",
                border: "1px solid #000",
              }}
            />
          </div>
        )} */}
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
          <div className="menuItem" onClick={handleSubmitLogOut}>
            <UilSignOutAlt />
            <span>Đăng Xuất</span>
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
