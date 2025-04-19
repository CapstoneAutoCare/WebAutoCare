import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Link,
  Container,
  Typography,
  CssBaseline,
  Box,
  InputAdornment,
  IconButton,
  Grid,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { loginAsync } from "../../redux/authSlice";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
    },
  },
});

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(1, "Password should be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await dispatch(loginAsync(values));
        const tokenlocal = localStorage.getItem("localtoken");
        if (tokenlocal != null) {
          console.log("Login successful! Token:", login);
          navigate("/dashboard");
        } else {
          setErrors({ email: login.message, password: login.message });
          console.log(login.message);
        }
      } catch (error) {
        console.error("Login error:", error.response?.data?.Messages);
        setErrors({ email: error.response?.data?.Messages });
        alert(error.response?.data?.Exceptions);
      }
      setSubmitting(false);
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        {/* Left side - Animated Image */}
        <Box
          sx={{
            flex: 7,
            display: { xs: "none", md: "flex" },
            position: "relative",
            background: "linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src="https://i.gifer.com/7QeH.gif"
            alt="Car Maintenance"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.9,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              AutoCare Pro
            </Typography>
            <Typography
              variant="h6"
              sx={{
                maxWidth: "600px",
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              Chăm sóc xe của bạn một cách chuyên nghiệp với hệ thống quản lý bảo dưỡng thông minh
            </Typography>
          </Box>
        </Box>

        {/* Right side - Login Form */}
        <Box
          sx={{
            flex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: { xs: "2rem", md: "4rem" },
            background: "linear-gradient(135deg,rgb(20, 88, 189) 0%,rgb(212, 39, 39) 100%)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              width: "200%",
              height: "200%",
              top: "-50%",
              left: "-50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
              animation: "rotate 20s linear infinite",
              "@keyframes rotate": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            },
          }}
        >
          <Box
            component="form"
            sx={{
              width: "100%",
              maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              position: "relative",
              zIndex: 1,
              background: "rgba(255, 255, 255, 0.9)",
              padding: { xs: "2rem", md: "3rem" },
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
              },
            }}
            onSubmit={formik.handleSubmit}
          >
            <Box 
              sx={{ 
                textAlign: "center", 
                mb: 2,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "50px",
                  height: "3px",
                  background: "linear-gradient(90deg, #1976d2, #21cbf3)",
                  borderRadius: "3px",
                }
              }}
            >
              <LockOutlinedIcon 
                sx={{ 
                  fontSize: 50, 
                  color: "primary.main",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.1)" },
                    "100%": { transform: "scale(1)" },
                  }
                }} 
              />
            </Box>

            <Typography
              variant="h4"
              component="h2"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                textAlign: "center",
                mb: 2,
                background: "linear-gradient(45deg, #1976d2, #21cbf3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Welcome Manager
            </Typography>

            <TextField
              label="Email"
              variant="outlined"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              fullWidth
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderWidth: "2px",
                    },
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              fullWidth
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderWidth: "2px",
                    },
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{
                        color: "primary.main",
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.1)",
                        },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box
              display="flex"
              justifyContent="space-between"
              sx={{ mt: 1 }}
            >
              <Link 
                href="#" 
                variant="body2" 
                color="primary" 
                sx={{ 
                  textDecoration: "none",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "0",
                    height: "2px",
                    bottom: "-2px",
                    left: "0",
                    backgroundColor: "primary.main",
                    transition: "width 0.3s ease",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                Forgot Password?
              </Link>
              <Link 
                href="/register" 
                variant="body2" 
                color="primary" 
                sx={{ 
                  textDecoration: "none",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "0",
                    height: "2px",
                    bottom: "-2px",
                    left: "0",
                    backgroundColor: "primary.main",
                    transition: "width 0.3s ease",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: "10px",
                textTransform: "none",
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "linear-gradient(45deg, #1976d2 30%, #21cbf3 90%)",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
                  background: "linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Logging in..." : "Login"}
            </Button>

          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
