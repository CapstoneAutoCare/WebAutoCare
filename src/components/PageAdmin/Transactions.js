import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, CircularProgress, DialogContent, Grid, MenuItem, Pagination, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { formatDate } from "../../Data/Pagination";
import { makeStyle, truncateNote } from "../Booking/Booking";
import { formatNumberWithDots } from "../MaintenanceInformations/OutlinedCard";
import { TransactionListGetall } from "../../redux/transactionSlice";
import { TransactionDetailsDialog } from "../../Data/DialogAdmin";

const Transactions = () => {
    const dispatch = useDispatch();
    const [reload, setReload] = useState(false);
    const token = localStorage.getItem("localtoken");
    const { transactions, statustransactions, errortransactions } = useSelector(
        (state) => state.transactions
    );
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const [open, setOpen] = useState(false);

    const [page, setPage] = useState(1);
    const itemsPerPage = 8;
    const pageCount = Math.ceil(transactions.length / itemsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleClickOpen = (item) => {
        setSelectedTransaction(item);
        setOpen(true);

    };
    const handleClose = () => {
        setOpen(false);
        setReload(!reload);
        setSelectedTransaction(null);
    };


    useEffect(() => {
        dispatch(TransactionListGetall(token))
    }, [dispatch, reload]);

    return (
        <Box>
            <h3>Các Gói Giao Dịch</h3>
            <Button variant="contained" color="success" >
                Chuyển Tiền
            </Button>
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
                                    {transactions
                                        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                                        .map((item) => (
                                            <TableRow
                                                key={item?.transactionsId}
                                                sx={{
                                                    "&:last-child td, &:last-child th": { border: 0 },
                                                }}
                                            >

                                                {/* <TableCell>{item.responseCenter.logo ? (
                                                    <img
                                                        src={item.responseCenter.logo}
                                                        alt="Item Logo"
                                                        style={{ width: "100px", height: "100px" }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="no-image-placeholder"
                                                        style={{ width: "80px", height: "80px" }}
                                                    >
                                                        No Image Available
                                                    </div>
                                                )}</TableCell> */}

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
                                                {/* <TableCell>{formatDate(item?.transactionDate)}</TableCell> */}

                                                {/* <TableCell>
                          <span
                            className="status"
                            style={{ ...makeStyle(item.status) }}
                          >
                            {item.status}
                          </span>
                        </TableCell> */}
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
                            count={pageCount}
                            page={page}
                            onChange={handleChangePage}
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
    );
};

export default Transactions;