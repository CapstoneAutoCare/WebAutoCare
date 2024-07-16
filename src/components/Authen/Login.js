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
      }
      setSubmitting(false);
    },
  });

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
            onSubmit={formik.handleSubmit}
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
              label="Email"
              variant="outlined"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              style={{ marginTop: "35px" }}
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
              disabled={formik.isSubmitting}
            >
              Login
            </Button>
            {formik.errors.email && (
              <Typography
                variant="body2"
                color="error"
                style={{ marginTop: "10px" }}
              >
                {formik.errors.email}
              </Typography>
            )}
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
}
