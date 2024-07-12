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
  Tooltip,
  Typography,
} from "@mui/material";
import { formatDate } from "../../Data/Pagination";
import {
  BookingByCenter,
  PatchStatusBookingByCenter,
} from "../../redux/bookingSlice";

export const makeStyle = (status) => {
  if (status === "ACCEPTED") {
    return {
      background: "green",
      color: "white",
    };
  } else if (status === "WAITING") {
    return {
      background: "#0099CC",
      color: "white",
    };
  } else if (status === "CANCELLED" || status === "DENIED" || status === "INACTIVE") {
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
    } catch (error) {
      // console.error("Error updating status:", errors);
    }
  };

  useEffect(() => {
    dispatch(BookingByCenter({ token: token }));
  }, [dispatch, token]);

  return (
    <Box>
      <h3>List Booking</h3>
      {statusbooking === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {statusbooking === "succeeded" && (
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
                        <Select
                          value={item.status}
                          onChange={(event) => {
                            const newStatus = event.target.value;
                            handleStatusChange(item.bookingId, newStatus);
                          }}
                          className="status"
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
