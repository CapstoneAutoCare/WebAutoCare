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
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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

const validationSchema = Yup.object({
  email: Yup.string()
    // .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(0, "Password should be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login } = useSelector((state) => state.auth);
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
        console.error("Login error:", error.response.data.Messages);
        setErrors({ email: error.response.data.Messages });
        alert(error.response.data.Exceptions);
      }
      setSubmitting(false);
    },
  });

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        position: 'relative',
        backgroundImage: 'url()', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          zIndex: 1,
        }}
      />
      <Box
        component="form"
        sx={{
          position: 'relative',
          borderRadius: '8px',
          background: '#ffffff',
          padding: '50px 40px',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 2,
        }}
        onSubmit={formik.handleSubmit}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            color: '#030304',
            fontWeight: 500,
            textAlign: 'center',
            letterSpacing: '0.1em',
            mb: 4,
          }}
        >
          Login AutoCare
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
          sx={{ mb: 2 }}
          fullWidth
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{ mb: 2 }}
          fullWidth
          required
        />
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Link href="#" variant="body2" color="secondary">
            Forgot Password
          </Link>
          <Link href="/register" variant="body2" color="secondary">
            Sign Up
          </Link>
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          disabled={formik.isSubmitting}
        >
          Login
        </Button>
        {formik.errors.email && (
          <Typography
            variant="body2"
            color="error"
            sx={{ mt: 1 }}
          >
            {formik.errors.email}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
