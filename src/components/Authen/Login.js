import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography"; // Import Typography
import { useDispatch } from "react-redux";
import { loginAsync } from "../../redux/authSlice";

const theme = createTheme({
  palette: {
    primary: {
      main: "#45f3ff",
    },
    secondary: {
      main: "#8f8f8f",
    },
  },
});

export default function Login() {
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const login = await dispatch(loginAsync(formData));
      if (login != null) {
        console.log("Login successful! Token:", login);
        navigate("/dashboard");
      } else {
        setError(login.message);
        console.log(login.message);
      }
    } catch (error) {
      console.error("Login error:", error.response.data.Messages);
      setError(error.response.data.Messages);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="xs"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#6495ED",
        }}
      >
        <div
          className="box"
          style={{
            position: "relative",
            width: "380px",
            height: "420px",
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
              background: "#f7f7f7",
              zIndex: 10,
              padding: "50px 40px",
              display: "flex",
              flexDirection: "column",
            }}
            onSubmit={handleSubmit}
          >
            <h2
              style={{
                color: "#030304",
                fontWeight: 500,
                textAlign: "center",
                letterSpacing: "0.1em",
              }}
            >
              Sign in
            </h2>
            <TextField
              label="email"
              variant="outlined"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{ marginTop: "35px" }}
              fullWidth
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={{ marginTop: "20px" }}
              fullWidth
              required
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Link href="#" variant="body2" color="secondary">
                Forgot Password
              </Link>
              <Link href="/register" variant="body2" color="secondary">
                Sign Up
              </Link>
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
            >
              Login
            </Button>
            {error && (
              <Typography
                variant="body"
                color="error"
                style={{ marginBottom: "10px" }}
              >
                {error}
              </Typography>
            )}
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
}
