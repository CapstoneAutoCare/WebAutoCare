import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  ButtonBase,
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
} from "@mui/material";
import { formatDate } from "../../Data/Pagination";
import { BookingByCenter } from "../../redux/bookingSlice";

const makeStyle = (status) => {
  if (status === "ACTIVE" || status === "ACCEPT") {
    return {
      background: "rgb(145 254 159 / 47%)",
      color: "green",
    };
  } else if (status === "REQUEST" || status === "INACTIVE") {
    return {
      background: "#ffadad8f",
      color: "red",
    };
  } else {
    return {
      background: "#59bfff",
      color: "white",
    };
  }
};

const makeRole = (role) => {
  if (role === "ADMIN") {
    return {
      background: "#ffadad8f",
      color: "red",
    };
  } else if (role === "COMPANY") {
    return {
      background: "#59bfff",
      color: "blue",
    };
  } else if (role === "CANDIDATE") {
    return {
      background: "rgb(145 254 159 / 47%)",
      color: "green",
    };
  }
};

const statusOptions = ["WAITING", "DENIED", "ACCEPTED", "REQUEST"];

const Booking = () => {
  const dispatch = useDispatch();
  const { bookings, status, error } = useSelector((state) => state.booking);
  const token = localStorage.getItem("localtoken");

  const [page, setPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    dispatch(BookingByCenter({ token: token }));
  }, [dispatch, token]);

  const pageCount = Math.ceil(bookings.length / itemsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <Box>
        <h3>List Booking</h3>
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
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      {/* <TableCell>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt="Item Logo"
                            className="item-logo"
                          />
                        ) : (
                          <div className="no-image-placeholder">
                            No Image Available
                          </div>
                        )}
                      </TableCell> */}
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
                      <TableCell>{item.responseVehicles.note}</TableCell>
                      <TableCell>{item.responseClient.email}</TableCell>
                      <TableCell>
                        <Select
                          value={item.status}
                          onChange={(event) => {
                            const newStatus = event.target.value;
                            // handleStatusChange(item.itemId, newStatus);
                          }}
                          className="status"
                          style={{
                            ...makeStyle(item.status),
                            borderRadius: "10px",
                            width: "121px",
                            fontSize: "12px",
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
      </Box>
    </div>
  );
};

export default Booking;
