import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, CircularProgress, DialogContent, Grid, MenuItem, Pagination, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { formatDate } from "../../Data/Pagination";
import { makeStyle, truncateNote } from "../Booking/Booking";
import { formatNumberWithDots } from "../MaintenanceInformations/OutlinedCard";
import { TransactionListGetall } from "../../redux/transactionSlice";
import { TransactionDetailsDialog } from "../../Data/DialogAdmin";
import Navbar from "../Navbar";

const Transactions = () => {
    const dispatch = useDispatch();
    const [reload, setReload] = useState(false);
    const token = localStorage.getItem("localtoken");
    const { transactions, statustransactions, errortransactions } = useSelector(
        (state) => state.transactions
    );
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const [open, setOpen] = useState(false);

    const [pageReceived, setPageReceived] = useState(1);
    const [pageTransferred, setPageTransferred] = useState(1);

    const itemsPerPageReceived = 4;
    const itemsPerPageTransferred = 4;

    const handleClickOpen = (item) => {
        setSelectedTransaction(item);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setReload(!reload);
        setSelectedTransaction(null);
    };

    
    const handleChangePageReceived = (event, newPage) => {
        setPageReceived(newPage);
    };
    const handleChangePageTransferred = (event, newPage) => {
        setPageTransferred(newPage);
    };

   
    var transactionReceived = transactions
        .filter((item) => item?.status === "RECEIVED")
        .slice((pageReceived - 1) * itemsPerPageReceived, pageReceived * itemsPerPageReceived);

    
    var transactionTransferred = transactions
        .filter((item) => item?.status === "TRANSFERRED")
        .slice((pageTransferred - 1) * itemsPerPageTransferred, pageTransferred * itemsPerPageTransferred);

    const pageCountReceived = Math.ceil(transactions.filter(item => item?.status === "RECEIVED").length / itemsPerPageReceived);
    const pageCountTransferred = Math.ceil(transactions.filter(item => item?.status === "TRANSFERRED").length / itemsPerPageTransferred);

    useEffect(() => {
        dispatch(TransactionListGetall(token))
    }, [dispatch, reload]);

    return (
        <Box>
            <Navbar />
            {/* <Button variant="contained" color="success" >
                Thêm Loại Xe Mới
            </Button> */}
            <Box>
                <h3>Các Gói Giao Dịch Nhận Khách Hàng </h3>

                {statustransactions === "loading" && (
                    <DialogContent dividers>
                        <CircularProgress />
                    </DialogContent>
                )}
                {statustransactions === "succeeded" &&
                    transactions &&
                    transactions.length > 0 && (
                        <Grid>
                            <TableContainer
                                component={Paper}
                                style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
                            >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {/* <TableCell>Ảnh Trung Tâm </TableCell> */}
                                            <TableCell>Tên Trung Tâm</TableCell>
                                            <TableCell>Tên Hãng</TableCell>
                                            <TableCell>Tên Loại Xe</TableCell>
                                            <TableCell>Biển Số Xe</TableCell>
                                            <TableCell>Gói Bảo Dưỡng</TableCell>
                                            <TableCell>Ngày Tạo</TableCell>
                                            <TableCell>Khối Lượng Giao Dịch</TableCell>
                                            <TableCell>Phương Thức Giao Dịch</TableCell>
                                            <TableCell>Tiền Giao Dịch</TableCell>
                                            <TableCell>Trạng Thái</TableCell>
                                            <TableCell>Chi Tiết</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {transactionReceived
                                            .map((item) => (
                                                <TableRow
                                                    key={item?.transactionsId}
                                                    sx={{
                                                        "&:last-child td, &:last-child th": { border: 0 },
                                                    }}
                                                >
                                                    <TableCell>{item?.responseCenter.maintenanceCenterName}</TableCell>
                                                    <TableCell>{item?.responseVehicles.vehiclesBrandName}</TableCell>
                                                    <TableCell>{item?.responseVehicles.vehicleModelName}</TableCell>
                                                    <TableCell>{item?.responseVehicles.licensePlate}</TableCell>
                                                    <TableCell>{item?.responseMaintenancePlan.maintenancePlanName}</TableCell>
                                                    <TableCell>{formatDate(item?.transactionDate)}</TableCell>
                                                    <TableCell>{item?.volume}%</TableCell>
                                                    <TableCell>{item?.paymentMethod}</TableCell>
                                                    <TableCell style={{
                                                        fontWeight: "bold",
                                                    }}>{formatNumberWithDots(item?.amount)} VND</TableCell>
                                                    <TableCell><span
                                                        className="status"
                                                        style={{ ...makeStyle(item.status) }}
                                                    >
                                                        {item.status}
                                                    </span></TableCell>
                                                    <TableCell className="Details">
                                                        <Button
                                                            onClick={() => handleClickOpen(item)}
                                                            variant="contained"
                                                            color="success"
                                                        >
                                                            Hiển Thị
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Pagination
                                count={pageCountReceived}
                                page={pageReceived}
                                onChange={handleChangePageReceived}
                                variant="outlined"
                                shape="rounded"
                                style={{ marginTop: "20px", paddingBottom: "30px" }}
                            />
                        </Grid>
                    )}
                <TransactionDetailsDialog
                    open={open}
                    handleClose={handleClose}
                    transaction={selectedTransaction}
                />
            </Box >
            <Box>
                <h3>Các Gói Giao Dịch Chuyển Trung Tâm</h3>
                {statustransactions === "loading" && (
                    <DialogContent dividers>
                        <CircularProgress />
                    </DialogContent>
                )}
                {statustransactions === "succeeded" &&
                    transactions &&
                    transactions.length > 0 && (
                        <Grid>
                            <TableContainer
                                component={Paper}
                                style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
                            >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {/* <TableCell>Ảnh Trung Tâm </TableCell> */}
                                            <TableCell>Tên Trung Tâm</TableCell>
                                            <TableCell>Tên Hãng</TableCell>
                                            <TableCell>Tên Loại Xe</TableCell>
                                            <TableCell>Biển Số Xe</TableCell>
                                            <TableCell>Gói Bảo Dưỡng</TableCell>
                                            <TableCell>Ngày Tạo</TableCell>
                                            <TableCell>Khối Lượng Giao Dịch</TableCell>
                                            <TableCell>Phương Thức Giao Dịch</TableCell>
                                            <TableCell>Tiền Giao Dịch</TableCell>
                                            <TableCell>Trạng Thái</TableCell>
                                            <TableCell>Chi Tiết</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {transactionTransferred
                                            .map((item) => (
                                                <TableRow
                                                    key={item?.transactionsId}
                                                    sx={{
                                                        "&:last-child td, &:last-child th": { border: 0 },
                                                    }}
                                                >

                                                    <TableCell>{item?.responseCenter.maintenanceCenterName}</TableCell>
                                                    <TableCell>{item?.responseVehicles.vehiclesBrandName}</TableCell>
                                                    <TableCell>{item?.responseVehicles.vehicleModelName}</TableCell>
                                                    <TableCell>{item?.responseVehicles.licensePlate}</TableCell>
                                                    <TableCell>{item?.responseMaintenancePlan.maintenancePlanName}</TableCell>
                                                    <TableCell>{formatDate(item?.transactionDate)}</TableCell>
                                                    <TableCell>{item?.volume}%</TableCell>
                                                    <TableCell>{item?.paymentMethod}</TableCell>
                                                    <TableCell style={{
                                                        fontWeight: "bold",
                                                    }}>{formatNumberWithDots(item?.amount)} VND</TableCell>
                                                    <TableCell><span
                                                        className="status"
                                                        style={{ ...makeStyle(item.status) }}
                                                    >
                                                        {item.status}
                                                    </span></TableCell>
                                                    <TableCell className="Details">
                                                        <Button
                                                            onClick={() => handleClickOpen(item)}
                                                            variant="contained"
                                                            color="success"
                                                        >
                                                            Hiển Thị
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Pagination
                                count={pageCountTransferred}
                                page={pageTransferred}
                                onChange={handleChangePageTransferred}
                                variant="outlined"
                                shape="rounded"
                                style={{ marginTop: "20px", paddingBottom: "30px" }}
                            />
                        </Grid>
                    )}
                <TransactionDetailsDialog
                    open={open}
                    handleClose={handleClose}
                    transaction={selectedTransaction}
                />
            </Box >
        </Box>


    );
};

export default Transactions;