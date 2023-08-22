import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthenApi from "../../components/Axios/AuthenApi";
import {
  Typography,
  Grid,
  createTheme,
  ThemeProvider,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  TimePicker
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

export default function AddLand() {
  const [error, setError] = useState(); // Initialize with null
  const [formData, setFormData] = useState({
    landName: "",
    description: "",
    location: "",
    address: "",
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
              Thêm sân nhỏ
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
              Loại sân
            </Typography>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Sân 5"
            />
            <TextField
              id="outlined-number"
              label="Số lượng"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Sân 7"
            />
            <TextField
              id="outlined-number"
              label="Số lượng"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography fontSize={"30px"} fontWeight={"bold"} color={"black"}>
              Thêm sân nhỏ
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
              Thời gian bắt đầu
            </Typography>
            <TimePicker
            //   value={value}
            //   onChange={(newValue) => setValue(newValue)}
            />
          </Grid>
          <Grid
            item
            container
            justifyContent={"space-between"}
            xs={12}
            mt={"40px"}
          >
            <Typography fontSize={"22px"} fontWeight={"bold"} color={"black"}>
              Thời gian kết thúc
            </Typography>
            <TimePicker
            //   value={value}
            //   onChange={(newValue) => setValue(newValue)}
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
            Thêm sân nhỏ
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
