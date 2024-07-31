import React, { useEffect } from "react";
import Cards from "../Cards/Cards";
import Table from "../Table/Table";
import "./MainDash.css";
import { Box, Grid, Typography } from "@mui/material";
import AnalyticEcommerce from "./AnalyticEcommerce";
import { useDispatch, useSelector } from "react-redux";
import {
  CenterTotalGetListByMainInfor,
  CenterTotalGetListByStatusAndStatusCostService,
  CenterTotalGetListByStatusAndStatusCostSparePart,
  CenterTotalGetListByStatusPaidReceipt,
} from "../../redux/centerSlice";

export const MainDash = () => {
  const dispatch = useDispatch();
  const { sparepartItems, serviceItems, maininforss,payments,statuscenter,errorcenter } = useSelector(
    (state) => state.centers
  );
  useEffect(() => {
    const centerId = localStorage.getItem("CenterId");
    const token = localStorage.getItem("localtoken");

    dispatch(CenterTotalGetListByMainInfor({ token, id: centerId }));
    dispatch(
      CenterTotalGetListByStatusAndStatusCostService({ token, id: centerId })
    );
    dispatch(
      CenterTotalGetListByStatusAndStatusCostSparePart({ token, id: centerId })
    );
    dispatch(CenterTotalGetListByStatusPaidReceipt({ token, id: centerId }));
  }, [dispatch ]);

  return (
    <Box>
      <h1>Dashboard</h1>
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
    </Box>
  );
};
