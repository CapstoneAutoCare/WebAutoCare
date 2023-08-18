import React from "react";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import GeneralInfoForm from "../Updates/GeneralInfoForm";
import ProfileCardWidget from "../Updates/ProfileCardWidget";
import ChoosePhotoWidget from "../Updates/ChoosePhotoWidget";

const ProfilePage = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding="16px"
      height="100%"
    >
      <Grid container spacing={2}>
        {/* GeneralInfoForm */}
        <Grid item xs={12} sm={8}>
          <GeneralInfoForm />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Grid container spacing={2}>
            {/* ProfileCardWidget */}
            <Grid item xs={12}>
              <ProfileCardWidget />
            </Grid>

            {/* ChoosePhotoWidget */}
            <Grid item xs={12}>
              <ChoosePhotoWidget title="Select profile photo" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
