import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrandGetAllList, PackageGetAllList } from "../../redux/brandSlice";
import { Box, Button, CircularProgress, DialogContent, Grid, MenuItem, Pagination, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { AddBrandVehicleDialog, AddPackageDialog } from "../../Data/DialogAdmin";
import { formatDate } from "../../Data/Pagination";
import { makeStyle, truncateNote } from "../Booking/Booking";
import axiosApi from "../Axios/AxiosApi";
import { formatNumberWithDots } from "../MaintenanceInformations/OutlinedCard";

const Package = () => {
    const dispatch = useDispatch();
    const [reload, setReload] = useState(false);
    const token = localStorage.getItem("localtoken");
    const { packages, errorpackages, statuspackages } = useSelector(
        (state) => state.brands
    );
    const [open, setOpen] = useState(false);

    const [page, setPage] = useState(1);
    const itemsPerPage = 4;
    const pageCount = Math.ceil(packages.length / itemsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setReload(!reload);
    };


    useEffect(() => {
        dispatch(PackageGetAllList(token))
    }, [dispatch, reload]);

    return (
        <Box>
            <h3>Đanh Sách Các Gói Đăng Ký </h3>
            <Button variant="contained" color="success" onClick={handleClickOpen}>
                Thêm Gói Đăng Ký
            </Button>
            <AddPackageDialog
                open={open}
                handleClose={handleClose}
                token={token}
                setReload={setReload}
            />

            {statuspackages === "loading" && (
                <DialogContent dividers>
                    <CircularProgress />
                </DialogContent>
            )}
            {statuspackages === "succeeded" && packages.length > 0 && (
                <Grid>
                    <TableContainer
                        component={Paper}
                        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Gói</TableCell>
                                    <TableCell>Số Lượng Phụ Tùng</TableCell>
                                    <TableCell>Số Lượng Dịch Vụ</TableCell>
                                    <TableCell>Mô Tả</TableCell>
                                    <TableCell>Ngày Tạo</TableCell>
                                    <TableCell>Giá Hàng Tháng</TableCell>
                                    <TableCell>Thời Gian Tháng</TableCell>
                                    {/* <TableCell>Chi Tiết</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {packages
                                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                                    .map((item) => (
                                        <TableRow
                                            key={item?.packageId}
                                            sx={{
                                                "&:last-child td, &:last-child th": { border: 0 },
                                            }}
                                        >
                                            <TableCell>{item?.name}</TableCell>
                                            <TableCell>{item?.quantitySparepartAllowUsed}</TableCell>
                                            <TableCell>{item?.quantityMaintenanceServiceAllowUsed}</TableCell>
                                            <TableCell> <Tooltip title={item?.description} arrow>
                                                <span>
                                                    {truncateNote(item?.description)}
                                                </span>
                                            </Tooltip></TableCell>

                                            <TableCell>{formatDate(item?.dateTime)}</TableCell>
                                            <TableCell>{formatNumberWithDots(item?.monthlyPrice)} VND</TableCell>
                                            <TableCell>{item?.durationMonths}</TableCell>
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

export default Package;