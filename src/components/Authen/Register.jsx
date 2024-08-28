import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Link, Grid, FormControl, InputLabel, MenuItem, FormHelperText, Select } from "@mui/material";
import { useDispatch } from "react-redux";
import { PostCenter } from "../../redux/centerSlice";
import { useNavigate } from "react-router-dom";
import axiosApi from "../Axios/AxiosApi";
import axios from "axios";

export default function Register() {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);

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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        position: "relative",
        backgroundImage: "url(your-background-image-url)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: "relative",
          borderRadius: "8px",
          background: "#ffffff",
          padding: "50px 40px",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "800px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          zIndex: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            color: "#030304",
            fontWeight: 500,
            textAlign: "center",
            letterSpacing: "0.1em",
            mb: 4,
          }}
        >
          Register
        </Typography>

        {step === 1 && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  variant="outlined"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Mật Khẩu"
                  variant="outlined"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Xác Nhận Mật Khẩu"
                  variant="outlined"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 4 }}
            >
              Next
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tên Trung Tâm"
                  variant="outlined"
                  name="maintenanceCenterName"
                  value={formData.maintenanceCenterName}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.maintenanceCenterName}
                  helperText={errors.maintenanceCenterName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Số Điện Thoại"
                  variant="outlined"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={4}>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Mô Tả Trung Tâm"
                  variant="outlined"
                  name="maintenanceCenterDescription"
                  value={formData.maintenanceCenterDescription}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.maintenanceCenterDescription}
                  helperText={errors.maintenanceCenterDescription}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth variant="outlined" margin="normal" error={!!errors.city}>
                  <InputLabel>Thành Phố</InputLabel>
                  <Select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    label="Thành Phố"
                  >
                    {provinces.map((province) => (
                      <MenuItem key={province.ProvinceID} value={province.ProvinceName}>
                        {province.ProvinceName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.city && <FormHelperText>{errors.city}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth variant="outlined" margin="normal" error={!!errors.district}>
                  <InputLabel>Quận/Huyện</InputLabel>
                  <Select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    label="Quận/Huyện"
                    disabled={!formData.city}
                  >
                    {districts.map((district) => (
                      <MenuItem key={district.DistrictID} value={district.DistrictName}>
                        {district.DistrictName}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.district && <FormHelperText>{errors.district}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Địa Chỉ"
                  variant="outlined"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>
            </Grid>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Register
              </Button>
            </Box>
          </>
        )}

        <Box display="flex" justifyContent="center" mt={2}>
          <Link href="/" variant="body2" color="secondary">
            Already have an account? Sign In
          </Link>
        </Box>
      </Box>
    </Box >
  );
}
