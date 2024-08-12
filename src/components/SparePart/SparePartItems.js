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
} from "@mui/material";
import "./sparepartItems.css";
import {
  AddSparePartDialog,
  UpdateSparePartItemDialog,
  ViewSparePartItemsCostDialog,
} from "../../Data/DialogComponent";
import {
  SparePartItemsByCenterId,
  UpdateSparePartItemByCenter,
} from "../../redux/sparepartItemsSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { formatNumberWithDots } from "../MaintenanceInformations/OutlinedCard";
import { formatDate } from "../../Data/Pagination";

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

const SparePartItems = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openView, setOpenView] = useState(false);
  const itemsPerPage = 5;
  const [reload, setReload] = useState(false);

  const {
    sparepartitems = [],
    statussparepartitem,
    errorsparepartitem,
  } = useSelector((state) => state.sparepartitem);

  const centerId = localStorage.getItem("CenterId");
  const token = localStorage.getItem("localtoken");
  const { brands, statusbrands, errorbrands } = useSelector(
    (state) => state.brands
  );

  const { vehiclemodels, statusvehiclemodels, errorvehiclemodels } =
    useSelector((state) => state.vehiclemodels);
  const { schedules, statusschedules, errorschedules } = useSelector(
    (state) => state.schedules
  );

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
  const [filterBrand, setFilterBrand] = useState("");
  const [filterVehicleModel, setFilterVehicleModel] = useState("");
  const [filterName, setFilterName] = useState("");

  const filteredVehicleModels = vehiclemodels.filter(
    (model) => model.vehiclesBrandId === filterBrand
  );

  const role = localStorage.getItem("ROLE");

  const filteredsparepartslists = sparepartitems.filter((service) => {
    const statusMatch = filterStatus ? service?.status === filterStatus : true;
    const fitBrand = filterBrand
      ? service?.vehiclesBrandId === filterBrand
      : true;
    const fitVehicleModels = filterVehicleModel
      ? service?.vehicleModelId === filterVehicleModel
      : true;
    const searchName = filterName
      ? service?.sparePartsItemName
          .toLowerCase()
          .includes(filterName.toLowerCase())
      : true;
    return statusMatch && fitBrand && fitVehicleModels && searchName;
  });
  const pageCount = Math.ceil(filteredsparepartslists.length / itemsPerPage);

  useEffect(() => {
    dispatch(SparePartItemsByCenterId({ centerId, token }));
  }, [dispatch, centerId, token, reload]);
  return (
    <Box>
      <h3>Danh Sách Các Phụ Tùng Từng Xe</h3>

      {role === "CENTER" && (
        <Button variant="contained" color="success" onClick={handleClickOpen}>
          Thêm Phụ Tùng Mới
        </Button>
      )}
      <AddSparePartDialog
        open={open}
        handleClose={handleClose}
        centerId={centerId}
        token={token}
        setReload={setReload}
      />

      {statussparepartitem === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {statussparepartitem === "succeeded" &&
        sparepartitems &&
        sparepartitems.length > 0 && (
          <DialogContent dividers>
            <Box display="flex" justifyContent="space-between" mb={4}>
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
            </Box>
            <Grid>
              <TableContainer
                component={Paper}
                style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Avatar</TableCell>
                      <TableCell>Tên Phụ Tùng</TableCell>
                      <TableCell>Hãng Xe </TableCell>
                      <TableCell>Loại Xe</TableCell>
                      <TableCell>Ngày Tạo</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Chỉnh Sửa</TableCell>
                      <TableCell>Chi Tiết</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredsparepartslists.length > 0 &&
                      filteredsparepartslists
                        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                        .map((item) => (
                          <TableRow key={item.sparePartsItemId}>
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

                            <TableCell>{item.sparePartsItemName}</TableCell>
                            <TableCell>{item.vehiclesBrandName}</TableCell>
                            <TableCell>{item.vehicleModelName}</TableCell>
                            <TableCell>
                              {formatDate(item.createdDate)}
                            </TableCell>
                            <TableCell>
                              <span
                                className="status"
                                style={makeStyle(item.status)}
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
        <UpdateSparePartItemDialog
          open={openDialog}
          handleClose={handleEditClose}
          token={token}
          item={selectedItem}
          setReload={setReload}
        />
      )}
      {selectedItem && (
        <ViewSparePartItemsCostDialog
          open={openView}
          handleViewClose={handleViewClose}
          token={token}
          item={selectedItem}
        />
      )}
    </Box>
  );
};

export default SparePartItems;
