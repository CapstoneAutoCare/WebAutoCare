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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const defaultLocation = {
  lat: 10.7769,
  lng: 106.6951,
};
// const API_KEY = "AIzaSyAI9kPkskayYti5ttrZL_UfBlL3OkMEbvs";
const address = "43E, đường 6, khu phố 3 , Tằng Nhơn Phú B, Tp Th";

const ProfilePageV1 = () => {
  const { profile } = useSelector((t) => t.account);
  const user = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123 456 789",
    gender: "Nam",
    address: address,
    avatar:
      "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg",
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState(defaultLocation);

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
    } else {
      console.log("Thay đổi mật khẩu thành công!");
    }
  };
  useEffect(() => {
    // const fetchCoordinates = async () => {
    //   try {
    //     const response = await axios.get(
    //       `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    //         address
    //       )}&key=${API_KEY}`
    //     );
    //     const { results } = response.data;
    //     if (results.length > 0) {
    //       const { geometry } = results[0];
    //       setLocation({
    //         lat: geometry.location.lat,
    //         lng: geometry.location.lng,
    //       });
    //     } else {
    //       console.error("Không tìm thấy địa chỉ.");
    //     }
    //     console.log("googlemap ", response);
    //   } catch (error) {
    //     console.error("Lỗi khi lấy tọa độ:", error);
    //   }
    // };
    // fetchCoordinates();
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
                alt={profile?.Logo}
                src={profile?.Logo}
                sx={{ width: 120, height: 120, margin: "0 auto" }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h5">{profile?.Role}</Typography>
              <Typography variant="body1">Email: {profile?.Email}</Typography>
              <Typography variant="body1">
                Điện thoại: {profile?.Phone}
              </Typography>
              <Typography variant="body1">
                Giới tính: {profile?.Gender}
              </Typography>
              <Typography variant="body1">
                Địa chỉ: {profile?.Address}
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                Chỉnh Sửa
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

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

      {/* Thêm Google Map */}
      {/* <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Địa điểm của bạn
        </Typography>
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerStyle={{ height: "400px", width: "100%" }}
            center={defaultLocation}
            zoom={12}
          >
            <Marker position={defaultLocation} />
          </GoogleMap>
        </LoadScript>
      </Box> */}
    </Box>
  );
};

export default ProfilePageV1;
