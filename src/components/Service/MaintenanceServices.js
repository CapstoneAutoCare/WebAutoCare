import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
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
import "../SparePart/sparepartItems.css";
import { MaintenanceServicesByCenterId } from "../../redux/mainserviceSlice";
import { AddMaintenanceServiceDialog } from "../../Data/DialogComponent";

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

const statusOptions = ["ACTIVE", "INACTIVE", "ACCEPT", "REQUEST"];

const MaintenanceServices = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const {
    maintenanceservices = [],
    status,
    error,
  } = useSelector((state) => state.maintenanceservice);
  const centerId = localStorage.getItem("CenterId");
  const token = localStorage.getItem("localtoken");

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(
      MaintenanceServicesByCenterId({ centerId: centerId, token: token })
    );
  }, [dispatch, token, centerId]);

  // Tổng số trang
  const pageCount = Math.ceil(maintenanceservices.length / itemsPerPage);

  // Xử lý khi chuyển trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <Box>
        <h3>List Maintenance Services</h3>
        <Button variant="contained" color="success" onClick={handleClickOpen}>
          Add Maintenance Services
        </Button>
        <AddMaintenanceServiceDialog
          open={open}
          handleClose={handleClose}
          centerId={centerId}
          token={token}
        />
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
                  <TableCell>Avatar</TableCell>
                  <TableCell>Maintenance Service Name </TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {maintenanceservices
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((item) => (
                    <TableRow
                      key={item.maintenanceServiceId}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
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
                      </TableCell>
                      <TableCell>{item.maintenanceServiceName}</TableCell>
                      <TableCell>{formatDate(item.createdDate)}</TableCell>
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

export default MaintenanceServices;
