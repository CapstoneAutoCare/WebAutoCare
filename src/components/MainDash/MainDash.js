import React, { useEffect, useState } from "react";
import Cards from "../Cards/Cards";
import Table from "../Table/Table";
import "./MainDash.css";
import { Box, Grid, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import AnalyticEcommerce from "./AnalyticEcommerce";
import { useDispatch, useSelector } from "react-redux";
import {
  CenterTotalGetListByMainInfor,
  CenterTotalGetListByStatusAndStatusCostService,
  CenterTotalGetListByStatusAndStatusCostSparePart,
  CenterTotalGetListByStatusPaidReceipt,
} from "../../redux/centerSlice";
import BookingApi from "../Axios/BookingApi";
import MaintenanceInformationsApi from "../Axios/MaintenanceInformationsApi";
import { CombinedBarChart, CombinedChartv1, MonthlyBarChart, RevenueBarChart } from "./MonthlyBarChart";
import PieChartComponent from "./PieChartComponent";

export const MainDash = () => {
  const dispatch = useDispatch();
  const [previousYearMonths, setPreviousYearMonths] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const centerId = localStorage.getItem("CenterId");

  const { sparepartItems, serviceItems, maininforss, payments, statuscenter, errorcenter } = useSelector(
    (state) => state.centers
  );

  const fetchMonthlyData = async ({ centerId, token, year }) => {
    try {
      const response = await BookingApi.getBookingsByMonthInYearByCenterId({ token, id: centerId, year })
      const responsedata = await MaintenanceInformationsApi.getListGetMonthlyRevenueByCenterId({ token, centerId, year })
      console.log("Fetched Monthly Data:", response.data);
      console.log("Fetched Revenue Data:", responsedata.data);
      setPreviousYearMonths(response.data || []);
      setRevenueData(responsedata.data || []);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("localtoken");
    fetchMonthlyData({ centerId, token, year: selectedYear });
    dispatch(CenterTotalGetListByMainInfor({ token, id: centerId }));
    dispatch(CenterTotalGetListByStatusAndStatusCostService({ token, id: centerId }));
    dispatch(CenterTotalGetListByStatusAndStatusCostSparePart({ token, id: centerId }));
    dispatch(CenterTotalGetListByStatusPaidReceipt({ token, id: centerId }));
  }, [dispatch, selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <Box >
      <Typography variant="h4" gutterBottom>
        Doanh Số Theo Năm
      </Typography>
      <FormControl variant="outlined" fullWidth sx={{ mb: 2 }}>
        <InputLabel>Năm</InputLabel>
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          label="Year"
        >
          {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce
            title="Total Price Spare Parts"
            price={sparepartItems.price}
            count={sparepartItems.count}
            extra="35,000"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce
            title="Total Price Services"
            price={serviceItems.price}
            count={serviceItems.count}
            extra="8,900"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce
            title="Total Price Bookings"
            price={maininforss.price}
            count={maininforss.count}
            isLoss
            color="warning"
            extra="$20,395"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <AnalyticEcommerce
            title="Total Price Payments"
            price={payments.price}
            count={payments.count}
            isLoss
            color="warning"
            extra="$20,395"
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
         
        }}
      >
        <MonthlyBarChart
          monthlyData={previousYearMonths}
          // revenueData={revenueData}
          currentYear={selectedYear}
        />
        <RevenueBarChart
          // monthlyData={previousYearMonths}
          revenueData={revenueData}
          currentYear={selectedYear}
        />
      </Box>


    </Box >
  );
};