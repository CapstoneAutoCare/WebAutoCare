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
import { formatNumberWithDots } from "../MaintenanceInformations/OutlinedCard";

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
const statusOptions = ["ACTIVE", "INACTIVE"];
const totalpackage = ["Có Gói", "Không Có Gói"];
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
  const [filterBoolean, setFilterBoolean] = useState("");

  const filteredItems = maintenanceservices.filter((ms) => {
    const serviceName = ms.maintenanceServiceName
      ? ms.maintenanceServiceName.toLowerCase()
      : "";
    const brandName = ms.vehiclesBrandName
      ? ms.vehiclesBrandName.toLowerCase()
      : "";
    const vehicleModelName = ms.vehicleModelName
      ? ms.vehicleModelName.toLowerCase()
      : "";
    const odoName = ms.maintananceScheduleName
      ? ms.maintananceScheduleName.toLowerCase()
      : "";
    const booleanCondition =
      filterBoolean === "" ||
      (filterBoolean === "Có Gói" && ms.boolean) ||
      (filterBoolean === "Không Có Gói" && !ms.boolean);

    return (
      booleanCondition &&
      (!filterStatus || ms.status === filterStatus) &&
      (!filterName || serviceName.includes(filterName.toLowerCase())) &&
      (!filterBrand || brandName.includes(filterBrand.toLowerCase())) &&
      (!filterVehicle ||
        vehicleModelName.includes(filterVehicle.toLowerCase())) &&
      (!filterOdo || odoName.includes(filterOdo.toLowerCase()))
    );
  });
  const role = localStorage.getItem("ROLE");
  useEffect(() => {
    dispatch(MaintenanceServicesByCenterId({ centerId, token }));
  }, [dispatch, centerId, token, reload]);
  return (
    <div>
      <Box>
        <h3>Danh Sách Các Dịch Vụ Từng Xe</h3>
        {role === "CENTER" && (
          <Button variant="contained" color="success" onClick={handleClickOpen}>
            Thêm Dịch Mới Cho Xe
          </Button>
        )}

        <AddMaintenanceServiceDialog
          open={open}
          handleClose={handleClose}
          centerId={centerId}
          token={token}
          setReload={setReload}
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
                mb={6}
              >
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
                <Select
                  value={filterBoolean}
                  onChange={(event) => setFilterBoolean(event.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Tất Cả</em>
                  </MenuItem>
                  {totalpackage.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  label="Tên Dịch Vụ"
                  value={filterName}
                  onChange={(event) => setFilterName(event.target.value)}
                />
                <TextField
                  label="Hãng Xe"
                  value={filterBrand}
                  onChange={(event) => setFilterBrand(event.target.value)}
                />
                <TextField
                  label="Loại Xe"
                  value={filterVehicle}
                  onChange={(event) => setFilterVehicle(event.target.value)}
                />
                <TextField
                  label="Gói Odo Xe"
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
                        <TableCell>Tên Dịch Vụ </TableCell>
                        <TableCell>Hãng Xe </TableCell>
                        <TableCell>Loại Xe</TableCell>
                        <TableCell>Odo </TableCell>
                        <TableCell>Ngày Tạo</TableCell>
                        <TableCell>Gói</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Chỉnh Sửa</TableCell>
                        <TableCell>Chi Tiết</TableCell>
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
                              {item?.maintananceScheduleName === "0"
                                ? ""
                                : formatNumberWithDots(
                                    item?.maintananceScheduleName
                                  )}
                            </TableCell>
                            <TableCell>
                              {formatDate(item.createdDate)}
                            </TableCell>
                            <TableCell>
                              {item.boolean ? "Có Gói" : "Không Có Gói"}
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
                              <Button
                                onClick={() => handleEdit(item)}
                                variant="contained"
                                color="success"
                              >
                                Chỉnh Sửa
                              </Button>
                            </TableCell>
                            <TableCell className="Details">
                              <Button
                                onClick={() => handleClickShow(item)}
                                variant="contained"
                                color="success"
                              >
                                Hiển Thị
                              </Button>
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
