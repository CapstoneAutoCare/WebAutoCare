import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
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
import { TaskPatchStatus, TasksByCenter } from "../../redux/tasksSlice";
import { makeStyle } from "../Booking/Booking";
import { AddTaskDialog, ViewTaskDetailDialog } from "../../Data/DialogComponent";
import { formatDate } from "../../Data/Pagination";

const statusOptions = ["ACTIVE", "ACCEPTED", "CANCELLED"];

const Task = () => {
  const dispatch = useDispatch();
  const centerId = localStorage.getItem("CenterId");
  const token = localStorage.getItem("localtoken");
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setAddDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { tasks = [], statustasks } = useSelector((state) => state.tasks);
  const [reloadTaskDialog, setReloadTaskDialog] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const pageCount = Math.ceil(tasks.length / itemsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };



  const handleViewClose = () => {
    setReloadTaskDialog(!reloadTaskDialog);
    setSelectedItem(null);
    setOpenDialog(false);
  };

  const handleClickShow = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
    console.log("Selected Item: ", item);

  };


  const handleClickOpenAdd = () => {
    setAddDialog(true);
    console.log("Selected Item: ");
  };

  const handleAddClose = () => {
    setAddDialog(false);
    setReloadTaskDialog(!reloadTaskDialog);
  };
  
  const handleStatusChange = async (maintenanceTaskId, newStatus) => {
    try {
      await dispatch(
        TaskPatchStatus({
          token,
          id: maintenanceTaskId,
          status: newStatus,
        })
      );
      // dispatch(BookingByCenter({ token: token }));
      setReloadTaskDialog(!reloadTaskDialog);
    } catch (error) {
      // console.error("Error updating status:", errors);
    }
  };
  useEffect(() => {
    dispatch(TasksByCenter(token));
  }, [dispatch, centerId, token, reloadTaskDialog]);

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
        centerId={centerId}
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
                  <TableCell>InformationMaintenanceId</TableCell>
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
                      <TableCell>{item.informationMaintenanceId}</TableCell>
                      <TableCell>{item.maintenanceTaskName}</TableCell>
                      <TableCell>{formatDate(item.createdDate)}</TableCell>
                      <TableCell>
                        {item.status === "ACTIVE" ? (
                          <Select
                            value={item.status}
                            onChange={(event) => {
                              const newStatus = event.target.value;
                              handleStatusChange(item.maintenanceTaskId, newStatus);
                            }}
                            style={{
                              ...makeStyle(item.status),
                              borderRadius: "10px",
                              width: "125px",
                              fontSize: "10px",
                              height: "50px",
                            }}
                            // disabled={item.status}
                          >
                            {statusOptions.map((status) => (
                              <MenuItem key={status} value={status} disabled={status === item.status}>
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

                      <TableCell>{item.technicianId}</TableCell>
                      <TableCell className="Details">
                        <ButtonBase onClick={() => handleClickShow(item)}>
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
      {selectedItem && (
        <ViewTaskDetailDialog
          open={openDialog}
          handleViewClose={handleViewClose}
          token={token}
          item={selectedItem}
        />
      )}
    </Box>
  );
};

export default Task;
