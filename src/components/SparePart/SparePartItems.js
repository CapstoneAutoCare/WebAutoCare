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

  useEffect(() => {
    dispatch(SparePartItemsByCenterId({ centerId, token }));
  }, [dispatch, centerId, token, reload]);

  const pageCount = Math.ceil(sparepartitems.length / itemsPerPage);

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
  const handleViewClose = () => {
    setReload(!reload);
    setSelectedItem(null);
    setOpenView(false);
  };
  const handleClickShow = (item) => {
    setSelectedItem(item);
    setOpenView(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };
  const [filterStatus, setFilterStatus] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterVehicle, setFilterVehicle] = useState("");
  const [filterOdo, setFilterOdo] = useState("");

  const filteredItems = sparepartitems.length > 0
    ? sparepartitems.filter((sparepartitem) => {
        return (
          (filterStatus ? sparepartitem.status === filterStatus : true) &&
          (filterName
            ? sparepartitem?.sparePartsItemName
                .toLowerCase()
                .includes(filterName.toLowerCase())
            : true) &&
          (filterBrand
            ? sparepartitem?.vehiclesBrandName
                .toLowerCase()
                .includes(filterBrand.toLowerCase())
            : true) &&
          (filterVehicle
            ? sparepartitem?.vehicleModelName
                .toLowerCase()
                .includes(filterVehicle.toLowerCase())
            : true) &&
          (filterOdo
            ? sparepartitem?.maintananceScheduleName
                .toLowerCase()
                .includes(filterOdo.toLowerCase())
            : true)
        );
      })
    : [];

  return (
    <Box>
      <h3>Danh Sách Các Phụ Tùng Từng Xe</h3>
      <Button variant="contained" color="success" onClick={handleClickOpen}>
        Thêm Phụ Tùng Mới
      </Button>
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
            <Box
              display="flex"
              justifyContent="space-between"
              paddingTop={"5px"}
              mb={4}
            >
              <TextField
                label="Tên Phụ Tùng"
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
                label="Odo"
                value={filterOdo}
                onChange={(event) => setFilterOdo(event.target.value)}
              />
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
                      <TableCell>Odo </TableCell>
                      <TableCell>Ngày Tạo</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Chỉnh Sửa</TableCell>
                      <TableCell>Chi Tiết</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredItems.length > 0 &&
                      filteredItems
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
                              {formatNumberWithDots(item.maintananceScheduleName)}
                            </TableCell>
                            <TableCell>{item.createdDate}</TableCell>
                            <TableCell>
                              <span
                                className="status"
                                style={makeStyle(item.status)}
                              >
                                {item.status}
                              </span>
                            </TableCell>
                            <TableCell className="Details">
                              <Button onClick={() => handleEdit(item)} variant="contained" color="success">
                                Chỉnh Sửa
                              </Button>
                            </TableCell>
                            <TableCell className="Details">
                              <Button onClick={() => handleClickShow(item)} variant="contained" color="success">
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
