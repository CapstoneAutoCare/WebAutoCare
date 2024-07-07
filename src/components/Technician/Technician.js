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
} from "@mui/material";
import "./Technician.css";
import usePagination, { formatDate } from "../../Data/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { TechinicanByCenterId } from "../../redux/techinicansSlice";

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
  const { technicians, status, error } = useSelector(
    (state) => state.technician
  );
  const centerId = localStorage.getItem("CenterId");
  const token = localStorage.getItem("localtoken");
  useEffect(() => {
    dispatch(TechinicanByCenterId({ centerId, token }));
    console.log("da call", technicians);
  }, [dispatch, centerId, token]);

  const [open, setOpen] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    companyName: "",
    accountNumber: "",
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleAddAccount = () => {
    console.log("Thêm thông tin tài khoản:", accountInfo);
    handleClose();
  };
  let [page, setPage] = useState(1);
  const PER_PAGE = 7;
  const count = Math.ceil(technicians.length / PER_PAGE);
  const sortDate = [...technicians].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const _Data = usePagination(sortDate, PER_PAGE);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    _Data.jump(newPage);
  };

  return (
    <>
      <Box>
        <h3>Manager</h3>
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
                  <TableCell>Email </TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>ROLE</TableCell>
                  <TableCell>BIRTHDAY</TableCell>
                  <TableCell>GENDER</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Information</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {technicians.map((account) => (
                  <TableRow
                    key={account.technicianId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      {account.logo ? (
                        <img
                          src={account.logo}
                          alt="Item Logo"
                          className="item-logo"
                        />
                      ) : (
                        <div className="no-image-placeholder">
                          No Image Available
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.phone}</TableCell>
                    <TableCell>
                      {account.firstName} {account.lastName}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        className="status"
                        style={makeRole(account.role)}
                      >
                        {account.role}
                      </Tooltip>
                    </TableCell>
                    <TableCell>{formatDate(account.birthday)}</TableCell>
                    <TableCell>{account.gender}</TableCell>
                    <TableCell>
                      <Select
                        value={account.status}
                        onChange={(event) => {
                          const newStatus = event.target.value;
                          // handleStatusChange(account.accountId, newStatus);
                        }}
                        className="status"
                        style={{
                          ...makeStyle(account.status),
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
        </Grid>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Account Company</DialogTitle>
          <DialogContent>
            {/* Input fields */}
            <TextField
              autoFocus
              margin="dense"
              label="Company Name"
              fullWidth
              value={accountInfo.companyName}
              onChange={(e) =>
                setAccountInfo({
                  ...accountInfo,
                  companyName: e.target.value,
                })
              }
            />
            <TextField
              autoFocus
              margin="dense"
              label="Company Name"
              fullWidth
              value={accountInfo.companyName}
              onChange={(e) =>
                setAccountInfo({
                  ...accountInfo,
                  companyName: e.target.value,
                })
              }
            />
            <TextField
              autoFocus
              margin="dense"
              label="Company Name"
              fullWidth
              value={accountInfo.companyName}
              onChange={(e) =>
                setAccountInfo({
                  ...accountInfo,
                  companyName: e.target.value,
                })
              }
            />
            <TextField
              margin="dense"
              label="Account Number"
              fullWidth
              value={accountInfo.accountNumber}
              onChange={(e) =>
                setAccountInfo({
                  ...accountInfo,
                  accountNumber: e.target.value,
                })
              }
            />
            {/* Thêm các trường thông tin tài khoản khác tại đây nếu cần thiết */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddAccount} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Pagination
          variant="outlined"
          color="primary"
          showFirstButton
          showLastButton
          count={count}
          size="large"
          page={page}
          onChange={handlePageChange}
        />
      </Box>
    </>
  );
}
