import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { UilSignOutAlt, UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { VehiclesMaintenancesByCenter } from "../redux/vehiclemainSlice";
import { SidebarDataAdmin, SidebarDataCenter, SidebarDataCustomerCare } from "../Data/Data";
import Navbar from "./Navbar";
import { CustomerCareByCenterId } from "../redux/customercareSlice";
import { PlanListGetall } from "../redux/planSlice";
import Plan from "./PageAdmin/Plan";
import Transactions from "./PageAdmin/Transactions";

const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sidebarVariants = {
    true: { width: "280px" },
    false: { width: "80px" },
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
      <Transactions />,
      <Plan />,
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
    dispatch(PlanListGetall(tokenlocal));

    localStorage.setItem("AccountId", code.sub);
    localStorage.setItem("ROLE", role);
    CheckRole(tokenlocal, role);
    setUserRole(role);

    if (role === "CENTER" || role === "CUSTOMERCARE") {
      const centerId = localStorage.getItem("CenterId");
      dispatch(VehiclesMaintenancesByCenter(centerId));
      dispatch(CustomerCareByCenterId({ centerId, tokne: tokenlocal }));

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

  const handleSidebarToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div
        className="bars"
        onClick={handleSidebarToggle}
        style={{
          position: "fixed",
          top: "20px",
          left: expanded ? "300px" : "100px",
          zIndex: 1001,
          background: "#ffffff",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "left 0.3s ease",
        }}
      >
        <UilBars />
      </div>

      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        animate={expanded ? "true" : "false"}
        style={{
          height: "100vh",
          position: "fixed",
          overflowY: "auto",
          zIndex: 1000,
          background: "#ffffff",
          borderRight: "1px solid #e0e0e0",
          transition: "width 0.3s ease",
        }}
      >
        {userRole === "CENTER" && (
          <div className="logo" style={{ padding: expanded ? "1.5rem" : "1rem" }}>
            <img
              src={SidebarDataCenter[0].logo}
              alt="logo"
              style={{
                width: expanded ? "120px" : "60px",
                height: expanded ? "120px" : "60px",
                borderRadius: "50%",
                border: "1px solid #e0e0e0",
                transition: "all 0.3s ease",
                objectFit: "cover",
                backgroundColor: "#f5f6fa",
                padding: "10px"
              }}
            />
          </div>
        )}
        {userRole === "ADMIN" && (
          <div className="logo" style={{ padding: expanded ? "1.5rem" : "1rem" }}>
            <img
              src={SidebarDataAdmin[0].logo}
              alt="logo"
              style={{
                width: expanded ? "120px" : "60px",
                height: expanded ? "120px" : "60px",
                borderRadius: "50%",
                border: "1px solid #e0e0e0",
                transition: "all 0.3s ease",
                objectFit: "cover",
                backgroundColor: "#f5f6fa",
                padding: "10px"
              }}
            />
          </div>
        )}
        {userRole === "CUSTOMERCARE" && (
          <div className="logo" style={{ padding: expanded ? "1.5rem" : "1rem" }}>
            <img
              src={SidebarDataCustomerCare[0].logo}
              alt="logo"
              style={{
                width: expanded ? "120px" : "60px",
                height: expanded ? "120px" : "60px",
                borderRadius: "50%",
                border: "1px solid #e0e0e0",
                transition: "all 0.3s ease",
                objectFit: "cover",
                backgroundColor: "#f5f6fa",
                padding: "10px"
              }}
            />
          </div>
        )}
        <div className="menu">
          {getSidebarData().map((item, index) => (
            <div
              className={selected === index ? "menuItem active" : "menuItem"}
              key={index}
              onClick={() => handleSidebarItemClick(index)}
              style={{
                padding: expanded ? "0.8rem 1rem" : "0.8rem 0.5rem",
                justifyContent: expanded ? "flex-start" : "center",
              }}
            >
              <item.icon />
              {expanded && <span>{item.heading}</span>}
            </div>
          ))}
          <div 
            className="menuItem" 
            onClick={handleSubmitLogOut}
            style={{
              padding: expanded ? "0.8rem 1rem" : "0.8rem 0.5rem",
              justifyContent: expanded ? "flex-start" : "center",
            }}
          >
            <UilSignOutAlt />
            {expanded && <span>Đăng Xuất</span>}
          </div>
        </div>
      </motion.div>

      <div
        className="main-content"
        style={{
          marginLeft: expanded ? "280px" : "80px",
          padding: "20px",
          overflowY: "auto",
          height: "100vh",
          transition: "margin-left 0.3s ease",
        }}
      >
        {sidebarComponents[userRole] ? (
          sidebarComponents[userRole][selected]
        ) : (
          <MainDash />
        )}
      </div>
    </>
  );
};

export default Sidebar;
