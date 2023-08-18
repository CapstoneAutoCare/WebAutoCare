import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ButtonBase,
  Pagination,
  Tooltip,
  Box,
  Grid,
} from "@mui/material";
import "../Job/Job.css";
import JobsApi from "../Axios/JobsApi";
import usePagination from "../../Data/Pagination";

const makeStatus = (status) => {
  if (status === "ACCEPT") {
    return {
      background: "rgb(145 254 159 / 47%)",
      color: "green",
      padding: "8px",
      borderRadius: "9px",
    };
  } else if (status === "INACTIVE") {
    return {
      background: "#ffadad8f",
      color: "red",
      padding: "7px",
      borderRadius: "9px",
    };
  }
};
export default function Job(JobItems) {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await JobsApi.getAllJobs();
      setJobs(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  let [page, setPage] = useState(1);
  const PER_PAGE = 4;
  const count = Math.ceil(jobs.length / PER_PAGE);
  const _Data = usePagination(jobs, PER_PAGE);

  // Function to handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    _Data.jump(newPage);
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
        <h3>Jobs Company</h3>
        <TableContainer
          component={Paper}
          style={{
            boxShadow: "0px 13px 20px 0px #80808029",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job ID</TableCell>
                <TableCell>Name Skill</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Information</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                (JobItems = _Data.currentData().map((job) => (
                  <TableRow key={job.jobId || (job.jobId && job.companyId)}>
                    <TableCell>{job.jobId}</TableCell>
                    <TableCell>{job.nameSkill}</TableCell>
                    <TableCell>
                      <Tooltip title={job.description} enterDelay={300}>
                        {job.description.length >= 500
                          ? `${job.description.substring(0, 500)} ...`
                          : job.description}
                        {/* {job.description} */}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip variant="body1" style={makeStatus(job.status)}>
                        {job.status}
                      </Tooltip>
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
  );
}
