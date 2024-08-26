import React, { useState, useEffect } from "react";
import { IconButton, Badge, Modal, Box, Typography, Avatar, Button, List, ListItem, ListItemText, TextField, Select, MenuItem } from "@mui/material";
import { FaBell, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import AccountApi from "./Axios/AccountApi";

const Navbar = () => {
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [editableProfile, setEditableProfile] = useState({});
  const { profile } = useSelector((state) => state.account);
  const tokenlocal = localStorage.getItem("localtoken");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditableProfile({ ...profile });
    }
  }, [profile]);

  const fetchNotifications = async () => {
    try {
      const response = await AccountApi.getNotificationByAccountId({ token: tokenlocal, id: profile.AccountId });
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
      // Add your API call to save the profile changes here
      console.log('Saving profile:', editableProfile);
      closeProfileModal();
    } catch (error) {
      console.error("Error saving profile", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      const response = await AccountApi.updateNotificationById({ token: tokenlocal, id: notification.notificationId });
      setNotifications(response.data);
      setReload(!reload);
    } catch (error) {
      console.error("Error updating notification", error);
    }
  };

  const unreadCount = Array.isArray(notifications) ? notifications.filter(notification => !notification?.isRead)?.length : 0;

  useEffect(() => {
    fetchNotifications();
  }, [reload, unreadCount, notifications]);

  return (
    <div className="navbar">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#000000', color: '#ffffff' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Add additional links or items here */}
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
                {showNotifications && notifications.length ? (
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
          <IconButton color="inherit" onClick={handleProfileClick}>
            <FaUser size={24} />
          </IconButton>
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
            }}
          >
            <Typography id="profile-modal-title" variant="h6" component="h2">
              Hồ Sơ Người Dùng
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={editableProfile.Logo || "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"}
                alt={editableProfile.Name || "Avatar"}
                sx={{ width: 120, height: 120, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">Role: {editableProfile.Role || "Role"}</Typography>
                <TextField
                  label="Email"
                  value={editableProfile.Email || ""}
                  onChange={(e) => handleProfileChange('Email', e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Phone"
                  value={editableProfile.Phone || ""}
                  onChange={(e) => handleProfileChange('Phone', e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <Select
                  value={editableProfile.Gender || ""}
                  onChange={(e) => handleProfileChange('Gender', e.target.value)}
                  fullWidth
                  displayEmpty
                  margin="dense"
                >
                  <MenuItem value="">Gender</MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                <TextField
                  label="Address"
                  value={editableProfile.Address || ""}
                  onChange={(e) => handleProfileChange('Address', e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="City"
                  value={editableProfile.City || ""}
                  onChange={(e) => handleProfileChange('City', e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="District"
                  value={editableProfile.District || ""}
                  onChange={(e) => handleProfileChange('District', e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Country"
                  value={editableProfile.Country || ""}
                  onChange={(e) => handleProfileChange('Country', e.target.value)}
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Rating"
                  type="number"
                  value={editableProfile.Rating || 0}
                  onChange={(e) => handleProfileChange('Rating', e.target.value)}
                  fullWidth
                  margin="dense"
                />
              </Box>
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
    </div>
  );
};

export default Navbar;
