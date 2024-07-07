import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  AddSparePartItemsByCenter,
  SparePartItemsByCenterId,
} from "../redux/sparepartItemsSlice";
import {
  AddMaintenanceServiceByCenter,
  MaintenanceServicesByCenterId,
} from "../redux/mainserviceSlice";
import { useEffect } from "react";
import { MaintenanceInformationById } from "../redux/maintenanceInformationsSlice";
import OutlinedCard from "../components/MaintenanceInformations/OutlinedCard";
import HorizontalNonLinearStepper from "../components/MaintenanceInformations/HorizontalNon";
import HorizontalLinearStepper from "../components/MaintenanceInformations/HorizontalLinearStepper";
import { BookingById } from "../redux/bookingSlice";

const validationSchemaSparePart = Yup.object({
  sparePartsItemName: Yup.string().required("Name is required"),
  sparePartsId: Yup.string(),
});
const validationSchemaService = Yup.object({
  maintenanceServiceName: Yup.string().required("Name is required"),
  serviceCareId: Yup.string(),
});
export const AddSparePartDialog = ({ open, handleClose, centerId, token }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      sparePartsItemName: "",
      sparePartsId: "",
    },
    validationSchemaSparePart,
    onSubmit: (values, { resetForm }) => {
      const data = {
        sparePartsItemName: values.sparePartsItemName,
        sparePartsId: null,
      };
      console.log("potst", data);
      dispatch(AddSparePartItemsByCenter({ data, token }))
        .then(() => {
          dispatch(SparePartItemsByCenterId({ centerId, token }));
        })
        .catch((error) => {
          console.error("Failed to add item:", error);
        });
      resetForm();
      handleClose();
    },
  });
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Spare Part Item</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            name="sparePartsId"
            label="sparePartsId"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.sparePartsId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.sparePartsId && Boolean(formik.errors.sparePartsId)
            }
            helperText={
              formik.touched.sparePartsId && formik.errors.sparePartsId
            }
          />
          <TextField
            margin="dense"
            name="sparePartsItemName"
            label="sparePartsItemName"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.sparePartsItemName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.sparePartsItemName &&
              Boolean(formik.errors.sparePartsItemName)
            }
            helperText={
              formik.touched.sparePartsItemName &&
              formik.errors.sparePartsItemName
            }
          />
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export const AddMaintenanceServiceDialog = ({
  open,
  handleClose,
  centerId,
  token,
}) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      maintenanceServiceName: "",
      serviceCareId: "",
    },
    validationSchemaService,
    onSubmit: (values, { resetForm }) => {
      const data = {
        maintenanceServiceName: values.maintenanceServiceName,
        serviceCareId: null,
      };
      console.log("potst", data);
      dispatch(AddMaintenanceServiceByCenter({ data, token }))
        .then(() => {
          dispatch(MaintenanceServicesByCenterId({ centerId, token }));
        })
        .catch((error) => {
          console.error("Failed to add item:", error);
        });
      resetForm();
      handleClose();
    },
  });
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Spare Part Item</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            name="serviceCareId"
            label="serviceCareId"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.serviceCareId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.serviceCareId &&
              Boolean(formik.errors.serviceCareId)
            }
            helperText={
              formik.touched.serviceCareId && formik.errors.serviceCareId
            }
          />
          <TextField
            margin="dense"
            name="maintenanceServiceName"
            label="maintenanceServiceName"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.maintenanceServiceName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.maintenanceServiceName &&
              Boolean(formik.errors.maintenanceServiceName)
            }
            helperText={
              formik.touched.maintenanceServiceName &&
              formik.errors.maintenanceServiceName
            }
          />
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const MaintenanceInformationsDetailDialog = ({
  open,
  handleClose,
  token,
  item,
}) => {
  const dispatch = useDispatch();
  const { main, status, error } = useSelector(
    (state) => state.maintenanceInformation
  );
  // const { bookings, booking } = useSelector((state) => state.booking);
  console.log("Logging bookingId:", item);
  useEffect(() => {
    if (item) {
      // dispatch(BookingById({ token: token, id: item.bookingId }));
      dispatch(
        MaintenanceInformationById({
          miId: item.informationMaintenanceId,
          token: token,
        })
      );
    }
  }, [dispatch, item, token]);

  // console.log("BookingById", booking);
  console.log("MaintenanceInformationById", main);


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          width: "65%",
          maxWidth: "65%",
          height: "65%",
          maxHeight: "auto",
        },
      }}
    >
      <DialogTitle style={{ textAlign: "center", fontWeight: "bolder" }}>
        Maintenance Information Detail
      </DialogTitle>
      {status === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {status === "succeeded" && main && (
        <>
          <HorizontalLinearStepper
            bookingData={main}
          />
          {/* <DialogContent dividers>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Maintenance Information
              </Typography>
              <Typography variant="body1" gutterBottom>
                Information ID: {main.informationMaintenanceId}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Name: {main.informationMaintenanceName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Created Date: {new Date(main.createdDate).toLocaleString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Finished Date: {new Date(main.finishedDate).toLocaleString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Total Price: {main.totalPrice} VND
              </Typography>
              <Typography variant="body1" gutterBottom>
                Note: {main.note}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Vehicle Information
              </Typography>
              <Typography variant="body1" gutterBottom>
                Brand: {main.vehiclesBrandName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Model: {main.vehicleModelName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Color: {main.color}
              </Typography>
              <Typography variant="body1" gutterBottom>
                License Plate: {main.licensePlate}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Center Information
              </Typography>
              <Typography variant="body1" gutterBottom>
                Name: {main.maintenanceCenterName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Address: {main.address}
              </Typography>
              <Typography variant="body1" gutterBottom>
                City: {main.city}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Phone: {main.phone}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="h6" gutterBottom>
                Client Information
              </Typography>
              <Typography variant="body1" gutterBottom>
                Name: {main.firstName} {main.lastName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Email: {main.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Address: {main.address}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Phone: {main.phone}
              </Typography>
            </Box>
          </DialogContent> */}
        </>
      )}
      {status === "failed" && (
        <DialogContent dividers>
          <Typography>Error: {error}</Typography>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
