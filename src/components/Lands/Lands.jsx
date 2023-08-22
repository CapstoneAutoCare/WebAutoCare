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
import CompanyApi from "../Axios/CompanyApi";
import usePagination from "../../Data/Pagination";
const statusOptions = ["ACTIVE", "INACTIVE"];
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

export default function Position({ companyItems }) {
  const [hr, setHr] = useState([]);
  const [interviewer, setInterviewer] = useState([]);

  // State để xác định xem Dialog có mở hay không
  const [open, setOpen] = useState(false);
  // State để lưu trữ thông tin tài khoản

  const fetchCompany = async (CompanyId, localToken) => {
    try {
      if (!{ localToken }) {
        console.log("No token found in localStorage.");
        return;
      }
      var hrs = await CompanyApi.getAllHrCompanyByCompanyId(
        CompanyId,
        localToken
      );
      console.log("API ResponseHr:", hrs.data.data);
      setHr(hrs.data.data); // Update state with the fetched accounts

      var interviewers = await CompanyApi.getAllInterviewerCompanyByCompanyId(
        CompanyId,
        localToken
      );
      console.log("API ResponseInterviewer:", interviewers.data.data);
      setInterviewer(interviewers.data.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  const handleStatusChangeHr = async (hrId, newStatus) => {
    try {
      var companyId = localStorage.getItem("COMPANYID");
      var token = localStorage.getItem("localtoken");
      const formData = new FormData();
      formData.append("hrId", hrId); // Using the accountId from the account prop
      formData.append("companyId", companyId); // Using the adminId from the account prop
      formData.append("status", newStatus);

      const response = await CompanyApi.updateStatusHr(formData, token);
      // Handle response data if needed
      setHr((prevAccounts) =>
        prevAccounts.map((companies) =>
          companies.hrId === hrId
            ? { ...companies, statusHr: newStatus }
            : companies
        )
      );
      console.log(
        "HrId: " + hrId,
        "\nCompanyId: " + companyId,
        "\nStatusHr: " + newStatus
      );
      console.log(response.data.data.statusHr);
    } catch (error) {
      // Handle error if needed
      console.error(error);
    }
  };
  const handleStatusChangeInterviewer = async (interviewerId, newStatus) => {
    try {
      var companyId = localStorage.getItem("COMPANYID");
      var token = localStorage.getItem("localtoken");
      const formData = new FormData();
      formData.append("inteviewerId", interviewerId); // Using the accountId from the account prop
      formData.append("companyId", companyId); // Using the adminId from the account prop
      formData.append("status", newStatus);

      const response = await CompanyApi.updateStatusInterviewer(
        formData,
        token
      );
      // Handle response data if needed
      setInterviewer((prevAccounts) =>
        prevAccounts.map((companies) =>
          companies.interviewerId === interviewerId
            ? { ...companies, statusInterviewer: newStatus }
            : companies
        )
      );
      console.log(
        "InterviewerId: " + interviewerId,
        "\nCompanyId: " + companyId,
        "\nStatusInterviewer: " + newStatus
      );
      console.log(response.data.data.statusInterviewer);
    } catch (error) {
      // Handle error if needed
      console.error(error);
    }
  };
  useEffect(() => {
    const localToken = localStorage.getItem("localtoken");
    const CompanyId = localStorage.getItem("COMPANYID");
    // console.log(`Local Token: ${localToken} \nCOMPANYID: ${CompanyId}`);

    fetchCompany(CompanyId, localToken);
  }, []);

  let [pageHr, setPageHr] = useState(1);
  let [pageInterviewer, setPageInterviewer] = useState(1);

  const PER_PAGE = 3;
  const countHr = Math.ceil(hr.length / PER_PAGE);
  const countInterviewer = Math.ceil(interviewer.length / PER_PAGE);

  const sortDateHr = [...hr].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const _DataHr = usePagination(sortDateHr, PER_PAGE);

  const sortDateInterviewer = [...interviewer].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const _DataInterviewer = usePagination(sortDateInterviewer, PER_PAGE);
  // Function to handle page change
  const handlePageChangeHr = (event, newPage) => {
    setPageHr(newPage);
    _DataHr.jump(newPage);
  };
  const handlePageChangeInterviewer = (event, newPage) => {
    setPageInterviewer(newPage);
    _DataInterviewer.jump(newPage);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box
      // display="flex"
      alignItems="center"
      justifyContent="center"
      padding="16px"
      height="100%"
    >
      <Grid>
        <h3>HR</h3>

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
                <TableCell>Date</TableCell>
                <TableCell>StatusAccount</TableCell>
                <TableCell>StatusCompany</TableCell>
                <TableCell>Information</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                (companyItems = _DataHr.currentData().map((companies) => (
                  <TableRow
                    key={`${companies.hrId}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {/* <TableCell component="th" scope="row"> */}
                    <TableCell>{companies.accountId}</TableCell>
                    <TableCell>{companies.username}</TableCell>
                    <TableCell>
                      {companies.firstName} {companies.lastName}
                    </TableCell>
                    <TableCell>{companies.email}</TableCell>

                    <TableCell>{formatDate(companies.date)}</TableCell>
                    <TableCell>
                      <Tooltip
                        className="status"
                        style={makeStyle(companies.status)}
                      >
                        {companies.status}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={companies.statusHr}
                        onChange={(event) => {
                          const newStatus = event.target.value;
                          handleStatusChangeHr(companies.hrId, newStatus);
                        }}
                        className="status"
                        style={{
                          ...makeStyle(companies.statusHr),
                          borderRadius: "10px", // Độ cong viền tròn
                          width: "120px", // Độ rộng thu nhỏ
                          fontSize: "12px", // Cỡ chữ nhỏ
                          height: "38px",
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
        <Pagination
          variant="outlined"
          color="primary"
          showFirstButton
          showLastButton
          count={countHr}
          size="large"
          page={pageHr}
          onChange={handlePageChangeHr}
        />
        <h3>INTERVIEWER</h3>

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
                <TableCell>Date</TableCell>
                <TableCell>StatusAccount</TableCell>
                <TableCell>StatusCompany</TableCell>
                <TableCell>Information</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                (companyItems = _DataInterviewer
                  .currentData()
                  .map((companies) => (
                    <TableRow
                      key={`${companies.interviewerId}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      {/* <TableCell component="th" scope="row"> */}
                      <TableCell>{companies.accountId}</TableCell>
                      <TableCell>{companies.username}</TableCell>
                      <TableCell>
                        {companies.firstName} {companies.lastName}
                      </TableCell>
                      <TableCell>{companies.email}</TableCell>

                      <TableCell>{formatDate(companies.date)}</TableCell>
                      <TableCell>
                        <Tooltip
                          className="status"
                          style={makeStyle(companies.status)}
                        >
                          {companies.status}
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={companies.statusInterviewer}
                          onChange={(event) => {
                            const newStatus = event.target.value;
                            handleStatusChangeInterviewer(
                              companies.interviewerId,
                              newStatus
                            );
                          }}
                          className="status"
                          style={{
                            ...makeStyle(companies.statusInterviewer),
                            borderRadius: "10px", // Độ cong viền tròn
                            width: "120px", // Độ rộng thu nhỏ
                            fontSize: "12px", // Cỡ chữ nhỏ
                            height: "38px",
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
        <Pagination
          variant="outlined"
          color="primary"
          showFirstButton
          showLastButton
          count={countInterviewer}
          size="large"
          page={pageInterviewer}
          onChange={handlePageChangeInterviewer}
        />
      </Grid>
    </Box>
  );
}
