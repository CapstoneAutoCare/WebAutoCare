import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  ButtonBase,
  Grid,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { MaintenanceInformationsByCenterId } from "../../redux/maintenanceInformationsSlice";
import { MaintenanceInformationsDetailDialog } from "../../Data/DialogComponent";

const MaintenanceInformations = () => {
  const dispatch = useDispatch();
  const centerId = localStorage.getItem("CenterId");
  const token = localStorage.getItem("localtoken");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { maintenanceInformations = [] } = useSelector(
    (state) => state.maintenanceInformation
  );
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const pageCount = Math.ceil(maintenanceInformations.length / itemsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickOpen = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
    console.log("Selected Item: ", item);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    dispatch(MaintenanceInformationsByCenterId({ centerId, token }));
  }, [dispatch, centerId, token]);

  return (
    <Box>
      <h3>List Maintenance Informations</h3>
      <Button variant="contained" color="success">
        Add Maintenance Informations
      </Button>

      <Grid>
        <TableContainer
          component={Paper}
          style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>InformationMaintenance Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Created Date</TableCell>
                <TableCell>Finished Date</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maintenanceInformations
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((item) => (
                  <TableRow key={item.informationMaintenanceId}>
                    <TableCell>{item.informationMaintenanceId}</TableCell>
                    <TableCell>{item.informationMaintenanceName}</TableCell>
                    <TableCell>{item.createdDate}</TableCell>
                    <TableCell>{item.finishedDate}</TableCell>
                    <TableCell
                      style={{
                        borderRadius: "10px",
                        fontSize: "25px",
                      }}
                    >
                      {item.totalPrice} VND
                    </TableCell>
                    <TableCell>{item.note}</TableCell>
                    <TableCell className="Details">
                      <ButtonBase onClick={() => handleClickOpen(item)}>
                        SHOW
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

      {selectedItem && (
        <MaintenanceInformationsDetailDialog
          open={openDialog}
          handleClose={handleClose}
          token={token}
          item={selectedItem}
        />
      )}
    </Box>
  );
};

export default MaintenanceInformations;
