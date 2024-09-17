import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, CircularProgress, DialogContent, Grid, MenuItem, Pagination, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { AddBrandVehicleDialog, AddPackageDialog } from "../../Data/DialogAdmin";
import { formatDate } from "../../Data/Pagination";
import { makeStyle, truncateNote } from "../Booking/Booking";
import axiosApi from "../Axios/AxiosApi";
import { formatNumberWithDots } from "../MaintenanceInformations/OutlinedCard";

const Transactions = () => {
    const dispatch = useDispatch();
    const [reload, setReload] = useState(false);
    const token = localStorage.getItem("localtoken");

    const [open, setOpen] = useState(false);

    const [page, setPage] = useState(1);
    const itemsPerPage = 4;

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
        // dispatch(PackageGetAllList(token))
    }, [dispatch, reload]);

    return (
        <Box>
            <h3>Các Gói Giao Dịch</h3>
            <Button variant="contained" color="success" onClick={handleClickOpen}>
                Thêm Gói Đăng Ký
            </Button>

        </Box>
    );
};

export default Transactions;