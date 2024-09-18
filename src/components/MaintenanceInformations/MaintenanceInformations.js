import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  CircularProgress,
  DialogContent,
  Grid,
  MenuItem,
  Pagination,
  Paper,
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
import { MaintenanceInformationsByCenterId } from "../../redux/maintenanceInformationsSlice";
import { AddMaintenanceDialog, MaintenanceInformationsDetailDialog } from "../../Data/DialogComponent";
import { makeStyle, truncateNote } from "../Booking/Booking";
import { formatDate } from "../../Data/Pagination";
import { ClearPaymentData } from "../../redux/paymentSlice";
import { formatNumberWithDots } from "./OutlinedCard";
const statusOptions = [
  "CREATEDBYClIENT",
  "WAITINGBYCAR",
  "CHECKIN",
  "REPAIRING",
  "PAYMENT",
  "YETPAID",
  "PAID",
  "CANCELLED"
];

const statusTranslations = {
  "CREATEDBYClIENT": "Tạo bởi khách hàng",
  "WAITINGBYCAR": "Chờ xe",
  "CHECKIN": "Nhận xe",
  "REPAIRING": "Đang sửa chữa",
  "PAYMENT": "Thanh toán",
  "YETPAID": "Chưa thanh toán",
  "PAID": "Đã thanh toán",
  "CANCELLED": "Đã hủy"
};

const MaintenanceInformations = () => {
  const dispatch = useDispatch();
  const centerId = localStorage.getItem("CenterId");
  const token = localStorage.getItem("localtoken");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openAddDialog, setAddDialog] = useState(false);

  const { maintenanceInformations = [], statusmi } = useSelector(
    (state) => state.maintenanceInformation
  );
  const [reload, setReload] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 7;

  const pageCount = Math.ceil(maintenanceInformations.length / itemsPerPage);
  const handleClickOpenAdd = () => {
    setAddDialog(true);
    console.log("Selected Item: ");
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickOpen = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
    console.log("Selected Item: ", item);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setReload(!reload);
    setSelectedItem(null);
    dispatch(ClearPaymentData());
  };
  const handleAddClose = () => {
    setAddDialog(false);
    setReload(!reload);
  };
  const [filterStatus, setFilterStatus] = useState("");
  const [filterVehicle, setFilterVehicle] = useState("");
  const [filterLicensePlate, setFilterLicensePlate] = useState("");

  const filteredInformations = maintenanceInformations.filter((booking) => {
    return (
      (filterStatus ? booking.status === filterStatus : true) &&
      (filterVehicle
        ? booking.responseVehicles.vehicleModelName
          .toLowerCase()
          .includes(filterVehicle.toLowerCase())
        : true) &&
      (filterLicensePlate
        ? booking.responseVehicles.licensePlate
          .toLowerCase()
          .includes(filterLicensePlate.toLowerCase())
        : true)
    );
  });
  const isRowHighlighted = (status, dateBooking) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const bookingDate = new Date(dateBooking).setHours(0, 0, 0, 0);
    return (
      (status === "CREATEDBYClIENT" || status === "WAITINGBYCAR") &&
      bookingDate <= today
    );
  };
  useEffect(() => {
    dispatch(MaintenanceInformationsByCenterId({ centerId, token }));
  }, [dispatch, centerId, token, reload]);

  return (
    <Box>
      <h3>Danh Sách Thông Tin Bảo Trì Sửa Chữa</h3>
      <Button variant="contained" color="success" onClick={handleClickOpenAdd}>
        Add Thông Tin Bảo Trì Sửa Chữa
      </Button>
      <AddMaintenanceDialog
        open={openAddDialog}
        handleClose={handleAddClose}
        token={token}
        centerId={centerId}
      />
      <Box
        display="flex"
        justifyContent="space-between"
        paddingTop={"5px"}
        mb={3}
      >
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
              {statusTranslations[status] || status}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Tên Xe"
          value={filterVehicle}
          onChange={(event) => setFilterVehicle(event.target.value)}
        />
        <TextField
          label="Biển Số Xe"
          value={filterLicensePlate}
          onChange={(event) => setFilterLicensePlate(event.target.value)}
        />
      </Box>
      {statusmi === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}

      {statusmi === "succeeded" &&
        maintenanceInformations &&
        maintenanceInformations.length > 0 &&
        filteredInformations &&
        filteredInformations.length > 0 && (
          <Grid>
            <TableContainer
              component={Paper}
              style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell>Mã Thông Tin</TableCell> */}
                    <TableCell>Xe </TableCell>
                    <TableCell>Biển Số Xe</TableCell>
                    <TableCell>Tên Thông Tin</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell>Ngày Đặt</TableCell>
                    <TableCell>Ngày Kết Thúc</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Số Lượng </TableCell>
                    {/* <TableCell>Tổng Chi Phí Hiện Tại</TableCell> */}
                    <TableCell>Ghi Chú</TableCell>
                    <TableCell>Chi Tiết</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maintenanceInformations.length > 0 &&
                    maintenanceInformations &&
                    filteredInformations.length > 0 &&
                    filteredInformations
                      .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                      .map((item) => (
                        <TableRow
                          key={item.informationMaintenanceId}
                          style={{
                            backgroundColor: isRowHighlighted(item.status, item.dateBooking)
                              ? "rgba(255, 255, 0, 0.3)" // Light yellow with lower opacity
                              : "transparent", // Highlight row if conditions are met
                          }}
                        >                          {/* <TableCell>{item.informationMaintenanceId}</TableCell> */}

                          <TableCell>
                            {item?.responseVehicles?.vehiclesBrandName}{" "}
                            {item?.responseVehicles?.vehicleModelName}
                          </TableCell>
                          <TableCell>
                            {item?.responseVehicles?.licensePlate}
                          </TableCell>
                          <TableCell>
                            {item.informationMaintenanceName}
                          </TableCell>
                          <TableCell>{formatDate(item.createdDate)}</TableCell>
                          <TableCell>{formatDate(item.dateBooking)}</TableCell>
                          <TableCell>
                            {item.finishedDate === "0001-01-01T00:00:00"
                              ? ""
                              : formatDate(item.finishedDate)}
                          </TableCell>
                          <TableCell>
                            <span
                              className="status"
                              style={makeStyle(item.status)}
                            >
                              {statusTranslations[item.status] || item.status}
                            </span>
                          </TableCell>
                          <TableCell
                          >
                            {item.responseMaintenanceServiceInfos.length +
                              item.responseMaintenanceSparePartInfos
                                .length}{" "}
                            items
                          </TableCell>
                          {/* <TableCell
                            style={{
                              // borderRadius: "10px",
                              // fontSize: "25px",
                              fontWeight: "bold",
                            }}
                          >
                            {formatNumberWithDots(item.totalPrice)} VND
                          </TableCell> */}
                          <TableCell>
                            <Tooltip title={item.note} arrow>
                              <span>{truncateNote(item.note)}</span>
                            </Tooltip>
                          </TableCell>
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
              style={{ paddingTop: "20px", paddingBottom: "20px" }}
            />
          </Grid>
        )}
      {selectedItem && (
        <MaintenanceInformationsDetailDialog
          open={openDialog}
          handleClose={handleClose}
          token={token}
          item={selectedItem}
        />
      )}
    </Box>
  );
};

export default MaintenanceInformations;