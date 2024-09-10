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
import { AddMaintenanceServiceDialogOutSide } from "../../Data/DialogAdmin";
import { VehiclesMaintenancesByCenter } from "../../redux/vehiclemainSlice";
import { useSnackbar } from "../../Data/SnackbarProvider";

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
  const [openOutSide, setOpenOutSide] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openView, setOpenView] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { plans, statusplans, errorplans } = useSelector(
    (state) => state.plans
  );
  const {
    maintenanceservices = [],
    statusmaintenanceservices,
    error,
  } = useSelector((state) => state.maintenanceservice);

  const { brands, statusbrands, errorbrands } = useSelector(
    (state) => state.brands
  );
  const { vehiclemodels, statusvehiclemodels, errorvehiclemodels } =
    useSelector((state) => state.vehiclemodels);
  const { schedules, statusschedules, errorschedules } = useSelector(
    (state) => state.schedules
  );
  const centerId = localStorage.getItem("CenterId");
  const token = localStorage.getItem("localtoken");
  const [reload, setReload] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleClickOpen = () => {
    setOpen(true);
    setOpenOutSide(false);
  };

  const handleClose = () => {
    setOpen(false);
    setReload(!reload);
  };

  const handleClickOpenOutside = () => {
    setOpenOutSide(true);
    setOpen(false);
  };

  const handleCloseOutSide = () => {
    setOpenOutSide(false);
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
  const [filterPlans, setFilterPlans] = useState("");

  const [filterStatus, setFilterStatus] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterVehicleModel, setFilterVehicleModel] = useState("");
  const [filterSchedule, setFilterSchedule] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterBoolean, setFilterBoolean] = useState("");

  const filteredVehicleModels = vehiclemodels.filter(
    (model) => model.vehiclesBrandId === filterBrand
  );

  const filteredPlans = plans.filter(
    (model) => model.reponseVehicleModels.vehicleModelId === filterVehicleModel
  );
  const filteredSchedule = schedules.filter(
    (model) => model.maintenancePlanId === filterPlans
  );


  const filteredservicelists = maintenanceservices.filter((service) => {
    const serviceName = service.maintenanceServiceName
      ? service.maintenanceServiceName.toLowerCase()
      : "";
    const statusMatch = filterStatus ? service.status === filterStatus : true;
    const fitBrand = filterBrand
      ? service.vehiclesBrandId === filterBrand
      : true;
    const fitVehicleModels = filterVehicleModel
      ? service.vehicleModelId === filterVehicleModel
      : true;
    const fitPlan = filterPlans
      ? service.maintenancePlanId === filterPlans
      : true;

    const fitschedule = filterSchedule
      ? service.maintananceScheduleId === filterSchedule
      : true;

    const booleanCondition =
      filterBoolean === "" ||
      (filterBoolean === "Có Gói" && service.boolean) ||
      (filterBoolean === "Không Có Gói" && !service.boolean);
    return (
      fitPlan &&
      booleanCondition &&
      statusMatch &&
      fitBrand &&
      fitVehicleModels &&
      fitschedule &&
      (!filterName || serviceName.includes(filterName.toLowerCase()))
    );
  });
  const pageCount = Math.ceil(filteredservicelists.length / itemsPerPage);

  const role = localStorage.getItem("ROLE");
  useEffect(() => {
    dispatch(MaintenanceServicesByCenterId({ centerId, token }));
    dispatch(VehiclesMaintenancesByCenter(centerId));

  }, [dispatch, centerId, token, reload]);
  return (
    <div>
      <Box>
        <h3>Danh Sách Các Dịch Vụ Từng Xe</h3>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {role === "CENTER" && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={handleClickOpen}
                className="chon-goi"
              >
                Thêm Dịch Vụ Trong Gói
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleClickOpenOutside}
                className="Ben-ngoai"
              >
                Thêm Dịch Vụ Ngoài
              </Button>
            </>
          )}
        </div>

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
                <Select
                  value={filterBrand}
                  onChange={(event) => {
                    setFilterBrand(event.target.value);
                    setFilterVehicleModel("");
                    setFilterSchedule("");
                    setFilterPlans("");

                  }}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Hãng Xe</em>
                  </MenuItem>
                  {brands.map((brand) => (
                    <MenuItem
                      key={brand.vehiclesBrandId}
                      value={brand.vehiclesBrandId}
                    >
                      {brand.vehiclesBrandName}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={filterVehicleModel}
                  onChange={(event) => {
                    setFilterVehicleModel(event.target.value);
                    setFilterSchedule("");
                    setFilterPlans("");
                  }}
                  displayEmpty
                  disabled={!filterBrand}
                >
                  <MenuItem value="">
                    <em>Loại Xe</em>
                  </MenuItem>
                  {filteredVehicleModels.map((model) => (
                    <MenuItem
                      key={model.vehicleModelId}
                      value={model.vehicleModelId}
                    >
                      {model.vehicleModelName}
                    </MenuItem>
                  ))}
                </Select>

                <Select
                  value={filterPlans}
                  onChange={(event) => {
                    setFilterPlans(event.target.value);
                    setFilterSchedule("");

                  }}
                  displayEmpty
                  disabled={!filterVehicleModel}
                >
                  <MenuItem value="">
                    <em>Gói Cấp Độ</em>
                  </MenuItem>
                  {filteredPlans.map((model) => (
                    <MenuItem key={model.maintenancePlanId} value={model.maintenancePlanId}>
                      {model.maintenancePlanName}
                    </MenuItem>
                  ))}
                </Select>

                <Select
                  value={filterSchedule}
                  onChange={(event) => setFilterSchedule(event.target.value)}
                  displayEmpty
                  disabled={!filterPlans}
                >
                  <MenuItem value="">
                    <em>Gói Odo Km</em>
                  </MenuItem>
                  {filteredSchedule.map((schedule) => (
                    <MenuItem
                      key={schedule.maintananceScheduleId}
                      value={schedule.maintananceScheduleId}
                    >
                      {formatNumberWithDots(schedule.maintananceScheduleName)}{" "}
                      Km
                    </MenuItem>
                  ))}
                </Select>
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
                        {role === "CENTER" && (
                          <TableCell>Chỉnh Sửa</TableCell>
                        )}
                        <TableCell>Chi Tiết</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredservicelists
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
                            {role === "CENTER" && (
                              <TableCell className="Details">
                                <Button
                                  onClick={() => handleEdit(item)}
                                  variant="contained"
                                  color="success"
                                >
                                  Chỉnh Sửa
                                </Button>
                              </TableCell>
                            )}

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
        <AddMaintenanceServiceDialogOutSide
          openView={openOutSide}
          handleCloseOutSide={handleCloseOutSide}
          centerId={centerId}
          token={token}
          setReload={setReload}
        />
      </Box>
    </div>
  );
};

export default MaintenanceServices;
