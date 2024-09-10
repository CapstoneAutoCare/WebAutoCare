import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
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
import { formatDate } from "../../Data/Pagination";
import {
  BookingByCenter,
  PatchStatusBookingByCenter,
} from "../../redux/bookingSlice";
import * as signalR from "@microsoft/signalr";

export const makeStyle = (status) => {
  if (status === "INACTIVE") {
    return {
      background: "#d3d3d3",
      color: "black",
    };
  } else if (status === "ACTIVE") {
    return {
      background: "#007bff",
      color: "white",
    };
  } else if (status === "ACCEPTED") {
    return {
      background: "#17a2b8",
      color: "white",
    };
  } else if (status === "DONE") {
    return {
      background: "#4CAF50",
      color: "white",
    };
  } else if (status === "CREATEDBYCLIENT") {
    return {
      background: "#ffc107",
      color: "black",
    };
  } else if (status === "CREATEDBYCUSTOMERCARE") {
    return {
      background: "#fd7e14",
      color: "white",
    };
  } else if (status === "WAITINGBYCAR") {
    return {
      background: "#ff8800",
      color: "white",
    };
  } else if (status === "CHECKIN") {
    return {
      background: "#17a2b8",
      color: "white",
    };
  } else if (status === "REPAIRING") {
    return {
      background: "#0056b3",
      color: "white",
    };
  } else if (status === "PAYMENT") {
    return {
      background: "#6f42c1",
      color: "white",
    };
  } else if (status === "YETPAID") {
    return {
      background: "#dc3545",
      color: "white",
    };
  } else if (status === "PAID") {
    return {
      background: "#28a745",
      color: "white",
    };
  } else if (status === "CANCELLED" || status === "DENIED") {
    return {
      background: "#990000",
      color: "white",
    };
  } else {
    return {
      background: "#0099CC",
      color: "white",
    };
  }
};

export const MAX_WORDS = 21;
export const truncateNote = (note) => {
  const words = note.split(" ");
  if (words.length > MAX_WORDS) {
    return words.slice(0, MAX_WORDS).join(" ") + "...";
  }
  return note;
};
const statusOptions = ["WAITING", "ACCEPTED", "CANCELLED"];

const translateStatus = (status) => {
  switch (status) {
    case "WAITING":
      return "ĐANG CHỜ";
    case "ACCEPTED":
      return "CHẤP NHẬN";
    case "CANCELLED":
      return "ĐÃ HỦY";
    default:
      return status;
  }
};

const Booking = () => {
  const dispatch = useDispatch();
  const { bookings, statusbooking, error } = useSelector(
    (state) => state.booking
  );
  const [connection, setConnection] = useState(null);
  const { customercares, status } = useSelector(
    (state) => state.customercare
  );
  const [reload, setReload] = useState(false);
  const token = localStorage.getItem("localtoken");
  const role = localStorage.getItem("ROLE");

  const [page, setPage] = useState(1);
  const itemsPerPage = 7;
  const pageCount = Math.ceil(bookings.length / itemsPerPage);

  const [filterStatus, setFilterStatus] = useState("");
  const [filterVehicle, setFilterVehicle] = useState("");
  const [filterLicensePlate, setFilterLicensePlate] = useState("");
  var centerId = localStorage.getItem("CenterId");
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      var customercareId = localStorage.getItem("CUSTOMERCAREID");

      await dispatch(
        PatchStatusBookingByCenter({ customercareId, bookingId, status: newStatus, token })
      );
      dispatch(BookingByCenter({ token: token, id: centerId }));
      setReload(true);
    } catch (error) {
      // console.error("Error updating status:", errors);
    }
  };

  useEffect(() => {
    dispatch(BookingByCenter({ token: token, id: centerId }));
  }, [dispatch, token, reload, role]);

  const isRowHighlighted = (status, dateBooking) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const bookingDate = new Date(dateBooking).setHours(0, 0, 0, 0);
    return (
      (status === "WAITING") &&
      bookingDate <= today
    );
  };
  const filteredBookings = bookings.filter((booking) => {
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

  return (
    <Box>
      <h3>Danh Sách Lịch Đặt</h3>
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
              {translateStatus(status)}
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
      {statusbooking === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {statusbooking === "succeeded" &&
        filteredBookings &&
        filteredBookings.length > 0 && (
          <Grid>
            <TableContainer
              component={Paper}
              style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell>Mã Đặt Lịch</TableCell> */}
                    <TableCell>Xe </TableCell>
                    <TableCell>Biển Số Xe</TableCell>
                    <TableCell>Tên Khách Hàng</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Số Điện Thoại</TableCell>
                    <TableCell>Ngày Đặt Lịch</TableCell>
                    <TableCell>Số Odo</TableCell>
                    <TableCell>Ghi Chú</TableCell>
                    <TableCell>Avatar</TableCell>
                    <TableCell>Status</TableCell>
                    {/* <TableCell>Details</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((item) => (
                      <TableRow
                        key={item.bookingId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        style={{
                          backgroundColor: isRowHighlighted(item.status, item.bookingDate)
                            ? "rgba(255, 255, 0, 0.3)"
                            : "transparent",
                        }}
                      >
                        {/* <TableCell>{item.bookingId}</TableCell> */}
                        <TableCell
                        // style={{ borderRadius: "10px", fontSize: "25px" }}
                        >
                          {item.responseVehicles.vehiclesBrandName}{" "}
                          {item.responseVehicles.vehicleModelName}
                        </TableCell>
                        <TableCell
                        // style={{ borderRadius: "10px", fontSize: "25px" }}
                        >
                          {item.responseVehicles.licensePlate}
                        </TableCell>
                        <TableCell>
                          {item.responseClient.firstName}{" "}
                          {item.responseClient.lastName}
                        </TableCell>
                        <TableCell>{item.responseClient.email}</TableCell>
                        <TableCell>{item.responseClient.phone}</TableCell>
                        <TableCell>{formatDate(item.bookingDate)}</TableCell>
                        <TableCell>{item.responseVehicles.odo}</TableCell>
                        <TableCell>
                          <Tooltip title={item.note} arrow>
                            <span>{truncateNote(item.note)}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {item.responseClient.logo ? (
                            <img
                              src={item.responseClient.logo}
                              alt="Item Logo"
                              className="item-logo"
                              style={{
                                width: "45px",
                                height: "45px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f0f0f0",
                              }}
                            />
                          ) : (
                            <div
                              className="no-image-placeholder"
                              style={{
                                width: "45px",
                                height: "45px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f0f0f0",
                              }}
                            >
                              No Image Available
                            </div>
                          )}
                        </TableCell>
                        {role === "CUSTOMERCARE" ? (
                          <TableCell>
                            {item.status === "WAITING" ? (
                              <Select
                                value={item.status}
                                onChange={(event) => {
                                  const newStatus = event.target.value;
                                  handleStatusChange(item.bookingId, newStatus);
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
                                    {translateStatus(status)}
                                  </MenuItem>
                                ))}
                              </Select>
                            ) : (
                              <TableCell>

                                <span
                                  className="status"
                                  style={{ ...makeStyle(item.status) }}
                                >
                                  {translateStatus(item.status)}
                                </span>
                              </TableCell>

                            )}
                          </TableCell>
                        ) : (
                          <TableCell>

                            <span
                              className="status"
                              style={{ ...makeStyle(item.status) }}
                            >
                              {translateStatus(item.status)}
                            </span>
                          </TableCell>
                        )}


                        {/* {role === "CENTER" && (
                          <TableCell>
                            {item.status === "WAITING" ? (
                              <Select
                                value={item.status}
                                onChange={(event) => {
                                  const newStatus = event.target.value;
                                  // Handle status change here
                                  handleStatusChange(item.bookingId, newStatus);
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
                                    {translateStatus(status)}
                                  </MenuItem>
                                ))}
                              </Select>
                            ) : (
                              

                            )}
                          </TableCell>
                        )} */}


                        {/* <TableCell className="Details">
                          <ButtonBase>SHOW</ButtonBase>
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
              style={{ marginTop: "20px" }}
            />
          </Grid>
        )
      }
    </Box >
  );
};

export default Booking;
