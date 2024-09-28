import {
  Box,
  Button,
  CircularProgress,
  DialogContent,
  Grid,
  MenuItem,
  Pagination,
  Paper,
  Rating,
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
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyle, truncateNote } from "../Booking/Booking";
import { ServicesListGetAll } from "../../redux/servicesSlice";
import { formatNumberWithDots } from "../MaintenanceInformations/OutlinedCard";
import { formatDate } from "../../Data/Pagination";
import {
  AddScheduleDialog,
  AddServiceDialog,
  AddVehicleModelDialog,
  UpdateServiceDialog,
} from "../../Data/DialogAdmin";
import Navbar from "../Navbar";
const statusOptions = ["ACTIVE", "INACTIVE"];

const ServiceCare = () => {
  const dispatch = useDispatch();
  const { services, statusservices } = useSelector((state) => state.services);
  const [reload, setReload] = useState(false);

  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openView, setOpenView] = useState(false);
  const token = localStorage.getItem("localtoken");
  const { brands, statusbrands, errorbrands } = useSelector(
    (state) => state.brands
  );
  const { vehiclemodels, statusvehiclemodels, errorvehiclemodels } =
    useSelector((state) => state.vehiclemodels);
  const { schedules, statusschedules, errorschedules } = useSelector(
    (state) => state.schedules
  );
  const { plans, statusplans, errorplans } = useSelector(
    (state) => state.plans
  );
  const itemsPerPage = 5;

  const [filterStatus, setFilterStatus] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterVehicleModel, setFilterVehicleModel] = useState("");
  const [filterPlans, setFilterPlans] = useState("");
  const [filterSchedule, setFilterSchedule] = useState("");
  const [filterName, setFilterName] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleStatusChange = async (maintenanceCenterId, newStatus) => {
    try {
      //   await dispatch(
      //     PatchStatusBookingByCenter({ maintenanceCenterId, status: newStatus, token })
      //   );
      //   dispatch(BookingByCenter({ token: token, id: maintenanceCenterId }));
      setReload(true);
    } catch (error) {
      // console.error("Error updating status:", errors);
    }
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

  const filteredVehicleModels = vehiclemodels.filter(
    (model) => model.vehiclesBrandId === filterBrand
  );


  const filteredSchedule = schedules.filter(
    (model) => model.maintenancePlanId === filterPlans
  );
  const filteredPlans = plans.filter(
    (model) => model.reponseVehicleModels.vehicleModelId === filterVehicleModel

  );


  const filteredservicelists = services.filter((service) => {
    const serviceName = service.serviceCareName
      ? service.serviceCareName.toLowerCase()
      : "";
    const statusMatch = filterStatus ? service.status === filterStatus : true;

    const fitBrand = filterBrand
      ? service.reponseVehicleModel.vehiclesBrandId === filterBrand
      : true;
    const fitVehicleModels = filterVehicleModel
      ? service.reponseVehicleModel.vehicleModelId === filterVehicleModel
      : true;

    const fitPlan = filterPlans
      ? service.maintenancePlanId === filterPlans
      : true;

    const fitschedule = filterSchedule
      ? service.maintananceScheduleId === filterSchedule
      : true;
    return (
      fitPlan &&
      statusMatch &&
      fitBrand &&
      fitVehicleModels &&
      fitschedule &&
      (!filterName || serviceName.includes(filterName.toLowerCase()))
    );
  });
  const pageCount = Math.ceil(filteredservicelists.length / itemsPerPage);

  useEffect(() => {
    dispatch(ServicesListGetAll(token));
  }, [dispatch, token, reload]);
  return (
    <Box>
      <Navbar />

      <h3>Danh Sách Dịch Vụ Bảo Dưỡng Của Gói Theo Từng Odo Và Từng Xe</h3>
      <Button variant="contained" color="success" onClick={handleClickOpen}>
        Thêm Dịch Vụ Gói Mới
      </Button>
      <AddServiceDialog
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
            <MenuItem key={brand.vehiclesBrandId} value={brand.vehiclesBrandId}>
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
            <MenuItem key={model.vehicleModelId} value={model.vehicleModelId}>
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
              {formatNumberWithDots(schedule.maintananceScheduleName)} Km
            </MenuItem>
          ))}
        </Select>
      </Box>
      {statusservices === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {statusservices === "succeeded" &&
        filteredservicelists &&
        services.length > 0 && (
          <Grid>
            <TableContainer
              component={Paper}
              style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Avatar </TableCell>
                    <TableCell>Tên Dịch Vụ</TableCell>
                    <TableCell>Loại</TableCell>
                    <TableCell>Hãng Xe</TableCell>
                    <TableCell>Loại Xe</TableCell>
                    <TableCell>Ngày Tạo</TableCell>
                    <TableCell>Mô Tả</TableCell>
                    <TableCell>Cấp Bậc Bảo Dưỡng</TableCell>
                    <TableCell>Odo</TableCell>
                    <TableCell>Giá</TableCell>
                    <TableCell>Trạng Thái</TableCell>
                    <TableCell>Chỉnh Sửa</TableCell>
                    {/* <TableCell>Chi Tiết</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredservicelists
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((item) => (
                      <TableRow
                        key={item?.serviceCareId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        {/* <TableCell>{item?.serviceCareId}</TableCell> */}
                        <TableCell>
                          {item.image ? (
                            <img
                              src={item.image}
                              alt="Item Logo"
                              className="item-logo"
                              style={{ width: "80px", height: "80px" }}
                            />
                          ) : (
                            <div
                              className="no-image-placeholder"
                              style={{ width: "80px", height: "80px" }}
                            >
                              No Image Available
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title={item?.serviceCareName} arrow>
                            <span>{truncateNote(item?.serviceCareName)}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={item?.serviceCareType} arrow>
                            <span>{truncateNote(item?.serviceCareType)}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {item?.reponseVehicleModel.vehiclesBrandName}
                        </TableCell>
                        <TableCell>
                          {item?.reponseVehicleModel.vehicleModelName}
                        </TableCell>
                        <TableCell>{formatDate(item?.createdDate)}</TableCell>
                        <TableCell>
                          <Tooltip title={item?.serviceCareDescription} arrow>
                            <span>
                              {truncateNote(item?.serviceCareDescription)}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={item?.maintenancePlanName} arrow>
                            <span>{truncateNote(item?.maintenancePlanName)}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {formatNumberWithDots(item?.maintananceScheduleName)}{" "}
                          Km
                        </TableCell>
                        <TableCell
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {formatNumberWithDots(item.originalPrice)} VND
                        </TableCell>
                        <TableCell>
                          {/* <Select
                            value={item.status}
                            onChange={(event) => {
                              const newStatus = event.target.value;
                              handleStatusChange(item.bookingId, newStatus);
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
                            style={{ ...makeStyle(item.status) }}
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
                        {/* <TableCell className="Details">
                          <Button
                            // onClick={() => handleClickOpen(item)}
                            variant="contained"
                            color="success"
                          >
                            Hiển Thị
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
      {selectedItem && (
        <UpdateServiceDialog
          open={openDialog}
          handleClose={handleEditClose}
          token={token}
          item={selectedItem}
          setReload={setReload}
        />
      )}
    </Box>
  );
};

export default ServiceCare;
