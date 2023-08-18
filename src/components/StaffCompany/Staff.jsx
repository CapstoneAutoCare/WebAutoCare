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
import "../StaffCompany/Staff.css";
import AccountApi from "../Axios/AccountApi";
import usePagination from "../../Data/Pagination";
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

export default function Staff({ accountItems }) {
  const [accounts, setAccounts] = useState([]);

  // State để xác định xem Dialog có mở hay không
  const [open, setOpen] = useState(false);
  // State để lưu trữ thông tin tài khoản
  const [accountInfo, setAccountInfo] = useState({
    companyName: "",
    accountNumber: "",
    // Thêm các trường thông tin tài khoản khác tại đây nếu cần thiết
  });

  // Hàm xử lý mở Dialog
  const handleOpen = () => {
    setOpen(true);
  };

  // Hàm xử lý đóng Dialog
  const handleClose = () => {
    setOpen(false);
  };
  const handleAddAccount = () => {
    // Thực hiện các xử lý khi thêm thông tin tài khoản vào đây
    console.log("Thêm thông tin tài khoản:", accountInfo);
    // Đóng Dialog sau khi thêm xong
    handleClose();
  };

  const fetchAccounts = async (Id, localToken) => {
    // setToken(localStorage.getItem("localtoken"));
    try {
      if (!{ localToken }) {
        console.log("No token found in localStorage.");
        return;
      }
      const response = await AccountApi.getAllAccounts(localToken);
      // const response = await AccountApi.getAccountById(Id, localToken);
      // console.log("API Response:", [response.data.data]);
      console.log("API Response:", response.data.data);
      // setAccounts([response.data.data]); // Update state with the fetched accounts
      setAccounts(response.data.data); // Update state with the fetched accounts
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  const handleStatusChange = async (accountId, newStatus) => {
    try {
      var admin = localStorage.getItem("AdminId");
      var token = localStorage.getItem("localtoken");
      const formData = new FormData();
      formData.append("accountId", accountId); // Using the accountId from the account prop
      formData.append("adminId", admin); // Using the adminId from the account prop
      formData.append("status", newStatus);

      const response = await AccountApi.updateStatusAccount(formData, token);
      // Handle response data if needed
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.accountId === accountId
            ? { ...account, status: newStatus }
            : account
        )
      );
      console.log(accountId, admin, newStatus);
      console.log(response.data.data.status);
    } catch (error) {
      // Handle error if needed
      console.error(error.message);
    }
  };
  useEffect(() => {
    const localToken = localStorage.getItem("localtoken");
    const Id = localStorage.getItem("AccountId");
    console.log(`Local Token: ${localToken} \nAccountId: ${Id}`);
    console.log("AdminId: ", localStorage.getItem("AdminId"));

    fetchAccounts(Id, localToken);
  }, []);

  let [page, setPage] = useState(1);
  const PER_PAGE = 7;
  const count = Math.ceil(accounts.length / PER_PAGE);

  // const sortAccountsByDateDesc = (a, b) => {
  //   return new Date(b.date) - new Date(a.date);
  // };

  const sortDate = [...accounts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const _Data = usePagination(sortDate, PER_PAGE);

  // Function to handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    _Data.jump(newPage);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <Box>
        <h3>Accounts Company</h3>
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
                  <TableCell>Account ID</TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>ROLE</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Information</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  (accountItems = _Data.currentData().map((account) => (
                    <TableRow
                      key={`${account.accountId}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      {/* <TableCell component="th" scope="row"> */}
                      <TableCell>{account.accountId}</TableCell>
                      <TableCell>{account.username}</TableCell>
                      <TableCell>
                        {account.firstName} {account.lastName}
                      </TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>
                        <Tooltip
                          className="status"
                          style={makeRole(account.role)}
                        >
                          {account.role}
                        </Tooltip>
                      </TableCell>
                      <TableCell>{formatDate(account.date)}</TableCell>
                      <TableCell>
                        <Select
                          value={account.status}
                          onChange={(event) => {
                            const newStatus = event.target.value;
                            handleStatusChange(account.accountId, newStatus);
                          }}
                          className="status"
                          style={{
                            ...makeStyle(account.status),
                            borderRadius: "10px", // Độ cong viền tròn
                            width: "121px", // Độ rộng thu nhỏ
                            fontSize: "12px", // Cỡ chữ nhỏ
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
                  )))
                }
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
