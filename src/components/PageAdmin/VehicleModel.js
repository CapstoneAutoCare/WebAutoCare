import {
  Box,
  Button,
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
import { useEffect, useState } from "react";
import { makeStyle, truncateNote } from "../Booking/Booking";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../Data/Pagination";
import {
  AddBrandVehicleDialog,
  AddVehicleModelDialog,
} from "../../Data/DialogAdmin";
import { VehicleModelsGetAllList } from "../../redux/vehiclemodelsSlice";
const statusOptions = ["ACTIVE", "INACTIVE"];

const VehicleModel = () => {
  const dispatch = useDispatch();
  const { vehiclemodels, statusvehiclemodels, errorvehiclemodels } =
    useSelector((state) => state.vehiclemodels);
  const [reload, setReload] = useState(false);
  const token = localStorage.getItem("localtoken");
  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 7;
  const pageCount = Math.ceil(vehiclemodels.length / itemsPerPage);

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
    dispatch(VehicleModelsGetAllList(token));
  }, [dispatch, token, reload]);

  return (
    <Box>
      <h3>Danh Sách Loại Xe Của Từng Hãng</h3>
      <Button variant="contained" color="success" onClick={handleClickOpen}>
        Thêm Loại Xe Mới
      </Button>
      <AddVehicleModelDialog
        open={open}
        handleClose={handleClose}
        token={token}
        setReload={setReload}
      />
      {statusvehiclemodels === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}

      {statusvehiclemodels === "succeeded" &&
        vehiclemodels &&
        vehiclemodels.length > 0 && (
          <Grid>
            <TableContainer
              component={Paper}
              style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ảnh Xe </TableCell>
                    <TableCell>Mã Xe</TableCell>
                    <TableCell>Tên Hãng</TableCell>
                    <TableCell>Tên Loại Xe</TableCell>
                    <TableCell>Ngày Tạo</TableCell>
                    <TableCell>Trạng Thái</TableCell>
                    <TableCell>Chi Tiết</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehiclemodels
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((item) => (
                      <TableRow
                        key={item?.vehicleModelId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{item?.image}</TableCell>
                        <TableCell>{item?.vehicleModelId}</TableCell>
                        <TableCell>{item?.vehiclesBrandName}</TableCell>
                        <TableCell>{item?.vehicleModelName}</TableCell>
                        <TableCell>{formatDate(item?.createdDate)}</TableCell>

                        <TableCell>
                          <Select
                            value={item.status}
                            onChange={(event) => {
                              const newStatus = event.target.value;
                              handleStatusChange(
                                item.vehicleModelId,
                                newStatus
                              );
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

export default VehicleModel;
