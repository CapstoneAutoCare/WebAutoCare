import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { PostCenter } from "../../redux/centerSlice";
import { useNavigate } from "react-router-dom";
import axiosApi from "../Axios/AxiosApi";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";

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

const steps = ["Thông tin đăng nhập", "Thông tin trung tâm"];

export default function Register() {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    gender: "null",
    phone: "",
    maintenanceCenterName: "",
    maintenanceCenterDescription: "",
    address: "",
    district: "",
    city: "",
    country: "VN",
    logo: "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg",
  });
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "The Email field is not a valid e-mail address.";
    }

    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{0,10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be up to 10 digits";
    }
    if (!formData.maintenanceCenterName)
      newErrors.maintenanceCenterName = "Maintenance Center Name is required";
    if (!formData.maintenanceCenterDescription)
      newErrors.maintenanceCenterDescription =
        "Maintenance Center Description is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.country) newErrors.country = "Country is required";
    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === "city") {
      const selectedProvince = provinces.find(
        (province) => province?.ProvinceName === value
      );
      if (selectedProvince) {
        console.log(`Selected Province ID: ${selectedProvince?.ProvinceID}`);
        fetchDistricts(selectedProvince?.ProvinceID);
      }
    }
  };
  const fetchDistricts = async (provinceId) => {
    try {
      console.log("Fetching districts for province ID:", provinceId);
      const response = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Token": "eb08b899-649c-11ef-ab1c-267b3de2ff84"
          }
        }
      );
      const districtsData = response.data.data;
      setDistricts(districtsData);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (step === 1) {
      const validationErrors = validateStep1();
      if (Object.keys(validationErrors).length === 0) {
        setStep(2);
        setErrors({});
      } else {
        setErrors(validationErrors);
      }
    } else if (step === 2) {
      const validationErrors = validateStep2();
      if (Object.keys(validationErrors).length === 0) {
        console.log(formData);
        dispatch(PostCenter(formData)).then((result) => {
          if (PostCenter.fulfilled.match(result)) {
            navigate("/");
          } else {
            const errorMessages = result.payload || {};
            setErrors({
              ...errors,
              ...errorMessages
            });
            console.error(result.payload);
          }
        });
      } else {
        setErrors(validationErrors);
      }
    }
  };
  const [districts, setDistricts] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  const handleCityChange = async (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    setFormData({ ...formData, city, district: "" }); // Reset district when city changes
    
    // Find the selected province
    const selectedProvince = provinces.find(p => p.ProvinceName === city);
    if (selectedProvince) {
      try {
        const response = await axios.get(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${selectedProvince.ProvinceID}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Token': 'eb08b899-649c-11ef-ab1c-267b3de2ff84'
            }
          }
        );
        setDistricts(response.data.data);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
          {
            headers: {
              'Content-Type': 'application/json',
              'Token': 'eb08b899-649c-11ef-ab1c-267b3de2ff84',
            },
          }
        );
        setProvinces(response?.data?.data);
        console.log('Fetched provinces:', response?.data?.data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
    fetchDistricts();
  }, []);
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

        {/* Right side - Register Form */}
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
            onSubmit={handleSubmit}
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
          >
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <PersonOutlineIcon
                sx={{
                  fontSize: 50,
                  color: "primary.main",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.1)" },
                    "100%": { transform: "scale(1)" },
                  },
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
              Đăng Ký Trung Tâm
            </Typography>

            <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {step === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Mật Khẩu"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Xác Nhận Mật Khẩu"
                    variant="outlined"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                  />
                </Grid>
              </Grid>
            )}

            {step === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.gender}>
                    <InputLabel>Giới tính</InputLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      label="Giới tính"
                      startAdornment={
                        <InputAdornment position="start">
                          <PersonOutlineIcon color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="null">Chọn giới tính</MenuItem>
                      <MenuItem value="male">Nam</MenuItem>
                      <MenuItem value="female">Nữ</MenuItem>
                      <MenuItem value="other">Khác</MenuItem>
                    </Select>
                    {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Số điện thoại"
                    variant="outlined"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Tên trung tâm"
                    variant="outlined"
                    name="maintenanceCenterName"
                    value={formData.maintenanceCenterName}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.maintenanceCenterName}
                    helperText={errors.maintenanceCenterName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Mô tả trung tâm"
                    variant="outlined"
                    name="maintenanceCenterDescription"
                    value={formData.maintenanceCenterDescription}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.maintenanceCenterDescription}
                    helperText={errors.maintenanceCenterDescription}
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Địa chỉ"
                    variant="outlined"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.city}>
                    <InputLabel>Tỉnh/Thành phố</InputLabel>
                    <Select
                      name="city"
                      value={formData.city}
                      onChange={handleCityChange}
                      label="Tỉnh/Thành phố"
                    >
                      <MenuItem value="">Chọn tỉnh/thành phố</MenuItem>
                      {provinces.map((province) => (
                        <MenuItem key={province.ProvinceID} value={province.ProvinceName}>
                          {province.ProvinceName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.city && <FormHelperText>{errors.city}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.district} disabled={!selectedCity}>
                    <InputLabel>Quận/Huyện</InputLabel>
                    <Select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      label="Quận/Huyện"
                    >
                      <MenuItem value="">Chọn quận/huyện</MenuItem>
                      {districts.map((district) => (
                        <MenuItem key={district.DistrictID} value={district.DistrictName}>
                          {district.DistrictName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.district && <FormHelperText>{errors.district}</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
                gap: 2,
              }}
            >
              {step === 2 && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleBack}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                  }}
                >
                  Quay lại
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  flex: 1,
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
              >
                {step === 1 ? "Tiếp theo" : "Đăng ký"}
              </Button>
            </Box>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Link
                href="/"
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
                Đã có tài khoản? Đăng nhập
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
