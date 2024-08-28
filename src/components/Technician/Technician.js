import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Pagination,
  Input,
  Typography,
  Box,
  Grid,
  Tooltip,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import "./Technician.css";
import usePagination, { formatDate } from "../../Data/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { TechinicanByCenterId } from "../../redux/techinicansSlice";
import { truncateNote } from "../Booking/Booking";
import { RegisterTechCare } from "../../Data/DialogAdmin";

const makeStyle = (status) => {
  if (status === "ACTIVE" || status === "ACCPET") {
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

export default function Technician() {
  const dispatch = useDispatch();
  const { technicians, statustech, errortech } = useSelector(
    (state) => state.technician
  );
  const [reload, setReload] = useState(false);

  const centerId = localStorage.getItem("CenterId");
  const token = localStorage.getItem("localtoken");

  const [page, setPage] = useState(1);
  const itemsPerPage = 7;
  const [open, setOpen] = useState(false);

  const [filterStatus, setFilterStatus] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  // const [filterCity, setFilterCity] = useState("");
  const [filterPhone, setFilterPhone] = useState("");

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

  const filteredlists = technicians.filter((center) => {
    const statusMatch = filterStatus ? center.status === filterStatus : true;

    const districtMatch = filterDistrict
      ? center.address?.toLowerCase().includes(filterDistrict.toLowerCase())
      : true;
  
    const phoneMatch = filterPhone
      ? center.phone?.toLowerCase().includes(filterPhone.toLowerCase())
      : true;

    return (
      statusMatch &&
      districtMatch &&
      phoneMatch
    );
  });

  const pageCount = Math.ceil(filteredlists.length / itemsPerPage);

  useEffect(() => {
    dispatch(TechinicanByCenterId({ centerId, token }));
  }, [dispatch, centerId, token, reload]);
  return (
    <Box>
      <h3>Danh Sách Nhân Viên</h3>
      <Button variant="contained" color="success" onClick={handleClickOpen}>
        Tạo Nhân Viên
      </Button>
      <RegisterTechCare
        open={open}
        handleClose={handleClose}
        token={token}
        setReload={setReload}
      />
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
              {status}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Quận"
          value={filterDistrict}
          onChange={(event) => setFilterDistrict(event.target.value)}
        />
        {/* <TextField
          label="Thành Phố"
          value={filterCity}
          onChange={(event) => setFilterCity(event.target.value)}
        /> */}
        <TextField
          label="Số Điện Thoại"
          value={filterPhone}
          onChange={(event) => setFilterPhone(event.target.value)}
        />
      </Box>
      {statustech === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {statustech === "succeeded" && technicians && technicians.length > 0 && (
        <Grid>
          <TableContainer
            component={Paper}
            style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {/* <TableCell>Mã Đặt Lịch</TableCell> */}
                  <TableCell>Avatart </TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mật Khẩu</TableCell>
                  <TableCell>Họ Tên</TableCell>
                  <TableCell>Số Điện Thoại</TableCell>
                  <TableCell>Ngày Sinh</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Địa Chỉ</TableCell>
                  <TableCell>Giới Tính</TableCell>
                  <TableCell>Mô Tả</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                  {/* <TableCell>Chi Tiết</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {technicians.length > 0 &&
                  filteredlists
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((item) => (
                      <TableRow
                        key={item.maintenanceCenterId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          {item?.logo ? (
                            <img
                              src={item?.logo}
                              alt="Item Logo"
                              className="item-logo"
                              style={{
                                width: "50px",
                                height: "50px",
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
                                width: "50px",
                                height: "50px",
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
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.password}</TableCell>
                        <TableCell>
                          {item.firstName} {item.lastName}
                        </TableCell>
                        <TableCell>{item.phone}</TableCell>
                        <TableCell>{item.birthday}</TableCell>
                        <TableCell>{item.role}</TableCell>
                        <TableCell>
                          <Tooltip title={item?.address} arrow>
                            <span>{truncateNote(item?.address)}</span>
                          </Tooltip>
                        </TableCell>

                        <TableCell>{item?.gender}</TableCell>
                        <TableCell>
                          <Tooltip title={item?.technicianDescription} arrow>
                            <span>
                              {truncateNote(item?.technicianDescription)}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {/* <Select
                            value={item.status}
                            onChange={(event) => {
                              const newStatus = event.target.value;
                              // handleStatusChange(
                              //   item.maintenanceCenterId,
                              //   newStatus
                              // );
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
                          </Select> */}
                          <span
                                className="status"
                                style={makeStyle(item.status)}
                              >
                                {item.status}
                              </span>
                        </TableCell>
                        {/* <TableCell className="Details">
                          <Button
                            // onClick={() => handleClickOpen(item)}
                            variant="contained"
                            color="success"
                          >
                            Chi Tiết
                          </Button>
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
            style={{ marginTop: "20px", paddingBottom: "30px" }}
          />
        </Grid>
      )}
    </Box>
  );
}
