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
} from "@mui/material";
import { formatDate } from "../../Data/Pagination";
import {
  BookingByCenter,
  PatchStatusBookingByCenter,
} from "../../redux/bookingSlice";
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
  } else if (status === "CREATEDBYClIENT") {
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
  } else if (
    status === "CANCELLED" ||
    status === "DENIED"
  ) {
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


const statusOptions = ["WAITING", "DENIED", "ACCEPTED", "CANCELLED"];

const Booking = () => {
  const dispatch = useDispatch();
  const { bookings, statusbooking, error } = useSelector(
    (state) => state.booking
  );
  const[ reload,setReload]=useState(false);
  const token = localStorage.getItem("localtoken");

  const [page, setPage] = useState(1);
  const itemsPerPage = 7;

  const pageCount = Math.ceil(bookings.length / itemsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await dispatch(
        PatchStatusBookingByCenter({
          bookingId,
          status: newStatus,
          token,
        })
      );
      dispatch(BookingByCenter({ token: token }));
      setReload(true);
    } catch (error) {
      // console.error("Error updating status:", errors);
    }
  };

  useEffect(() => {
    dispatch(BookingByCenter({ token: token }));
  }, [dispatch, token,reload]);

  return (
    <Box>
      <h3>List Booking</h3>
      {statusbooking === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {statusbooking === "succeeded" && bookings && bookings.length > 0 && (
        <Grid>
          <TableContainer
            component={Paper}
            style={{
              boxShadow: "0px 13px 20px 0px #80808029",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Booking Id</TableCell>
                  <TableCell>Vehicles </TableCell>
                  <TableCell>License Plate</TableCell>
                  <TableCell>Booking Date</TableCell>
                  <TableCell>Odo</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((item) => (
                    <TableRow
                      key={item.bookingId}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>{item.bookingId}</TableCell>
                      <TableCell>
                        {item.responseVehicles.vehiclesBrandName}{" "}
                        {item.responseVehicles.vehicleModelName}
                      </TableCell>
                      <TableCell>
                        {item.responseVehicles.licensePlate}
                      </TableCell>
                      <TableCell>{formatDate(item.bookingDate)}</TableCell>
                      <TableCell>{item.responseVehicles.odo}</TableCell>
                      <TableCell>{item.note}</TableCell>
                      <TableCell>{item.responseClient.email}</TableCell>
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
                                {status}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : (
                          <span
                            className="status"
                            style={{
                              ...makeStyle(item.status),
                              // borderRadius: "10px",
                              // width: "125px",
                              // fontSize: "10px",
                              // height: "50px",
                            }}
                          >
                            {item.status}
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="Details">
                        <ButtonBase>SHOW</ButtonBase>
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
            style={{ marginTop: "20px" }}
          />
        </Grid>
      )}
    </Box>
  );
};

export default Booking;
