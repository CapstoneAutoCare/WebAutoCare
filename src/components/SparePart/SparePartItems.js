import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  ButtonBase,
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
import { AddSparePartDialog } from "../../Data/DialogComponent";
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

const statusOptions = ["ACTIVE", "INACTIVE", "ACCEPT", "REQUEST"];

const SparePartItems = ({ setShowRightSide }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [editingItem, setEditingItem] = useState(null); // Define editingItem state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsPerPage = 5;

  const { sparepartitems = [] } = useSelector((state) => state.sparepartitem);

  const centerId = localStorage.getItem("CenterId");
  const token = localStorage.getItem("localtoken");

  useEffect(() => {
    dispatch(SparePartItemsByCenterId({ centerId, token }));
  }, [dispatch, centerId, token]);

  const pageCount = Math.ceil(sparepartitems.length / itemsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickShow = () => {
    setShowRightSide((prev) => !prev);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
    console.log("Selected Item: ", item);
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
                        />
                      ) : (
                        <div className="no-image-placeholder">
                          No Image Available
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{item.sparePartsItemName}</TableCell>
                    <TableCell>{item.createdDate}</TableCell>
                    <TableCell>
                      <Select
                        value={item.status}
                        // onChange={(event) => {
                        //   const newStatus = event.target.value;
                        //   handleStatusChange(item.sparePartsItemId, newStatus);
                        // }}
                        className="status"
                        style={{
                          ...makeStyle(item.status),
                          borderRadius: "10px",
                          width: "121px",
                          fontSize: "12px",
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
                      <ButtonBase onClick={() => handleEdit(item)}>
                        Edit
                      </ButtonBase>
                    </TableCell>
                    <TableCell className="Details">
                      <ButtonBase onClick={handleClickShow}>Show</ButtonBase>
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
    </Box>
  );
};

export default SparePartItems;
