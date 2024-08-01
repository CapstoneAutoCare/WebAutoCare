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
  TextField,
  Tooltip,
} from "@mui/material";
import { formatDate } from "../../Data/Pagination";
import { MaintenanceServicesByCenterId } from "../../redux/mainserviceSlice";
import {
  AddMaintenanceServiceDialog,
  UpdateMaintenanceServiceDialog,
  ViewMaintenanceServicesCostDialog,
} from "../../Data/DialogComponent";

const makeStyle = (status) => {
  switch (status) {
    case "ACTIVE":
    case "ACCEPT":
      return { background: "rgb(145 254 159 / 47%)", color: "green" };
    case "REQUEST":
    case "INACTIVE":
      return { background: "#ffadad8f", color: "red" };
    default:
      return { background: "#59bfff", color: "white" };
  }
};
const MaintenanceServices = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openView, setOpenView] = useState(false);

  const {
    maintenanceservices = [],
    statusmaintenanceservices,
    error,
  } = useSelector((state) => state.maintenanceservice);
  const centerId = localStorage.getItem("CenterId");
  const token = localStorage.getItem("localtoken");
  const [reload, setReload] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(
      MaintenanceServicesByCenterId({ centerId: centerId, token: token })
    );
  }, [dispatch, centerId, token, reload]);

  const pageCount = Math.ceil(maintenanceservices.length / itemsPerPage);

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

  const handleEditClose = () => {
    setReload(!reload);
    setSelectedItem(null);
    setOpenDialog(false);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleViewClose = () => {
    setReload(!reload);
    setSelectedItem(null);
    setOpenView(false);
  };
  const handleClickShow = (item) => {
    setSelectedItem(item);
    setOpenView(true);
  };
  const [filterStatus, setFilterStatus] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterVehicle, setFilterVehicle] = useState("");
  const [filterOdo, setFilterOdo] = useState("");

  const filteredItems = maintenanceservices.filter((ms) => {
    return (
      (filterStatus ? ms.status === filterStatus : true) &&
      (filterName
        ? ms.maintenanceServiceName
            .toLowerCase()
            .includes(filterName.toLowerCase())
        : true) &&
      (filterBrand
        ? ms.vehiclesBrandName
            .toLowerCase()
            .includes(filterBrand.toLowerCase())
        : true) &&
      (filterVehicle
        ? ms.vehicleModelName
            .toLowerCase()
            .includes(filterVehicle.toLowerCase())
        : true)
        &&
      (filterOdo
        ? ms.maintananceScheduleName
            .toLowerCase()
            .includes(filterOdo.toLowerCase())
        : true)
    );
  });
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
        {statusmaintenanceservices === "loading" && (
          <DialogContent dividers>
            <CircularProgress />
          </DialogContent>
        )}
        {statusmaintenanceservices === "succeeded" &&
          maintenanceservices &&
          maintenanceservices.length > 0 && (
            <DialogContent dividers>
              <Box
                display="flex"
                justifyContent="space-between"
                paddingTop={"5px"}
                mb={4}
              >
                <TextField
                  label="Maintenance Service Name"
                  value={filterName}
                  onChange={(event) => setFilterName(event.target.value)}
                />
                <TextField
                  label="Vehicle Brand"
                  value={filterBrand}
                  onChange={(event) => setFilterBrand(event.target.value)}
                />
                <TextField
                  label="Vehicle Name"
                  value={filterVehicle}
                  onChange={(event) => setFilterVehicle(event.target.value)}
                />
                <TextField
                  label="Odo"
                  value={filterOdo}
                  onChange={(event) => setFilterOdo(event.target.value)}
                />
              </Box>
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
                        <TableCell>Vehicle Brand </TableCell>
                        <TableCell>Vehicle Name</TableCell>
                        <TableCell>Odo </TableCell>
                        <TableCell>Created Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Edit</TableCell>
                        <TableCell>Shows</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredItems
                        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                        .map((item) => (
                          <TableRow
                            key={item.maintenanceServiceId}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell>
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt="Item Logo"
                                  className="item-logo"
                                  style={{ width: "90px", height: "90px" }}
                                />
                              ) : (
                                <div
                                  className="no-image-placeholder"
                                  style={{ width: "90px", height: "90px" }}
                                >
                                  No Image Available
                                </div>
                              )}
                            </TableCell>
                            <TableCell>{item.maintenanceServiceName}</TableCell>
                            <TableCell>{item.vehiclesBrandName}</TableCell>
                            <TableCell>{item.vehicleModelName}</TableCell>
                            <TableCell>
                              {item.maintananceScheduleName}
                            </TableCell>
                            <TableCell>
                              {formatDate(item.createdDate)}
                            </TableCell>
                            <TableCell>
                              <span
                                className="status"
                                style={{
                                  ...makeStyle(item.status),
                                  fontSize: "12px",
                                  height: "50px",
                                }}
                              >
                                {item.status}
                              </span>
                            </TableCell>
                            <TableCell className="Details">
                              <ButtonBase onClick={() => handleEdit(item)}>
                                Edit
                              </ButtonBase>
                            </TableCell>
                            <TableCell className="Details">
                              <ButtonBase onClick={() => handleClickShow(item)}>
                                Show
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
            </DialogContent>
          )}
        {selectedItem && (
          <UpdateMaintenanceServiceDialog
            open={openDialog}
            handleClose={handleEditClose}
            token={token}
            item={selectedItem}
          />
        )}
        {selectedItem && (
          <ViewMaintenanceServicesCostDialog
            open={openView}
            handleViewClose={handleViewClose}
            token={token}
            item={selectedItem}
          />
        )}
      </Box>
    </div>
  );
};

export default MaintenanceServices;
