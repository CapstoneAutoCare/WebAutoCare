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
import { formatNumberWithDots } from "../MaintenanceInformations/OutlinedCard";
import { formatDate } from "../../Data/Pagination";
import {
  AddSparePartDialog,
  UpdateSparePartDialog,
} from "../../Data/DialogAdmin";
import { SparePartsAll } from "../../redux/sparepartsSlice";
import Navbar from "../Navbar";
const statusOptions = ["ACTIVE", "INACTIVE"];

const SparePart = () => {
  const dispatch = useDispatch();
  const { spareparts, statussparepart } = useSelector(
    (state) => state.spareparts
  );
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openView, setOpenView] = useState(false);
  const { brands, statusbrands, errorbrands } = useSelector(
    (state) => state.brands
  );

  const { vehiclemodels, statusvehiclemodels, errorvehiclemodels } =
    useSelector((state) => state.vehiclemodels);
  const { schedules, statusschedules, errorschedules } = useSelector(
    (state) => state.schedules
  );
  const [reload, setReload] = useState(false);
  const token = localStorage.getItem("localtoken");

  const itemsPerPage = 5;
  const pageCount = Math.ceil(spareparts.length / itemsPerPage);

  const [filterStatus, setFilterStatus] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterVehicleModel, setFilterVehicleModel] = useState("");
  const [filterName, setFilterName] = useState("");

  const filteredVehicleModels = vehiclemodels?.filter(
    (model) => model?.vehiclesBrandId === filterBrand
  );

  const filteredsparepartslists = spareparts?.filter((service) => {
    const statusMatch = filterStatus ? service.status === filterStatus : true;
    const fitBrand = filterBrand
      ? service?.reponseVehicleModel?.vehiclesBrandId === filterBrand
      : true;
    const fitVehicleModels = filterVehicleModel
      ? service?.reponseVehicleModel?.vehicleModelId === filterVehicleModel
      : true;
    const searchName = filterName
      ? service?.sparePartName?.toLowerCase().includes(filterName?.toLowerCase())
      : true;
    return statusMatch && fitBrand && fitVehicleModels && searchName;
  });
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
    dispatch(SparePartsAll(token));
  }, [dispatch, token, reload]);
  return (
    <Box>
      <Navbar />

      <h3>Danh Sách Phụ Tùng Của Từng Xe</h3>

      <Button variant="contained" color="success" onClick={handleClickOpen}>
        Thêm Phụ Tùng Mới Của Xe Cho Hãng
      </Button>
      <AddSparePartDialog
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
          label="Tên Phụ Tùng"
          value={filterName}
          onChange={(event) => setFilterName(event.target.value)}
        />
        <Select
          value={filterBrand}
          onChange={(event) => {
            setFilterBrand(event.target.value);
            setFilterVehicleModel("");
          }}
          displayEmpty
        >
          <MenuItem value="">
            <em>Hãng Xe</em>
          </MenuItem>
          {brands.map((brand) => (
            <MenuItem key={brand?.vehiclesBrandId} value={brand?.vehiclesBrandId}>
              {brand?.vehiclesBrandName}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={filterVehicleModel}
          onChange={(event) => {
            setFilterVehicleModel(event.target.value);
          }}
          displayEmpty
          disabled={!filterBrand}
        >
          <MenuItem value="">
            <em>Loại Xe</em>
          </MenuItem>
          {filteredVehicleModels.map((model) => (
            <MenuItem key={model?.vehicleModelId} value={model?.vehicleModelId}>
              {model?.vehicleModelName}
            </MenuItem>
          ))}
        </Select>
      </Box>
      {statussparepart === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {statussparepart === "succeeded" &&
        filteredsparepartslists &&
        spareparts.length > 0 && (
          <Grid>
            <TableContainer
              component={Paper}
              style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell>Mã Phụ Tùng </TableCell> */}
                    <TableCell>Ảnh</TableCell>
                    <TableCell>Tên Phụ Tùng</TableCell>
                    <TableCell>Loại </TableCell>
                    <TableCell>Hãng Xe</TableCell>
                    <TableCell>Loại Xe</TableCell>
                    <TableCell>Ngày Tạo</TableCell>
                    <TableCell>Mô Tả</TableCell>
                    <TableCell>Giá Tiền</TableCell>
                    <TableCell>Trạng Thái</TableCell>
                    <TableCell>Chỉnh Sửa</TableCell>

                    {/* <TableCell>Chi Tiết</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredsparepartslists
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((item) => (
                      <TableRow
                        key={item?.sparePartId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        {/* <TableCell>{item?.sparePartId}</TableCell> */}
                        <TableCell>
                          {item?.image ? (
                            <img
                              src={item?.image}
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
                        <TableCell>{item?.sparePartName}</TableCell>
                        <TableCell>
                          <Tooltip title={item?.sparePartType} arrow>
                            <span>{truncateNote(item?.sparePartType)}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {item?.reponseVehicleModel?.vehiclesBrandName}
                        </TableCell>
                        <TableCell>
                          {item?.reponseVehicleModel?.vehicleModelName}
                        </TableCell>
                        <TableCell>{formatDate(item?.createdDate)}</TableCell>
                        <TableCell>
                          <Tooltip title={item?.sparePartDescription} arrow>
                            <span>
                              {truncateNote(item?.sparePartDescription)}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {formatNumberWithDots(item?.originalPrice)} VND
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
        <UpdateSparePartDialog
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

export default SparePart;
