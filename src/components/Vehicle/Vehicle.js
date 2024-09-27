import { Box, Button, Chip, CircularProgress, Dialog, DialogContent, Grid, Stack, Typography } from "@mui/material";
import { formatNumberWithDots } from "../MaintenanceInformations/OutlinedCard";
import MainCard from "../MainDash/MainCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VehicleGetListByCenterWhenBuyPackage } from "../../redux/vehicleSlice";
import { PlanListByCenterAndVehicle } from "../../redux/planSlice";

const VehicleCard = ({ vehicle }) => {
    const {
        vehiclesBrandName,
        vehicleModelName,
        color,
        licensePlate,
        odo,
        createdDate,
        status,
    } = vehicle;

    const [openView, setOpenView] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [reload, setReload] = useState(false);
    const token = localStorage.getItem("localtoken");
    const centerId = localStorage.getItem("CenterId");
    const dispatch = useDispatch();

    const { plans, statusplans, errorplans } = useSelector(
        (state) => state.plans
    );

    const handleViewClose = () => {
        setReload(!reload);
        setSelectedItem(null);
        setOpenView(false);
    };
    const handleClickShow = (item) => {
        setSelectedItem(item);
        console.log("Selected Item: ", item);
        dispatch(PlanListByCenterAndVehicle({ token, id: centerId, vehicleId: item.vehiclesId }));
        setOpenView(true);
    };
    //   useEffect(() => {
    //     dispatch(VehicleGetListByCenterWhenBuyPackage({ token, centerId }));
    // }, [token, centerId, reload]);
    return (
        <>
            <MainCard contentSX={{ p: 2.25 }}>
                <Stack spacing={0.5}>
                    <Typography variant="h6" color="text.secondary">
                        {vehiclesBrandName} {vehicleModelName}
                    </Typography>
                    <Grid container alignItems="center">
                        <Grid item>
                            <Typography variant="h4" color="inherit">
                                {licensePlate}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Chip
                                label={`${status}`}
                                color={status === "ACTIVE" ? "primary" : "secondary"}
                                sx={{ ml: 1.25, pl: 1 }}
                                size="small"
                            />
                        </Grid>
                    </Grid>
                    <Typography variant="body2" color="text.secondary">
                        Color: {color}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Odometer: {odo.toLocaleString()} km
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Created: {new Date(createdDate).toLocaleDateString()}
                    </Typography>
                    <Button variant="contained" color="success" onClick={() => handleClickShow(vehicle)}>Hiện Thị Gói</Button>
                </Stack>
            </MainCard>
            <Dialog open={openView} onClose={handleViewClose} maxWidth="md" fullWidth>
                <DialogContent>
                    {statusplans === "loading" && (
                        <DialogContent dividers>
                            <CircularProgress />
                        </DialogContent>
                    )}
                    {statusplans === "succeeded" &&
                        plans &&
                        plans.length > 0 && (
                            <Box>
                                <Typography variant="h5" color="primary">
                                    Maintenance Plans
                                </Typography>
                                {/* <Grid container spacing={2} sx={{ pr: 2, paddingTop: 5 }}> */}
                                {plans.length > 0 ? (
                                    plans.map(plan => (
                                        // <Grid item xs={12} sm={6} md={4} key={vehicle.maintenancePlanId}>
                                        <MainCard contentSX={{ p: 2.25, pr: 2, }} sx={{ mb: 2 }}>
                                            <Stack spacing={0.5}>
                                                <Typography variant="h6" color="text.secondary">
                                                    {plan?.maintenancePlanName}
                                                </Typography>
                                            </Stack>
                                        </MainCard>
                                        // </Grid>
                                    ))
                                ) : (
                                    <Typography>No maintenance plans available.</Typography>
                                )}
                                {/* </Grid> */}
                            </Box>
                        )}
                </DialogContent>
            </Dialog >
        </>
    );
}

export default function VehicleList() {
    const dispatch = useDispatch();
    const [reload, setReload] = useState(false);
    const token = localStorage.getItem("localtoken");
    const centerId = localStorage.getItem("CenterId");

    const { vehicles, statusvehicles, errorvehicles } = useSelector(
        (state) => state.vehicles
    );

    useEffect(() => {
        dispatch(VehicleGetListByCenterWhenBuyPackage({ token, centerId }));
    }, [token, centerId, reload])
    return (
        <Box>
            {statusvehicles === "loading" && (
                <DialogContent dividers>
                    <CircularProgress />
                </DialogContent>
            )}

            {statusvehicles === "succeeded" && (

                <DialogContent dividers>
                    <h3>Danh Sách Thông Tin Xe Mua Gói</h3>
                    {/* <Button variant="contained" color="success" >
                        Thêm Thông Tin Bảo Trì Sửa Chữa
                    </Button> */}
                    <Grid container spacing={2} sx={{ pr: 2, paddingTop: 5 }}>
                        {vehicles?.map((vehicle) => (
                            <Grid item xs={12} sm={6} md={4} key={vehicle.vehiclesId}>
                                <VehicleCard vehicle={vehicle} />
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>

            )}

        </Box>

    );
}



