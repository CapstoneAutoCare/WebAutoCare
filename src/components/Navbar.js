import React, { useState, useEffect } from "react";
import { IconButton, Badge, Modal, Box, Typography, Avatar, Button, List, ListItem, ListItemText } from "@mui/material";
import { FaBell, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import AccountApi from "./Axios/AccountApi";

const Navbar = () => {
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { profile } = useSelector((state) => state.account);
  const tokenlocal = localStorage.getItem("localtoken");

  const fetchNotifications = async () => {
    try {
      const response = await AccountApi.getNotificationByAccountId({ token: tokenlocal, id: profile.AccountId });
      setNotifications(response.data);
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


  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  useEffect(() => {
    fetchNotifications();
  }, [notifications])
  return (
    <div className="navbar">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#4a47a3', color: '#ffffff' }}>
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
                color: 'black', // Ensure text color is black
              }}
            >
              <List>
                {notifications.length ? (
                  notifications.map((notification) => (
                    <ListItem
                      key={notification.notificationId}
                      sx={{
                        borderBottom: '1px solid #ddd',
                        backgroundColor: !notification.isRead ? '#f5f5f5' : 'white',
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            fontWeight={!notification.isRead ? 'bold' : 'normal'}
                            color="black" // Ensure text color is black
                          >
                            {notification.title}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ color: 'black' }} // Ensure text color is black
                          >
                            {notification.message}
                            <br />
                            <small>{new Date(notification.createdDate).toLocaleString()}</small>
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
            height: '100vh', // Full viewport height to center modal vertically
          }}
        >
          <Box
            sx={{
              width: '80%',
              maxWidth: '600px',
              padding: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 24, // Material-UI's shadow for better visibility
              position: 'relative', // For positioning the close button
            }}
          >
            <Typography id="profile-modal-title" variant="h6" component="h2">
              Hồ Sơ Người Dùng
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={profile?.Logo || "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"}
                alt={profile?.Name || "Avatar"}
                sx={{ width: 120, height: 120, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">Role: {profile?.Role || "Role"}</Typography>
                <Typography>Email: {profile?.Email || "Email"}</Typography>
                <Typography>Phone: {profile?.Phone || "Phone"}</Typography>
                <Typography>Gender: {profile?.Gender || "Gender"}</Typography>
                <Typography>Address: {profile?.Address || "Address"}</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                mt: 2,
              }}
            >
              <Button onClick={closeProfileModal} color="primary">Đóng</Button>
            </Box>
          </Box>
        </Box>
      </Modal>

    </div>
  );
};

export default Navbar;
