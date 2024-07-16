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

const SparePartItems = ({ setShowRightSide }) => {
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
  return (
    <Box>
      <h3>List Spare Part Items</h3>
      <Button variant="contained" color="success" onClick={handleClickOpen}>
        Add Spare Part Items
      </Button>
      <AddSparePartDialog
        open={open}
        handleClose={handleClose}
        centerId={centerId}
        token={token}
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
            <Grid>
              <TableContainer
                component={Paper}
                style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Avatar</TableCell>
                      <TableCell>Spare Part Name</TableCell>
                      <TableCell>Created Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Edit</TableCell>
                      <TableCell>Shows</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sparepartitems
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
                            <ButtonBase onClick={() => handleEdit(item)}>
                              Edit
                            </ButtonBase>
                          </TableCell>
                          <TableCell className="Details">
                            <ButtonBase onClick={() => handleClickShow(item)}>
                              Show
                            </ButtonBase>
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
