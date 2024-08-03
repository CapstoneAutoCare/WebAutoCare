import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  ButtonBase,
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
import { MaintenanceInformationsDetailDialog } from "../../Data/DialogComponent";
import { makeStyle, truncateNote } from "../Booking/Booking";
import { formatDate } from "../../Data/Pagination";
import { ClearPaymentData } from "../../redux/paymentSlice";
import { formatNumberWithDots } from "./OutlinedCard";

const statusOptions = [
  "PAID",
  "PAYMENT",
  "REPAIRING",
  "CHECKIN",
  "WAITINGBYCAR",
  "CREATEDBYClIENT",
  "CANCELLED",
];

const MaintenanceInformations = () => {
  const dispatch = useDispatch();
  const centerId = localStorage.getItem("CenterId");
  const token = localStorage.getItem("localtoken");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { maintenanceInformations = [], statusmi } = useSelector(
    (state) => state.maintenanceInformation
  );
  const [reload, setReload] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 7;

  const pageCount = Math.ceil(maintenanceInformations.length / itemsPerPage);

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

  useEffect(() => {
    dispatch(MaintenanceInformationsByCenterId({ centerId, token }));
  }, [dispatch, centerId, token, reload]);

  return (
    <Box>
      <h3>Danh Sách Thông Tin Bảo Trì Sửa Chữa</h3>
      {/* <Button variant="contained" color="success">
        Add Maintenance Informations
      </Button> */}
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
              {status}
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
                    <TableCell>Ngày Kết Thúc</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Số Lượng </TableCell>
                    <TableCell>Tổng Chi Phí Hiện Tại</TableCell>
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
                        <TableRow key={item.informationMaintenanceId}>
                          {/* <TableCell>{item.informationMaintenanceId}</TableCell> */}

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
                          <TableCell>{formatDate(item.finishedDate)}</TableCell>
                          <TableCell>
                            <span
                              className="status"
                              style={makeStyle(item.status)}
                            >
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell
                            style={{
                              borderRadius: "10px",
                            }}
                          >
                            {item.responseMaintenanceServiceInfos.length +
                              item.responseMaintenanceSparePartInfos
                                .length}{" "}
                            items
                          </TableCell>
                          <TableCell
                            style={{
                              // borderRadius: "10px",
                              // fontSize: "25px",
                              fontWeight: "bold",
                            }}
                          >
                            {formatNumberWithDots(item.totalPrice)} VND
                          </TableCell>
                          <TableCell>
                            <Tooltip title={item.note} arrow>
                              <span>{truncateNote(item.note)}</span>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="Details">
                            <Button onClick={() => handleClickOpen(item)} variant="contained" color="success">
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
