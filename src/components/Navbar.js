import React, { useState, useEffect } from "react";
import { IconButton, Badge, Modal, Box, Typography, Avatar, Button, List, ListItem, ListItemText, TextField, Select, MenuItem, Tabs, Tab } from "@mui/material";
import { FaBell, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import AccountApi from "./Axios/AccountApi";
import axios from "axios";
import axiosApi from "./Axios/AxiosApi";
import Transactions from "./PageAdmin/Transactions";
import TransactionsCenter from "./MaintenanceInformations/TransactionsCenter";
import { MainDash } from "./MainDash/MainDash";
import VehicleList from "./Vehicle/Vehicle";

const Navbar = () => {
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [editableProfile, setEditableProfile] = useState({});
  const { profile } = useSelector((state) => state.account);
  const tokenlocal = localStorage.getItem("localtoken");
  const [reload, setReload] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [modal, setModal] = useState(false)

  const handleClose = () => setModal(false);

  // Chuyển đổi tab
  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const handleModalClick = () => {
    setModal(true);
    setSelectedTab(0); 
  };


  const fetchNotifications = async () => {
    try {
      const response = await axiosApi.get(`/Notifications/GetListByAccount?id=${profile?.AccountId}`, {
        headers: {
          'Authorization': `Bearer ${tokenlocal}`
        }
      });
      const notifications = Array.isArray(response.data) ? response.data : [];
      setNotifications(notifications);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const handleBellClick = () => {
    fetchNotifications();
    setShowNotifications(!showNotifications);
  };

  const handleProfileClick = () => {
    setEditableProfile({
      ...profile,
      firstName: profile?.FirstName || "",
      lastName: profile?.LastName || "",
      birthday: profile.Birthday ? new Date(profile?.Birthday).toISOString().split('T')[0] : "",
      gender: profile?.Gender || "",
      phone: profile?.Phone || "",
      logo: profile?.Logo || "",
      address: profile?.Address || "",
      email: profile.Email || "",
      role: profile.Role || "",
    });
    setProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
  };

  const handleProfileChange = (field, value) => {
    setEditableProfile((prevProfile) => ({
      ...prevProfile,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const adjustedBirthday = editableProfile?.birthday
        ? new Date(new Date(editableProfile?.birthday).getTime() + 7 * 60 * 60 * 1000).toISOString()
        : null;
      const response = await axiosApi.put(
        `/CustomerCares/Update?customercareId=${profile.CustomerCareId}`,
        {
          gender: editableProfile?.gender,
          phone: editableProfile?.phone,
          logo: editableProfile?.logo,
          firstName: editableProfile?.firstName,
          lastName: editableProfile?.lastName,
          address: editableProfile?.address,
          birthday: adjustedBirthday,
        },
        {
          headers: {
            'accept': 'text/plain',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenlocal}`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Profile updated successfully');

      } else {
        console.error('Failed to update profile');
      }

      closeProfileModal();
      setReload(!reload);

    } catch (error) {
      console.error("Error saving profile", error);
      alert(error.response.data.Exception);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      const response = await axiosApi.patch(
        `/Notifications/UpdateRead?id=${notification.notificationId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${tokenlocal}`,
            'accept': 'text/plain'
          }
        }
      );
      if (response.status === 200) {
        setReload(!reload);
      }
    } catch (error) {
      console.error("Error updating notification", error);
    }
  };

  const unreadCount = notifications?.filter(notification => !notification?.isRead).length;

  useEffect(() => {
    fetchNotifications();
  }, [reload, notifications, unreadCount]);

  return (
    <div className="navbar">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#ffffff', color: '#00000' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" onClick={handleBellClick}>
            <Badge badgeContent={unreadCount} color="error">
              <FaBell size={24} />
            </Badge>
          </IconButton>
          {showNotifications && (
            <Box
              sx={{
                position: 'absolute', top: '60px', right: 0, width: '300px', maxHeight: '400px',
                overflowY: 'auto', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', zIndex: 1000,
                color: 'black',
              }}
            >
              <List>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <ListItem
                      key={notification?.notificationId}
                      sx={{
                        borderBottom: '1px solid #ddd',
                        backgroundColor: !notification?.isRead ? '#e3f2fd' : 'white',
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                        '&:hover': {
                          backgroundColor: '#bbdefb',
                        },
                      }}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            fontWeight={!notification?.isRead ? 'bold' : 'normal'}
                            color="black"
                          >
                            {notification?.title}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ color: 'black' }}
                          >
                            {notification?.message}
                            <br />
                            <small>{new Date(notification?.createdDate).toLocaleString()}</small>
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>No notifications</ListItem>
                )}
              </List>
            </Box>
          )}
          {profile?.Role === "CUSTOMERCARE" && (
            <IconButton color="inherit" onClick={handleProfileClick}>
              <FaUser size={24} />
            </IconButton>
          )}
          {profile?.Role === "CENTER" && (
            <IconButton color="inherit" onClick={handleModalClick}>
              <FaUser size={24} />
            </IconButton>
          )}

        </Box>
      </Box>

      <Modal
        open={isProfileModalOpen}
        onClose={closeProfileModal}
        aria-labelledby="profile-modal-title"
        aria-describedby="profile-modal-description"
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Box
            sx={{
              width: '80%',
              maxWidth: '600px',
              padding: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 24,
              position: 'relative',
              overflowY: 'auto',
              maxHeight: '90vh',
            }}
          >
            <Typography id="profile-modal-title" variant="h6" component="h2">
              Hồ Sơ Người Dùng
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Avatar
                src={editableProfile?.logo || "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"}
                alt={editableProfile?.firstName || "Avatar"}
                sx={{ width: 120, height: 120, alignSelf: 'center' }}
              />
              <Typography variant="h6" align="center">Role: {editableProfile?.role || "Role"}</Typography>
              <TextField
                label="Email"
                value={editableProfile?.email || ""}
                fullWidth
                margin="dense"
                disabled
              />
              <TextField
                label="Phone"
                value={editableProfile?.phone || ""}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                fullWidth
                margin="dense"
              />
              <Select
                value={editableProfile?.gender || ""}
                onChange={(e) => handleProfileChange('gender', e.target.value)}
                fullWidth
                displayEmpty
                margin="dense"
              >
                <MenuItem value="">Giới Tính</MenuItem>
                <MenuItem value="Nam">Nam</MenuItem>
                <MenuItem value="Nữ">Nữ</MenuItem>
              </Select>
              <TextField
                label="First Name"
                value={editableProfile?.firstName || ""}
                onChange={(e) => handleProfileChange('firstName', e.target.value)}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Last Name"
                value={editableProfile?.lastName || ""}
                onChange={(e) => handleProfileChange('lastName', e.target.value)}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Birthday"
                type="date"
                value={editableProfile?.birthday || ""}
                onChange={(e) => handleProfileChange('birthday', e.target.value)}
                fullWidth
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Address"
                value={editableProfile?.address || ""}
                onChange={(e) => handleProfileChange('address', e.target.value)}
                fullWidth
                margin="dense"
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 2,
              }}
            >
              <Button onClick={closeProfileModal} color="secondary">Đóng</Button>
              <Button onClick={handleSaveProfile} color="primary" variant="contained">Lưu</Button>
            </Box>
          </Box>
        </Box>
      </Modal>


      <Modal open={modal} onClose={handleClose}>
            <Box
                sx={{
                    width: '80%',
                    height: '80%',
                    bgcolor: 'white',
                    display: 'flex',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: 24,
                    overflow: 'hidden' // Prevent outer overflow
                }}
            >
                <Box
                    sx={{
                        minWidth: '150px',
                        borderRight: '1px solid #ddd',
                        height: '100%', // Set height to 100%
                        overflowY: 'auto', // Enable vertical scrolling
                        paddingRight: '20px'
                    }}
                >
                    <Tabs
                        value={selectedTab}
                        onChange={handleChangeTab}
                        orientation="vertical"
                    >
                        <Tab label="Thống Kê" />
                        <Tab label="Thông tin cá nhân" />
                        <Tab label="Giao dịch" />
                        <Tab label="Xe Mua Gói" />
                    </Tabs>
                </Box>

                <Box sx={{ flexGrow: 1, paddingLeft: '20px', overflowY: 'auto' }}>
                    {selectedTab === 0 && (
                        <Box>
                            <MainDash />
                        </Box>
                    )}
                    {selectedTab === 1 && (
                        <Box>
                            {/* Content for personal information */}
                        </Box>
                    )}
                    {selectedTab === 2 && (
                        <Box>
                            <TransactionsCenter />
                        </Box>
                    )}
                    {selectedTab === 3 && (
                        <Box>
                            <VehicleList />
                        </Box>
                    )}
                </Box>
            </Box>
        </Modal>

    </div>
  );
};

export default Navbar;