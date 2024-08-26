import { Autocomplete, Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, InputLabel, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material"
import { makeStyle } from "../Booking/Booking";
import { formatDate } from "../../Data/Pagination";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VehiclesMaintenancesByCenter, VehiclesMaintenancesPost } from "../../redux/vehiclemainSlice";
import { useFormik } from "formik";
import { AddMaintenanceServicListPost, MaintenanceServicesByCenterId } from "../../redux/mainserviceSlice";
import { GetServiceCaresNotInMaintenanceServices } from "../../redux/servicesSlice";
import { BrandVehiclesMaintenancesDifByCenter } from "../../redux/brandSlice";

export const DetailCenter = ({
    open,
    handleClose,
    token,
    item,
    setReload,

}) => {
    const { vehiclemains, statusvehiclemains, errorvehiclemains } = useSelector(
        (state) => state.vehiclemains
    );
    const [openAdd, setOpenAdd] = useState(false);
    const [reloading, setreloading] = useState(false);

    const dispatch = useDispatch();
    const handleAddClickOpen = () => {
        setOpenAdd(true);
    };

    const handleAddClose = () => {
        setOpenAdd(false);
        setReload(p => !p);
        setreloading(!reloading);
    };
    useEffect(() => {
        // dispatch(ScheduleListGetall(token));
        dispatch(VehiclesMaintenancesByCenter(item?.maintenanceCenterId));

    }, [dispatch, token, setReload, item, reloading]);
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                style: {
                    width: "65%",
                    maxWidth: "65%",
                    height: "65%",
                    maxHeight: "auto",
                },
            }}
        >
            {statusvehiclemains === "loading" && (
                <DialogContent dividers>
                    <CircularProgress />
                </DialogContent>
            )}
            {statusvehiclemains === "succeeded" && (<Box>

                <DialogTitle style={{ textAlign: "center", fontWeight: "bolder" }}>
                    Thông Tin Trung Tâm
                </DialogTitle>
                <div >
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleAddClickOpen}
                    >
                        Đăng Kí Hãng Xe
                    </Button>
                    <AddVehicleMaintenanceDialog
                        open={openAdd}
                        handleAddClose={handleAddClose}
                        centerId={item?.maintenanceCenterId}
                        token={token}
                        setReload={setReload}
                    />

                </div>
                {vehiclemains?.length > 0 && (
                    <Box>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ảnh</TableCell>
                                    <TableCell>Tên Hãng</TableCell>
                                    <TableCell>Ngày Tạo</TableCell>
                                    <TableCell>Mô Tả</TableCell>
                                    <TableCell>Trạng Thái</TableCell>
                                    {/* <TableCell>Chi Tiết</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vehiclemains
                                    .map((item) => (
                                        <TableRow
                                            key={item?.responseBrand?.vehiclesBrandId}
                                            sx={{
                                                "&:last-child td, &:last-child th": { border: 0 },
                                            }}
                                        >
                                            <TableCell>
                                                {item?.responseBrand?.logo ? (
                                                    <img
                                                        src={item?.responseBrand?.logo}
                                                        alt="Item Logo"
                                                        className="item-logo"
                                                        style={{ width: "80px", height: "80px" }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="no-image-placeholder"
                                                        style={{ width: "80px", height: "80px" }}
                                                    >
                                                        No Image Available
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>{item?.responseBrand?.vehiclesBrandName}</TableCell>
                                            <TableCell>{formatDate(item?.responseBrand?.createdDate)}</TableCell>
                                            <TableCell>{item?.responseBrand?.vehiclesBrandDescription}</TableCell>
                                            <TableCell>
                                                <span
                                                    className="status"
                                                    style={{
                                                        ...makeStyle(item?.responseBrand.status),
                                                        fontSize: "12px",
                                                        height: "50px",
                                                    }}
                                                >
                                                    {item?.responseBrand?.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <DialogActions>
                            <Button onClick={handleClose}>Trả Về</Button>
                        </DialogActions>
                    </Box>
                )}
            </Box>
            )}

        </Dialog>

    )
}
export const AddVehicleMaintenanceDialog = ({
    open,
    handleAddClose,
    centerId,
    token,
    setReload,
}) => {
    const dispatch = useDispatch();
    const { brands } = useSelector(
        (state) => state.brands
    );
    const [vehiclesBrandIds, setServiceselects] = useState([]);
    const [reloading, setreloading] = useState(false)

    // const filteredOptionsService = brands
    //     ? brands.filter(
    //         (model) =>
    //             model.maintananceScheduleId === schedulePackage.maintananceScheduleId
    //     )
    //     : [];
    const formik = useFormik({
        initialValues: {
            vehiclesBrandIds: [],
        },
        onSubmit: async (values, { resetForm }) => {
            const data = {
                vehiclesBrandIds: values.vehiclesBrandIds,
                maintenanceCenterId: centerId,
            };
            await dispatch(VehiclesMaintenancesPost({ token, data }))
                .then(() => {
                    resetForm();
                    handleAddClose();
                    setReload((p) => !p);
                })
                .catch((error) => {
                    console.error("Failed to add item:", error);
                });
            setReload((p) => !p);
            resetForm();
            setreloading(!reloading);

        },
    });
    const handleServiceChange = (event, option) => {
        if (event.target.checked) {
            setServiceselects([...vehiclesBrandIds, option.vehiclesBrandId]);
        } else {
            setServiceselects(
                vehiclesBrandIds.filter((id) => id !== option.vehiclesBrandId)
            );
        }
        formik.setFieldValue("vehiclesBrandIds", [
            ...vehiclesBrandIds,
            option.vehiclesBrandId,
        ]);
    };
    useEffect(() => {
        if (open) {
            setServiceselects([]);
            dispatch(GetServiceCaresNotInMaintenanceServices({ token, centerId }));
            dispatch(BrandVehiclesMaintenancesDifByCenter(centerId));

        }
    }, [dispatch, token, centerId, open, setReload, reloading]);
    return (
        <Dialog open={open} onClose={handleAddClose} maxWidth="md" fullWidth>
            <DialogTitle>                        Đăng Kí Hãng Xe
            </DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>

                    {brands && (
                        <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel shrink htmlFor="vehiclesBrandIds">
                                Chọn Danh Sách Hãng
                            </InputLabel>
                            <FormGroup>
                                {brands.map((option) => (
                                    <FormControlLabel
                                        key={option.vehiclesBrandId}
                                        control={
                                            <Checkbox
                                                checked={vehiclesBrandIds?.includes(
                                                    option?.vehiclesBrandId
                                                )}
                                                onChange={(event) => handleServiceChange(event, option)}
                                            />
                                        }
                                        label={`${option?.vehiclesBrandName} - (Mã: ${option?.vehiclesBrandId})`}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                    )}

                    <DialogActions>
                        <Button onClick={handleAddClose}>Trả Về</Button>
                        <Button type="submit">Thêm</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};