import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthenApi from "../../components/Axios/AuthenApi";
import {
  Typography,
  Grid,
  createTheme,
  ThemeProvider,
  TextField,
  TitleTextField,
  Button
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1c72e2",
    },
    secondary: {
      main: "#8f8f8f",
    },
  },
});

const currencies = [
  { value: "Thủ Đức", label: "Thủ Đức" },
  { value: "Quận 2", label: "Quận 2" },
  { value: "Quận 3", label: "Quận 3" },
  { value: "Quận 4", label: "Quận 4" },
  { value: "Quận 5", label: "Quận 5" },
  { value: "Quận 6", label: "Quận 6" },
  { value: "Quận 7", label: "Quận 7" },
  { value: "Quận 8", label: "Quận 8" },
  { value: "Quận 9", label: "Quận 9" },
  { value: "Quận 10", label: "Quận 10" },
  { value: "Quận 11", label: "Quận 11" },
  { value: "Quận 12", label: "Quận 12" },
  { value: "Tân Bình", label: "Tân Bình" },
  { value: "Gò Vấp", label: "Gò Vấp" },
];

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      SWP391 {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function AddLand() {
  const [error, setError] = useState(); // Initialize with null
  const [formData, setFormData] = useState({
    landName: "",
    description: "",
    location: "",
    address: ""
  });
  const navigateWithDelay = (path, delay) => {
    setTimeout(() => {
      navigate(path);
    }, delay);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const navigate = useNavigate();
  const [success, setSussess] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await AuthenApi.Register(formData);
      if (response.status === 200) {
        console.log("Thêm sân bóng thành công!");
        setSussess("Thêm sân bóng thành công!");
        navigateWithDelay("/signin", 3000);
      } else {
        setError(response.message);
        console.log(response.message);
      }
    } catch (error) {
      console.error("Error:", error.response.data.Messages);
      setError(error.response.data.Messages);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* <Grid
        item
        container
        xs={12}
        sx={{
          padding: "0px 20px 0 50px",
          width: 1000,
          height: 1000,
          backgroundColor: "white",
          height: "100vh",
        }}
      > */}
        <div
          className="box"
          style={{
            position: "relative",
            width: "1000px",
            height: "732px",
            backgroundColor: "#fefefe",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {/* Add animations here if desired */}
          <form
            style={{
              position: "absolute",
              inset: "2px",
              borderRadius: "8px",
              background: "#fefefe",
              zIndex: 10,
              padding: "60px 60px",
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={handleSubmit}
          >
            <Grid item xs={12}>
              <Typography fontSize={"30px"} fontWeight={"bold"} color={"black"}>
                Thêm sân bóng
              </Typography>
            </Grid>
            <Grid
              item
              container
              justifyContent={"space-between"}
              xs={12}
              mt={"40px"}
            >
              <Typography fontSize={"22px"} fontWeight={"bold"} color={"black"}>
                Tên sân bóng
              </Typography>
              <TextField
                variant="outlined"
                type="text"
                name="nameLand"
                value={formData.username}
                onChange={handleInputChange}
                style={{ marginTop: "10px" }}
                fullWidth
                required
              />
            </Grid>
            <Grid
              item
              container
              justifyContent={"space-between"}
              xs={12}
              mt={"20px"}
            >
              <Typography fontSize={"22px"} fontWeight={"bold"} color={"black"}>
                Giới thiệu về sân bóng
              </Typography>
              <TextField
                variant="outlined"
                type="text"
                name="description"
                value={formData.username}
                onChange={handleInputChange}
                style={{ marginTop: "10x" }}
                fullWidth
                required
              />
            </Grid>
            <Grid
              item
              container
              justifyContent={"space-between"}
              xs={12}
              mt={"20px"}
            >
              <Grid item xs={12} mb={"8px"}>
              <Typography fontSize={"22px"} fontWeight={"bold"} color={"black"}>
                Địa điểm
              </Typography>
              </Grid>
              <TextField
                id="outlined-select-currency-native"
                select
                defaultValue="EUR"
                SelectProps={{
                  native: true,
                }}
                helperText="Hãy chọn Quận"
              >
                {currencies.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              container
              justifyContent={"space-between"}
              xs={12}
              mt={"20px"}
            >
              <Typography fontSize={"22px"} fontWeight={"bold"} color={"black"}>
                Địa chỉ cụ thể
              </Typography>
              <TextField
                variant="outlined"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                style={{ marginTop: "10px" }}
                fullWidth
                required
              />
            </Grid>

            {success && (
              <Typography
                variant="body"
                color="red" // Change to your success color
                style={{
                  marginBottom: "10px",
                  textAlign: "center", // Align the text to the center
                }}
              >
                {success}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
            >
              Thêm sân bóng
            </Button>
            {error && (
              <Typography
                variant="body"
                color="red"
                style={{
                  marginTop: "10px",
                  textAlign: "center",
                }}
              >
                {error}
              </Typography>
            )}
          </form>
        </div>
      {/* </Grid> */}
    </ThemeProvider>
  );
}
