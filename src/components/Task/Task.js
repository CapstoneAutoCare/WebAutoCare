import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  DialogContent,
  Grid,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { TasksByCenter } from "../../redux/tasksSlice";
import { makeStyle } from "../Booking/Booking";
import { AddTaskDialog } from "../../Data/DialogComponent";

const Task = () => {
  const dispatch = useDispatch();
  const centerId = localStorage.getItem("CenterId");
  const token = localStorage.getItem("localtoken");
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setAddDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { tasks = [], statustasks } = useSelector((state) => state.tasks);

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const pageCount = Math.ceil(tasks.length / itemsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickOpen = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
    console.log("Selected Item: ", item);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleClickOpenAdd = () => {
    setAddDialog(true);
    console.log("Selected Item: ");
  };

  const handleAddClose = () => {
    setAddDialog(false);
  };
  useEffect(() => {
    dispatch(TasksByCenter(token));
  }, [dispatch, centerId, token]);

  return (
    <Box>
      <h3>List Maintenance Informations</h3>
      <Button variant="contained" color="success" onClick={handleClickOpenAdd}>
        Add Task
      </Button>
      {statustasks === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      <AddTaskDialog
        open={openAddDialog}
        handleClose={handleAddClose}
        token={token}
      />
      {statustasks === "succeeded" && tasks && tasks.length > 0 && (
        <Grid>
          <TableContainer
            component={Paper}
            style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>TaskId</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Technician Id</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((item) => (
                    <TableRow key={item.maintenanceTaskId}>
                      <TableCell>{item.maintenanceTaskId}</TableCell>
                      <TableCell>{item.maintenanceTaskName}</TableCell>
                      <TableCell>{item.createdDate}</TableCell>
                      <TableCell>
                        <span className="status" style={makeStyle(item.status)}>
                          {item.status}
                        </span>
                      </TableCell>

                      <TableCell>{item.technicianId}</TableCell>
                      <TableCell className="Details">
                        <ButtonBase onClick={() => handleClickOpen(item)}>
                          SHOW
                        </ButtonBase>
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
      {/* {selectedItem && (
        <MaintenanceInformationsDetailDialog
          open={openDialog}
          handleClose={handleClose}
          token={token}
          item={selectedItem}
        />
      )} */}
    </Box>
  );
};

export default Task;
