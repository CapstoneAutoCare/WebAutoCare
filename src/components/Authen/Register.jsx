import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Link, Grid } from '@mui/material';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    gender: '',
    phone: '',
    logo: '',
    maintenanceCenterName: '',
    maintenanceCenterDescription: '',
    address: '',
    district: '',
    city: '',
    country: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, ...rest } = formData;

    try {
      const response = await axios.post('https://autocareversion2.tryasp.net/api/MaintenanceCenters/Post', {
        ...rest,
        password // Include password in the request
      });
      console.log(response.data);
      // Handle success
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#e0f7fa"
    >
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

        {/* First Horizontal Section */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Gender"
              variant="outlined"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              variant="outlined"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>

        {/* Second Horizontal Section */}
        <Grid container spacing={2} mt={4}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Logo URL"
              variant="outlined"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Maintenance Center Name"
              variant="outlined"
              name="maintenanceCenterName"
              value={formData.maintenanceCenterName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Maintenance Center Description"
              variant="outlined"
              name="maintenanceCenterDescription"
              value={formData.maintenanceCenterDescription}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address"
              variant="outlined"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="District"
              variant="outlined"
              name="district"
              value={formData.district}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              variant="outlined"
              name="city"
              value={formData.city}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Country"
              variant="outlined"
              name="country"
              value={formData.country}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
        >
          Register
        </Button>
        <Box display="flex" justifyContent="center" mt={2}>
          <Link href="/" variant="body2" color="secondary">
            Already have an account? Sign In
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
