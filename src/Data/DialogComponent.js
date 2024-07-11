import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  AddSparePartItemsByCenter,
  SparePartItemsByCenterId,
  UpdateSparePartItemByCenter,
} from "../redux/sparepartItemsSlice";
import {
  AddMaintenanceServiceByCenter,
  MaintenanceServicesByCenterId,
} from "../redux/mainserviceSlice";
import { useEffect, useState } from "react";
import { MaintenanceInformationById } from "../redux/maintenanceInformationsSlice";
import OutlinedCard from "../components/MaintenanceInformations/OutlinedCard";
import HorizontalNonLinearStepper from "../components/MaintenanceInformations/HorizontalNon";
import HorizontalLinearStepper from "../components/MaintenanceInformations/HorizontalLinearStepper";
import { BookingById } from "../redux/bookingSlice";
import { storage } from "./firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { SparePartsAll } from "../redux/sparepartsSlice";
import ClearIcon from "@mui/icons-material/Clear";
import { ServicesAll } from "../redux/servicesSlice";

const validationSchemaSparePart = Yup.object({
  sparePartsItemName: Yup.string().required("Name is required"),
  sparePartsId: Yup.string(),
});
const validationSchemaService = Yup.object({
  maintenanceServiceName: Yup.string().required("Name is required"),
  serviceCareId: Yup.string(),
});
const statusOptions = ["ACTIVE", "INACTIVE"];

export const AddSparePartDialog = ({ open, handleClose, centerId, token }) => {
  const { spareparts, errorsparepart } = useSelector(
    (state) => state.spareparts
  );
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      sparePartsItemName: "",
      sparePartsId: "",
    },
    validationSchema: validationSchemaSparePart,
    onSubmit: (values, { resetForm }) => {
      const data = {
        sparePartsItemName: values.sparePartsItemName,
        sparePartsId: values.sparePartsId ? values.sparePartsId : null,
      };

      dispatch(AddSparePartItemsByCenter({ data, token }))
        .then(() => {
          dispatch(SparePartItemsByCenterId({ centerId, token }));
          resetForm();
          handleClose();
        })
        .catch((error) => {
          console.error("Failed to add item:", error);
        });
    },
  });
  const handleClear = () => {
    formik.setFieldValue("sparePartsId", "");
  };
  useEffect(() => {
    dispatch(SparePartsAll(token));
  }, [dispatch, token]);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Spare Part Item</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>SparePart Name</InputLabel>
            <Select
              label="SparePartsId"
              name="sparePartsId"
              value={formik.values.sparePartsId}
              onChange={(event) => {
                formik.handleChange(event);
                const selectedSparePart = spareparts.find(
                  (part) => part.sparePartId === event.target.value
                );
                formik.setFieldValue(
                  "sparePartsItemName",
                  selectedSparePart?.sparePartName || ""
                );
              }}
              error={
                formik.touched.sparePartsId &&
                Boolean(formik.errors.sparePartsId)
              }
            >
              {spareparts.map((option) => (
                <MenuItem key={option.sparePartId} value={option.sparePartId}>
                  {option.maintananceScheduleName} {option.sparePartName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              autoFocus
              margin="dense"
              name="sparePartsId"
              label="Spare PartsId"
              type="text"
              fullWidth
              variant="standard"
              value={formik.values.sparePartsId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.sparePartsId &&
                Boolean(formik.errors.sparePartsId)
              }
              disabled={formik.touched.sparePartsId}
              helperText={
                formik.touched.sparePartsId && formik.errors.sparePartsId
              }
            />
            {formik.values.sparePartsId && (
              <IconButton onClick={handleClear} size="small">
                <ClearIcon />
              </IconButton>
            )}
          </div>

          <TextField
            margin="dense"
            name="sparePartsItemName"
            label="Spare Parts Item Name"
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
  const { services, statusservices } = useSelector(
    (state) => state.services
  );
  const formik = useFormik({
    initialValues: {
      maintenanceServiceName: "",
      serviceCareId: "",
    },
    validationSchema: validationSchemaService,
    onSubmit: (values, { resetForm }) => {
      const data = {
        maintenanceServiceName: values.maintenanceServiceName,
        serviceCareId: values.serviceCareId ? values.serviceCareId : null,
      };

      dispatch(AddMaintenanceServiceByCenter({ data, token }))
        .then(() => {
          dispatch(MaintenanceServicesByCenterId({ centerId, token }));
          resetForm();
          handleClose();
        })
        .catch((error) => {
          console.error("Failed to add item:", error);
        });
    },
  });
  const handleClear = () => {
    formik.setFieldValue("serviceCareId", "");
  };
  useEffect(() => {
    dispatch(ServicesAll(token));
  }, [dispatch, token]);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Spare Part Item</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>SparePart Name</InputLabel>
            <Select
              label="Service Care Id"
              name="serviceCareId"
              value={formik.values.serviceCareId}
              onChange={(event) => {
                formik.handleChange(event);
                const selectedServices = services.find(
                  (part) => part.serviceCareId === event.target.value
                );
                formik.setFieldValue(
                  "maintenanceServiceName",
                  selectedServices?.serviceCareName || ""
                );
              }}
              error={
                formik.touched.serviceCareId &&
                Boolean(formik.errors.serviceCareId)
              }
            >
              {services.map((option) => (
                <MenuItem key={option.serviceCareId} value={option.serviceCareId}>
                  {option.maintananceScheduleName} {option.serviceCareName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              autoFocus
              margin="dense"
              name="serviceCareId"
              label="Service Care Id"
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
              disabled={formik.touched.serviceCareId}
              helperText={
                formik.touched.serviceCareId && formik.errors.serviceCareId
              }
            />
            {formik.values.serviceCareId && (
              <IconButton onClick={handleClear} size="small">
                <ClearIcon />
              </IconButton>
            )}
          </div>

          <TextField
            margin="dense"
            name="maintenanceServiceName"
            label="Maintenance Service Name"
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
  const { main, statusmi, errormi } = useSelector(
    (state) => state.maintenanceInformation
  );
  const { bookings, booking, statusbooking, errorbooking } = useSelector(
    (state) => state.booking
  );
  console.log("Logging bookingId:", item);
  useEffect(() => {
    if (item) {
      dispatch(BookingById({ token: token, id: item.bookingId }));
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
  console.log("BookingById", booking);

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
      {statusmi === "loading" && statusbooking === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {statusmi === "succeeded" &&
        statusbooking === "succeeded" &&
        booking &&
        main && (
          <>
            <HorizontalLinearStepper mainData={main} bookingData={booking} />
          </>
        )}
      {statusmi === "failed" && (
        <DialogContent dividers>
          <Typography>Error: {errormi}</Typography>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export const UpdateSparePartItemDialog = ({
  open,
  handleClose,
  token,
  item,
}) => {
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (item) {
      formik.setValues({
        status: item.status || "ACTIVE",
        sparePartsItemName: item.sparePartsItemName || "",
        image: item.image || "",
        capacity: item.capacity || 50,
      });
    }
  }, [item]);

  const formik = useFormik({
    initialValues: {
      status: item?.status || "ACTIVE",
      sparePartsItemName: item?.sparePartsItemName || "",
      image: item?.image || "",
      capacity: item?.capacity || 50,
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Status is required"),
      sparePartsItemName: Yup.string().required(
        "Spare Part Item Name is required"
      ),
      capacity: Yup.number()
        .min(1, "Capacity must be at least 1")
        .required("Capacity is required"),
    }),
    onSubmit: async (values) => {
      try {
        let imageUrl = values.image;

        if (imageFile) {
          const storageRef = ref(storage, `images/${imageFile.name}`);
          await uploadBytes(storageRef, imageFile);
          imageUrl = await getDownloadURL(storageRef);
        }

        dispatch(
          UpdateSparePartItemByCenter({
            token: token,
            id: item.sparePartsItemId,
            data: { ...values, image: imageUrl },
          })
        );

        handleClose();
      } catch (error) {
        console.error("Failed to update spare part item", error);
      }
    },
  });

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    formik.setFieldValue("image", e.target.files[0].name);
  };

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
        Edit Spare Part Items
      </DialogTitle>

      {item && (
        <>
          <DialogContent dividers>
            <form onSubmit={formik.handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Spare Part Item Name"
                name="sparePartsItemName"
                value={formik.values.sparePartsItemName}
                onChange={formik.handleChange}
                error={
                  formik.touched.sparePartsItemName &&
                  Boolean(formik.errors.sparePartsItemName)
                }
                helperText={
                  formik.touched.sparePartsItemName &&
                  formik.errors.sparePartsItemName
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Image"
                name="image"
                type="file"
                onChange={handleFileChange}
                error={formik.touched.image && Boolean(formik.errors.image)}
                helperText={formik.touched.image && formik.errors.image}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Capacity"
                name="capacity"
                type="number"
                value={formik.values.capacity}
                onChange={formik.handleChange}
                error={
                  formik.touched.capacity && Boolean(formik.errors.capacity)
                }
                helperText={formik.touched.capacity && formik.errors.capacity}
                fullWidth
                margin="normal"
              />
              <DialogActions>
                <Button type="submit" color="primary">
                  Update
                </Button>
                <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};
