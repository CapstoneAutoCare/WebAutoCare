import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios"; // Already imported
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosApi from "../Axios/AxiosApi";

const defaultLocation = {
  lat: 10.7769,
  lng: 106.6951,
};
const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; 
const address = "43E, đường 6, khu phố 3 , Tằng Nhơn Phú B, Tp Th";

const ProfilePageV1 = () => {
  const { profile } = useSelector((state) => state.account);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState(defaultLocation);
  const tokenlocal = localStorage.getItem("localtoken");
  const role = localStorage.getItem("ROLE");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      const response = await axiosApi.patch(
        '/Accounts/ChangePassword',
        {
          oldPassword: currentPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenlocal}`
          }
        }
      );

      if (response.status === 200) {
        alert("Thay đổi mật khẩu thành công!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

    } catch (error) {
      console.error("Lỗi khi thay đổi mật khẩu:", error);
      alert(error.response.data.Exception);
    }
  };

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${API_KEY}`
        );
        const { results } = response.data;
        if (results.length > 0) {
          const { geometry } = results[0];
          setLocation({
            lat: geometry.location.lat,
            lng: geometry.location.lng,
          });
        } else {
          console.error("Không tìm thấy địa chỉ.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy tọa độ:", error);
      }
    };
    fetchCoordinates();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Hồ Sơ Người Dùng
      </Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Avatar
                alt={profile?.Logo || "Avatar"}
                src={profile?.Logo || "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"}
                sx={{ width: 120, height: 120, margin: "0 auto" }}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <Typography variant="h5">{profile?.Role || "Chưa có thông tin"}</Typography>
              <Typography variant="body1">Email: {profile?.Email || "Chưa có thông tin"}</Typography>
              <Typography variant="body1">Điện thoại: {profile?.Phone || "Chưa có thông tin"}</Typography>
              {profile?.Role === "CUSTOMERCARE" && <Typography variant="body1">Giới tính: {profile?.Gender || "Chưa có thông tin"}</Typography>}

              <Typography variant="body1">Địa chỉ: {profile?.Address || address}</Typography>
              {/* <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Chỉnh Sửa
              </Button> */}
            </Grid>
          </Grid>
        </CardContent>
      </Card>


      {role !== "ADMIN" && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Thay Đổi Mật Khẩu
          </Typography>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Mật khẩu hiện tại"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Mật khẩu mới"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Xác nhận mật khẩu mới"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 2 }}
                onClick={handleChangePassword}
              >
                Thay Đổi Mật Khẩu
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}


      {/* <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Địa điểm của bạn
        </Typography>
        <LoadScript googleMapsApiKey={API_KEY}>
          <GoogleMap
            mapContainerStyle={{ height: "400px", width: "100%" }}
            center={location}
            zoom={12}
          >
            <Marker position={location} />
          </GoogleMap>
        </LoadScript>
      </Box> */}
    </Box>
  );
};

export default ProfilePageV1;
