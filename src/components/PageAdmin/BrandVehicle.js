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
import { ScheduleListGetall } from "../../redux/scheduleSlice";
import { formatDate } from "../../Data/Pagination";
import { BrandGetAllList } from "../../redux/brandSlice";
import { AddBrandVehicleDialog } from "../../Data/DialogAdmin";
import Navbar from "../Navbar";
const statusOptions = ["ACTIVE", "INACTIVE"];

const BrandVehicle = () => {
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);
  const token = localStorage.getItem("localtoken");
  const { brands, statusbrands, errorbrands } = useSelector(
    (state) => state.brands
  );
  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const pageCount = Math.ceil(brands.length / itemsPerPage);
  const [filterStatus, setFilterStatus] = useState("");

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
    // dispatch(ScheduleListGetall(token));
    dispatch(BrandGetAllList(token));
  }, [dispatch, token, reload]);

  return (
    <Box>
      <Navbar />

      <h3>Danh Sách Các Hãng Xe</h3>
      <Button variant="contained" color="success" onClick={handleClickOpen}>
        Thêm Hãng Mới Cho Xe
      </Button>
      <AddBrandVehicleDialog
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
      </Box>

      {statusbrands === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {statusbrands === "succeeded" && brands && brands.length > 0 && (
        <Grid>
          <TableContainer
            component={Paper}
            style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ảnh</TableCell>
                  <TableCell>Tên Hãng</TableCell>
                  <TableCell>Ngày Tạo</TableCell>
                  <TableCell>Mô Tả</TableCell>
                  {/* <TableCell>Trạng Thái</TableCell> */}
                  {/* <TableCell>Chi Tiết</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {brands
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((item) => (
                    <TableRow
                      key={item?.vehiclesBrandId}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>
                        {item.logo ? (
                          <img
                            src={item.logo}
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
                      <TableCell>{item?.vehiclesBrandName}</TableCell>
                      <TableCell>{formatDate(item?.createdDate)}</TableCell>
                      <TableCell>{item?.vehiclesBrandDescription}</TableCell>
                      {/* <TableCell>
                        <span
                          className="status"
                          style={{ ...makeStyle(item.status) }}
                        >
                          {item.status}
                        </span>
                      </TableCell> */}
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
    </Box>
  );
};

export default BrandVehicle;
