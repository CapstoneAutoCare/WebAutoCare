import {
    Box,
    Button,
    CircularProgress,
    DialogContent,
    Grid,
    MenuItem,
    Pagination,
    Paper,
    Rating,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatNumberWithDots } from "../MaintenanceInformations/OutlinedCard";
import { formatDate } from "../../Data/Pagination";
import { AddScheduleDialog } from "../../Data/DialogAdmin";
import { makeStyle } from "../Booking/Booking";
import { ScheduleListGetall } from "../../redux/scheduleSlice";
const statusOptions = ["ACTIVE", "INACTIVE"];

const Plan = () => {
    const dispatch = useDispatch();
    const [reload, setReload] = useState(false);
    const token = localStorage.getItem("localtoken");
    const [open, setOpen] = useState(false);
    const { plans, statusplans, errorplans } = useSelector(
        (state) => state.plans
    );
    const [page, setPage] = useState(1);
    const itemsPerPage = 7;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleStatusChange = async (maintenanceCenterId, newStatus) => {
        try {
            //   await dispatch(
            //     PatchStatusBookingByCenter({ maintenanceCenterId, status: newStatus, token })
            //   );
            //   dispatch(BookingByCenter({ token: token, id: maintenanceCenterId }));
            setReload(true);
        } catch (error) {
            // console.error("Error updating status:", errors);
        }
    };
    const [filterStatus, setFilterStatus] = useState("");
    const [filterBrand, setFilterBrand] = useState("");
    const [filterVehicleModel, setFilterVehicleModel] = useState("");
    const { brands, statusvehiclemodels, errorbrands } = useSelector(
        (state) => state.brands
    );
    const { vehiclemodels, statusbrands, errorvehiclemodels } = useSelector(
        (state) => state.vehiclemodels
    );


    const filteredVehicleModels = vehiclemodels.filter(
        (model) => model.vehiclesBrandId === filterBrand
    );


    const filterListPlan = plans.filter((plan) => {
        const statusMatch = filterStatus ? plan?.status === filterStatus : true;
        const fitBrand = filterBrand
            ? plan?.reponseVehicleModels.vehiclesBrandId === filterBrand
            : true;
        const fitVehicle = filterVehicleModel
            ? plan?.reponseVehicleModels.vehicleModelId === filterVehicleModel
            : true;
        return statusMatch && fitBrand && fitVehicle;
    });
    const pageCount = Math.ceil(filterListPlan?.length / itemsPerPage);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setReload(!reload);
    };
    useEffect(() => {
        dispatch(ScheduleListGetall(token));
    }, [dispatch, token, reload]);

    return (
        <Box>
            <h3>Danh Sách Các Gói Odo Bảo Dưỡng</h3>
            {/* <Button variant="contained" color="success" onClick={handleClickOpen}>
                Thêm Hãng Mới Cho Xe
            </Button>
            <AddScheduleDialog
                open={open}
                handleClose={handleClose}
                token={token}
                setReload={setReload}
            /> */}
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Select
                    value={filterStatus}
                    onChange={(event) => setFilterStatus(event.target.value)}
                    displayEmpty
                >
                    <MenuItem value="">
                        <em>Trạng Thái</em>
                    </MenuItem>
                    {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </Select>

                <Select
                    value={filterBrand}
                    onChange={(event) => {
                        setFilterBrand(event.target.value);
                        setFilterVehicleModel("");
                    }}
                    displayEmpty
                >
                    <MenuItem value="">
                        <em>Hãng Xe</em>
                    </MenuItem>
                    {brands.map((brand) => (
                        <MenuItem key={brand.vehiclesBrandId} value={brand.vehiclesBrandId}>
                            {brand.vehiclesBrandName}
                        </MenuItem>
                    ))}
                </Select>
                <Select
                    value={filterVehicleModel}
                    onChange={(event) => {
                        setFilterVehicleModel(event.target.value);
                    }}
                    displayEmpty
                    disabled={!filterBrand}
                >
                    <MenuItem value="">
                        <em>Loại Xe</em>
                    </MenuItem>
                    {filteredVehicleModels.map((model) => (
                        <MenuItem key={model.vehicleModelId} value={model.vehicleModelId}>
                            {model.vehicleModelName}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            {statusplans === "loading" && (
                <DialogContent dividers>
                    <CircularProgress />
                </DialogContent>
            )}
            {statusplans === "succeeded" &&
                filterListPlan &&
                plans.length > 0 && (
                    <Grid>
                        <TableContainer
                            component={Paper}
                            style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mã Bảo Dưỡng Cấp Bậc</TableCell>
                                        <TableCell>Tên Cấp Bậc</TableCell>
                                        <TableCell>Mô Tả</TableCell>
                                        <TableCell>Hãng Xe</TableCell>
                                        <TableCell>Loại Xe</TableCell>
                                        <TableCell>Ngày Tạo</TableCell>
                                        <TableCell>Trạng Thái</TableCell>
                                        <TableCell>Chi Tiết</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filterListPlan
                                        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                                        .map((item) => (
                                            <TableRow
                                                key={item?.maintenancePlanId}
                                                sx={{
                                                    "&:last-child td, &:last-child th": { border: 0 },
                                                }}
                                            >
                                                <TableCell>{item?.maintenancePlanId}</TableCell>
                                                <TableCell
                                                >
                                                    {item?.maintenancePlanName}
                                                </TableCell>
                                                <TableCell>{item?.description}</TableCell>
                                                <TableCell>{item?.reponseVehicleModels?.vehiclesBrandName}</TableCell>
                                                <TableCell>{item?.reponseVehicleModels?.vehicleModelName}</TableCell>
                                                <TableCell>{formatDate(item?.dateTime)}</TableCell>
                                                <TableCell>
                                                    {/* <Select
                              value={item.status}
                              onChange={(event) => {
                                const newStatus = event.target.value;
                                handleStatusChange(
                                  item.vehicleModelId,
                                  newStatus
                                );
                              }}
                              style={{
                                ...makeStyle(item.status),
                                borderRadius: "10px",
                                width: "125px",
                                fontSize: "10px",
                                height: "50px",
                              }}
                            >
                              {statusOptions.map((status) => (
                                <MenuItem key={status} value={status}>
                                  {status}
                                </MenuItem>
                              ))}
                            </Select> */}
                                                    <span
                                                        className="status"
                                                        style={{ ...makeStyle(item.status) }}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </TableCell>
                                                {/* <TableCell className="Details">
                            <Button
                              // onClick={() => handleClickOpen(item)}
                              variant="contained"
                              color="success"
                            >
                              Hiển Thị
                            </Button>
                          </TableCell> */}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Pagination
                            count={pageCount}
                            page={page}
                            onChange={handleChangePage}
                            variant="outlined"
                            shape="rounded"
                            style={{ marginTop: "20px", paddingBottom: "30px" }}
                        />
                    </Grid>
                )}
        </Box>
    );
};

export default Plan;
