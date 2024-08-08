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
const statusOptions = ["ACTIVE", "INACTIVE"];

const ServiceCare = () => {
  const dispatch = useDispatch();
  const { services, statusservices } = useSelector((state) => state.services);
  const [reload, setReload] = useState(false);
  const token = localStorage.getItem("localtoken");

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const pageCount = Math.ceil(services.length / itemsPerPage);

  const [filterStatus, setFilterStatus] = useState("");
  const [filterVehicle, setFilterVehicle] = useState("");
  const [filterLicensePlate, setFilterLicensePlate] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterPhone, setFilterPhone] = useState("");

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

  useEffect(() => {
    dispatch(ServicesListGetAll(token));
  }, [dispatch, token, reload]);

  // const filteredcenterlists = schedules.filter((center) => {
  //   const statusMatch = filterStatus ? center.status === filterStatus : true;
  //   const vehicleMatch = filterVehicle
  //     ? center.responseVehicles?.vehicleModelName
  //         .toLowerCase()
  //         .includes(filterVehicle.toLowerCase())
  //     : true;
  //   const licensePlateMatch = filterLicensePlate
  //     ? center.responseVehicles?.licensePlate
  //         .toLowerCase()
  //         .includes(filterLicensePlate.toLowerCase())
  //     : true;
  //   const districtMatch = filterDistrict
  //     ? center.district?.toLowerCase().includes(filterDistrict.toLowerCase())
  //     : true;
  //   const cityMatch = filterCity
  //     ? center.city?.toLowerCase().includes(filterCity.toLowerCase())
  //     : true;
  //   const phoneMatch = filterPhone
  //     ? center.phone?.toLowerCase().includes(filterPhone.toLowerCase())
  //     : true;

  //   return (
  //     statusMatch &&
  //     vehicleMatch &&
  //     licensePlateMatch &&
  //     districtMatch &&
  //     cityMatch &&
  //     phoneMatch
  //   );
  // });

  return (
    <Box>
      <h3>Danh Sách Trung Tâm</h3>
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
          label="Quận"
          value={filterDistrict}
          onChange={(event) => setFilterDistrict(event.target.value)}
        />
        <TextField
          label="Thành Phố"
          value={filterCity}
          onChange={(event) => setFilterCity(event.target.value)}
        />
        <TextField
          label="Số Điện Thoại"
          value={filterPhone}
          onChange={(event) => setFilterPhone(event.target.value)}
        />
      </Box>
      {statusservices === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {statusservices === "succeeded" && services && services.length > 0 && (
        <Grid>
          <TableContainer
            component={Paper}
            style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã Dịch Vụ </TableCell>
                  <TableCell>Mã Odo</TableCell>
                  <TableCell>Tên Odo</TableCell>
                  <TableCell>Tên Dịch Vụ</TableCell>
                  <TableCell>Loại Dịch Vụ</TableCell>
                  <TableCell>Mô Tả</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                  <TableCell>Chi Tiết</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((item) => (
                    <TableRow
                      key={item?.serviceCareId}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>{item?.serviceCareId}</TableCell>
                      <TableCell>{item?.maintananceScheduleId}</TableCell>
                      <TableCell>{item?.maintananceScheduleName}</TableCell>
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
