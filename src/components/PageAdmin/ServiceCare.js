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
} from "../../Data/DialogAdmin";
const statusOptions = ["ACTIVE", "INACTIVE"];

const ServiceCare = () => {
  const dispatch = useDispatch();
  const { services, statusservices } = useSelector((state) => state.services);
  const [reload, setReload] = useState(false);
  const token = localStorage.getItem("localtoken");
  const { brands, statusbrands, errorbrands } = useSelector(
    (state) => state.brands
  );
  const [open, setOpen] = useState(false);

  const { vehiclemodels, statusvehiclemodels, errorvehiclemodels } =
    useSelector((state) => state.vehiclemodels);
  const { schedules, statusschedules, errorschedules } = useSelector(
    (state) => state.schedules
  );
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const pageCount = Math.ceil(services.length / itemsPerPage);

  const [filterStatus, setFilterStatus] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterVehicleModel, setFilterVehicleModel] = useState("");
  const [filterSchedule, setFilterSchedule] = useState("");
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

  const filteredVehicleModels = vehiclemodels.filter(
    (model) => model.vehiclesBrandId === filterBrand
  );
  const filteredSchedule = schedules.filter(
    (model) => model.vehicleModelId === filterVehicleModel
  );
  const filteredservicelists = services.filter((service) => {
    const statusMatch = filterStatus ? service.status === filterStatus : true;
    const fitBrand = filterBrand
      ? service.reponseVehicleModel.vehiclesBrandId === filterBrand
      : true;
    const fitVehicleModels = filterVehicleModel
      ? service.reponseVehicleModel.vehicleModelId === filterVehicleModel
      : true;
    const fitschedule = filterSchedule
      ? service.maintananceScheduleId === filterSchedule
      : true;
    return statusMatch && fitBrand && fitVehicleModels && fitschedule;
  });
  useEffect(() => {
    dispatch(ServicesListGetAll(token));
  }, [dispatch, token, reload]);
  return (
    <Box>
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

        <Select
          value={filterBrand}
          onChange={(event) => {
            setFilterBrand(event.target.value);
            setFilterVehicleModel("");
            setFilterSchedule("");
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
          value={filterSchedule}
          onChange={(event) => setFilterSchedule(event.target.value)}
          displayEmpty
          disabled={!filterVehicleModel}
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
                    <TableCell>Mã Dịch Vụ </TableCell>
                    <TableCell>Tên Dịch Vụ</TableCell>
                    <TableCell>Loại Dịch Vụ</TableCell>
                    <TableCell>Ngày Tạo</TableCell>
                    <TableCell>Mô Tả</TableCell>
                    <TableCell>Odo</TableCell>

                    <TableCell>Giá</TableCell>
                    <TableCell>Trạng Thái</TableCell>
                    <TableCell>Chi Tiết</TableCell>
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
                        <TableCell>{item?.serviceCareId}</TableCell>

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
                        <TableCell>{formatDate(item?.createdDate)}</TableCell>
                        <TableCell>
                          <Tooltip title={item?.serviceCareDescription} arrow>
                            <span>
                              {truncateNote(item?.serviceCareDescription)}
                            </span>
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
                          <Select
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
                          </Select>
                        </TableCell>
                        <TableCell className="Details">
                          <Button
                            // onClick={() => handleClickOpen(item)}
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
              style={{ marginTop: "20px", paddingBottom: "30px" }}
            />
          </Grid>
        )}
    </Box>
  );
};

export default ServiceCare;
