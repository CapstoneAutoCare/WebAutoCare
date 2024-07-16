import {
  Box,
  Button,
  ButtonBase,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  AddSparePartItemCost,
  AddSparePartItemsByCenter,
  ChangeStatusSparePartItemCostByCenter,
  GetByIdSparePartActiveCost,
  SparePartItemById,
  SparePartItemsByCenterId,
  UpdateSparePartItemByCenter,
} from "../redux/sparepartItemsSlice";
import {
  AddMaintenanceServiceByCenter,
  AddMaintenanceServiceCost,
  ChangeStatusMaintenanceServiceCostByCenter,
  GetByIdMaintenanceServiceActiveCost,
  MaintenanceServicesByCenterId,
  MaintenanceServicesById,
  UpdateMaintenanceServiceByCenter,
} from "../redux/mainserviceSlice";
import { useEffect, useState } from "react";
import {
  GetListByCenterAndStatus,
  GetListByCenterAndStatusCheckinAndTaskInactive,
  MaintenanceInformationById,
} from "../redux/maintenanceInformationsSlice";
import OutlinedCard, {
  CardMainServiceCostComponent,
  ImageMainTask,
  TaskDetailComponent,
} from "../components/MaintenanceInformations/OutlinedCard";
import HorizontalNonLinearStepper from "../components/MaintenanceInformations/HorizontalNon";
import HorizontalLinearStepper from "../components/MaintenanceInformations/HorizontalLinearStepper";
import {
  BookingByCenter,
  BookingById,
  PatchStatusBookingByCenter,
} from "../redux/bookingSlice";
import { storage } from "./firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { SparePartsAll } from "../redux/sparepartsSlice";
import ClearIcon from "@mui/icons-material/Clear";
import { ServicesAll } from "../redux/servicesSlice";
import { CardCostComponent } from "../components/MaintenanceInformations/OutlinedCard";
import { makeStyle } from "../components/Booking/Booking";
import { AddTaskByCenter, TaskGetById } from "../redux/tasksSlice";
import { TechinicanByCenterId } from "../redux/techinicansSlice";
import { formatDate } from "./Pagination";
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
    onSubmit: async (values, { resetForm }) => {
      const data = {
        sparePartsItemName: values.sparePartsItemName,
        sparePartsId: values.sparePartsId ? values.sparePartsId : null,
      };

      await dispatch(AddSparePartItemsByCenter({ data, token }))
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
              disabled={formik.values.sparePartsId}
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
  const { services, statusservices } = useSelector((state) => state.services);
  const formik = useFormik({
    initialValues: {
      maintenanceServiceName: "",
      serviceCareId: "",
    },
    validationSchema: validationSchemaService,
    onSubmit: async (values, { resetForm }) => {
      const data = {
        maintenanceServiceName: values.maintenanceServiceName,
        serviceCareId: values.serviceCareId ? values.serviceCareId : null,
      };

      await dispatch(AddMaintenanceServiceByCenter({ data, token }))
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
                <MenuItem
                  key={option.serviceCareId}
                  value={option.serviceCareId}
                >
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

  const [reload, setReload] = useState(false);

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
  }, [dispatch, item, token, reload]);

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
      {(statusmi === "loading" || statusbooking === "loading") && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {statusmi === "succeeded" &&
        statusbooking === "succeeded" &&
        main &&
        booking && (
          <HorizontalLinearStepper
            mainData={main}
            bookingData={booking}
            setReload={setReload}
          />
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
export const UpdateMaintenanceServiceDialog = ({
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
        maintenanceServiceName: item.maintenanceServiceName || "",
        image: item.image || "",
      });
    }
  }, [item]);

  const formik = useFormik({
    initialValues: {
      status: item?.status || "ACTIVE",
      maintenanceServiceName: item?.maintenanceServiceName || "",
      image: item?.image || "",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Status is required"),
      maintenanceServiceName: Yup.string().required(
        "Spare Part Item Name is required"
      ),
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
          UpdateMaintenanceServiceByCenter({
            token: token,
            id: item.maintenanceServiceId,
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
        Edit Maintenance Service Items
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
                label="Maintenance Service Name"
                name="maintenanceServiceName"
                value={formik.values.maintenanceServiceName}
                onChange={formik.handleChange}
                error={
                  formik.touched.maintenanceServiceName &&
                  Boolean(formik.errors.maintenanceServiceName)
                }
                helperText={
                  formik.touched.maintenanceServiceName &&
                  formik.errors.maintenanceServiceName
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

export const ViewSparePartItemsCostDialog = ({
  open,
  handleViewClose,
  token,
  item,
}) => {
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const { sparepartitemscost, sparepartitem, statussparepartitem } =
    useSelector((state) => state.sparepartitem);
  const [openAdd, setOpenAdd] = useState(false);
  const [reload, setReload] = useState(false);

  const handleStatusChange = async (sparePartsItemCostId, newStatus) => {
    try {
      await dispatch(
        ChangeStatusSparePartItemCostByCenter({
          token: token,
          id: sparePartsItemCostId,
          status: newStatus,
        })
      );
      await dispatch(
        GetByIdSparePartActiveCost({ token, id: item.sparePartsItemId })
      );
      setReload(!reload);
    } catch (error) {}
  };
  useEffect(() => {
    if (item) {
      dispatch(
        GetByIdSparePartActiveCost({ token, id: item.sparePartsItemId })
      );
      dispatch(SparePartItemById({ token, id: item.sparePartsItemId }));
    }
  }, [item, reload, dispatch]);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };
  const handleAddClickOpen = () => {
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
    setReload(!reload);
  };
  return (
    <Dialog
      open={open}
      onClose={handleViewClose}
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
      {statussparepartitem === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {sparepartitem && statussparepartitem === "succeeded" && (
        <>
          <DialogTitle style={{ textAlign: "center", fontWeight: "bolder" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              View List Cost Item
              <Button
                variant="contained"
                color="success"
                onClick={handleAddClickOpen}
              >
                Add New Cost
              </Button>
            </div>
            <AddSparePartItemsCostDialog
              open={openAdd}
              handleAddClose={handleAddClose}
              sparePartsItemId={sparepartitem.sparePartsItemId}
              token={token}
            />
            <Card>
              <CardCostComponent
                data={sparepartitem}
                cost={sparepartitemscost}
              />
            </Card>
          </DialogTitle>
          <DialogContent dividers>
            <Grid>
              <TableContainer
                component={Paper}
                style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      {/* <TableCell>Avatar</TableCell> */}
                      <TableCell>Price</TableCell>
                      <TableCell>Created Date</TableCell>
                      <TableCell>Note</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      sparepartitem.responseSparePartsItemCosts
                        // .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                        .map((item) => (
                          <TableRow key={item.sparePartsItemCostId}>
                            <TableCell
                              style={{ fontWeight: "bold", fontSize: "25px" }}
                            >
                              ${item.acturalCost}
                            </TableCell>
                            <TableCell>{item.dateTime}</TableCell>
                            <TableCell>{item.note}</TableCell>
                            <TableCell>
                              <Select
                                value={item.status}
                                onChange={(event) => {
                                  const newStatus = event.target.value;
                                  handleStatusChange(
                                    item.sparePartsItemCostId,
                                    newStatus
                                  );
                                }}
                                className="status"
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
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </DialogContent>
        </>
      )}
      <DialogActions>
        <Button onClick={handleViewClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const validationSchemaMaintenanceServicesCost = Yup.object({
  acturalCost: Yup.string().required("Name is required"),
  maintenanceServiceId: Yup.string().required("Name is required"),
  note: Yup.string(),
});

export const AddMaintenanceServicesCostDialog = ({
  open,
  handleAddClose,
  maintenanceServiceId,
  token,
}) => {
  const dispatch = useDispatch();
  const { services, statusservices } = useSelector((state) => state.services);
  const formik = useFormik({
    initialValues: {
      acturalCost: 0,
      note: "",
      maintenanceServiceId: maintenanceServiceId,
    },
    validationSchema: validationSchemaMaintenanceServicesCost,
    onSubmit: async (values, { resetForm }) => {
      const data = {
        acturalCost: values.acturalCost,
        note: values.note,
        maintenanceServiceId: values.maintenanceServiceId,
      };
      console.log(data);
      try {
        await dispatch(AddMaintenanceServiceCost({ token, data }));
        resetForm();
        handleAddClose();
      } catch (error) {
        console.error("Failed to add item:", error);
      }
    },
  });
  // const handleClear = () => {
  //   formik.setFieldValue("sparePartsItemId", "");
  // };
  useEffect(() => {
    dispatch(ServicesAll(token));
  }, [dispatch, token]);
  return (
    <Dialog open={open} onClose={handleAddClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Maintenance Service</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          {/* <FormControl fullWidth margin="normal">
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
                <MenuItem
                  key={option.serviceCareId}
                  value={option.serviceCareId}
                >
                  {option.maintananceScheduleName} {option.serviceCareName}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              autoFocus
              margin="dense"
              name="maintenanceServiceId"
              label="Maintenance Service Id"
              type="text"
              fullWidth
              variant="standard"
              value={formik.values.maintenanceServiceId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.maintenanceServiceId &&
                Boolean(formik.errors.sparePartsItemId)
              }
              disabled={formik.values.maintenanceServiceId}
              helperText={
                formik.touched.maintenanceServiceId &&
                formik.errors.maintenanceServiceId
              }
            />
          </div>

          <TextField
            margin="dense"
            name="acturalCost"
            label="Actural Cost"
            type="number"
            fullWidth
            variant="standard"
            value={formik.values.acturalCost}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.acturalCost && Boolean(formik.errors.acturalCost)
            }
            helperText={formik.touched.acturalCost && formik.errors.acturalCost}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
          <TextField
            margin="dense"
            name="note"
            label="Note"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.note}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.note && Boolean(formik.errors.note)}
            helperText={formik.touched.note && formik.errors.note}
          />
          <DialogActions>
            <Button onClick={handleAddClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const ViewMaintenanceServicesCostDialog = ({
  open,
  handleViewClose,
  token,
  item,
}) => {
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const {
    maintenanceservicescost,
    maintenanceservice,
    statusmaintenanceservices,
  } = useSelector((state) => state.maintenanceservice);
  const [openAdd, setOpenAdd] = useState(false);
  const [reload, setReload] = useState(false);

  const handleStatusChange = async (maintenanceServiceId, newStatus) => {
    try {
      await dispatch(
        ChangeStatusMaintenanceServiceCostByCenter({
          token: token,
          id: maintenanceServiceId,
          status: newStatus,
        })
      );
      // await dispatch(
      //   GetByIdSparePartActiveCost({ token, id: item.sparePartsItemId })
      // );
      setReload(!reload);
    } catch (error) {}
  };
  useEffect(() => {
    if (item) {
      dispatch(
        GetByIdMaintenanceServiceActiveCost({ token, id: item.maintenanceServiceId })
      );
      dispatch(
        MaintenanceServicesById({ token, id: item.maintenanceServiceId })
      );
    }
  }, [item, reload, dispatch]);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };
  const handleAddClickOpen = () => {
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
    setReload(!reload);
  };
  return (
    <Dialog
      open={open}
      onClose={handleViewClose}
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
      {statusmaintenanceservices === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {maintenanceservice && statusmaintenanceservices === "succeeded" && (
        <>
          <DialogTitle style={{ textAlign: "center", fontWeight: "bolder" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              View List Cost Item
              <Button
                variant="contained"
                color="success"
                onClick={handleAddClickOpen}
              >
                Add New Cost
              </Button>
            </div>
            <AddMaintenanceServicesCostDialog
              open={openAdd}
              handleAddClose={handleAddClose}
              maintenanceServiceId={maintenanceservice.maintenanceServiceId}
              token={token}
            />
            <Card>
              <CardMainServiceCostComponent
                data={maintenanceservice}
                cost={maintenanceservicescost}
              />
            </Card>
          </DialogTitle>
          <DialogContent dividers>
            <Grid>
              <TableContainer
                component={Paper}
                style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      {/* <TableCell>Avatar</TableCell> */}
                      <TableCell>Price</TableCell>
                      <TableCell>Created Date</TableCell>
                      <TableCell>Note</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {maintenanceservice.responseMaintenanceServiceCosts
                      // .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                      .map((item) => (
                        <TableRow key={item.maintenanceServiceCostId}>
                          <TableCell
                            style={{ fontWeight: "bold", fontSize: "25px" }}
                          >
                            ${item.acturalCost}
                          </TableCell>
                          <TableCell>{item.dateTime}</TableCell>
                          <TableCell>{item.note}</TableCell>
                          <TableCell>
                            <Select
                              value={item.status}
                              onChange={(event) => {
                                const newStatus = event.target.value;
                                handleStatusChange(
                                  item.maintenanceServiceCostId,
                                  newStatus
                                );
                              }}
                              className="status"
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
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </DialogContent>
        </>
      )}
      <DialogActions>
        <Button onClick={handleViewClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
const validationSchemaSparePartItemsCost = Yup.object({
  acturalCost: Yup.string().required("Name is required"),
  sparePartsItemId: Yup.string().required("Name is required"),
  note: Yup.string(),
});

export const AddSparePartItemsCostDialog = ({
  open,
  handleAddClose,
  sparePartsItemId,
  token,
}) => {
  const dispatch = useDispatch();
  const { services, statusservices } = useSelector((state) => state.services);
  const formik = useFormik({
    initialValues: {
      acturalCost: 0,
      note: "",
      sparePartsItemId: sparePartsItemId,
    },
    validationSchema: validationSchemaSparePartItemsCost,
    onSubmit: async (values, { resetForm }) => {
      const data = {
        acturalCost: values.acturalCost,
        note: values.note,
        sparePartsItemId: values.sparePartsItemId,
      };
      console.log(data);
      try {
        await dispatch(AddSparePartItemCost({ token, data }));
        resetForm();
        handleAddClose();
      } catch (error) {
        console.error("Failed to add item:", error);
      }
    },
  });
  // const handleClear = () => {
  //   formik.setFieldValue("sparePartsItemId", "");
  // };
  useEffect(() => {
    dispatch(ServicesAll(token));
  }, [dispatch, token]);
  return (
    <Dialog open={open} onClose={handleAddClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Spare Part Item</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          {/* <FormControl fullWidth margin="normal">
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
                <MenuItem
                  key={option.serviceCareId}
                  value={option.serviceCareId}
                >
                  {option.maintananceScheduleName} {option.serviceCareName}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              autoFocus
              margin="dense"
              name="sparePartsItemId"
              label="Spare Parts Item Id"
              type="text"
              fullWidth
              variant="standard"
              value={formik.values.sparePartsItemId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.sparePartsItemId &&
                Boolean(formik.errors.sparePartsItemId)
              }
              disabled={formik.values.sparePartsItemId}
              helperText={
                formik.touched.sparePartsItemId &&
                formik.errors.sparePartsItemId
              }
            />
          </div>

          <TextField
            margin="dense"
            name="acturalCost"
            label="Actural Cost"
            type="number"
            fullWidth
            variant="standard"
            value={formik.values.acturalCost}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.acturalCost && Boolean(formik.errors.acturalCost)
            }
            helperText={formik.touched.acturalCost && formik.errors.acturalCost}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
          <TextField
            margin="dense"
            name="note"
            label="Note"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.note}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.note && Boolean(formik.errors.note)}
            helperText={formik.touched.note && formik.errors.note}
          />
          <DialogActions>
            <Button onClick={handleAddClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const validationSchemaTaskByCenter = Yup.object({
  technicianId: Yup.string().required("technicianId is required"),
  informationMaintenanceId: Yup.string().required(
    "informationMaintenanceId is required"
  ),
});
export const AddTaskDialog = ({ open, handleClose, token, centerId }) => {
  const dispatch = useDispatch();

  const { maintenanceInformations, statusmi } = useSelector(
    (state) => state.maintenanceInformation
  );
  const { technicians, statustech } = useSelector((state) => state.technician);
  const { reloadAdd, setReloadAdd } = useState(false);
  const formik = useFormik({
    initialValues: {
      informationMaintenanceId: "",
      technicianId: "",
    },
    validationSchema: validationSchemaTaskByCenter,
    onSubmit: async (values, { resetForm }) => {
      const data = {
        informationMaintenanceId: values.informationMaintenanceId,
        technicianId: values.technicianId,
      };
      console.log(data);
      await dispatch(AddTaskByCenter({ token: token, data: data }))
        .then(() => {
          // dispatch(MaintenanceServicesByCenterId({ sparePartsItemId, token }));
          resetForm();
          handleClose();
        })
        .catch((error) => {
          console.error("Failed to add item:", error);
        });
      await dispatch(GetListByCenterAndStatusCheckinAndTaskInactive(token));
      await dispatch(TechinicanByCenterId({ centerId, token }));

      setReloadAdd(!reloadAdd);
    },
  });

  useEffect(() => {
    dispatch(TechinicanByCenterId({ centerId, token }));
    dispatch(GetListByCenterAndStatusCheckinAndTaskInactive(token));
  }, [dispatch, token, centerId, reloadAdd]);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Technician Id</InputLabel>
            <Select
              label="TechnicianId"
              name="technicianId"
              value={formik.values.technicianId}
              onChange={(event) => {
                formik.handleChange(event);
                // const selectedtechnicianId = technicians.find(
                //   (part) => part.technicianId === event.target.value
                // );
                // formik.setFieldValue(
                //   "maintenanceServiceName",
                //   selectedtechnicianId?.serviceCareName || ""
                // );
              }}
              error={
                formik.touched.technicianId &&
                Boolean(formik.errors.technicianId)
              }
            >
              {technicians.map((option) => (
                <MenuItem key={option.technicianId} value={option.technicianId}>
                  {option.firstName} {option.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              autoFocus
              margin="dense"
              name="technicianId"
              label="Technician Id"
              type="text"
              fullWidth
              variant="standard"
              value={formik.values.technicianId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.technicianId &&
                Boolean(formik.errors.technicianId)
              }
              disabled={formik.touched.technicianId}
              helperText={
                formik.touched.technicianId && formik.errors.technicianId
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>

          <FormControl fullWidth margin="normal">
            <InputLabel>Information Id</InputLabel>
            <Select
              label="Information Id"
              name="informationMaintenanceId"
              value={formik.values.informationMaintenanceId}
              onChange={(event) => {
                formik.handleChange(event);
                // const selectedtechnicianId = technicians.find(
                //   (part) => part.technicianId === event.target.value
                // );
                // formik.setFieldValue(
                //   "maintenanceServiceName",
                //   selectedtechnicianId?.serviceCareName || ""
                // );
              }}
              error={
                formik.touched.informationMaintenanceId &&
                Boolean(formik.errors.informationMaintenanceId)
              }
            >
              {maintenanceInformations.map((option) => (
                <MenuItem
                  key={option.informationMaintenanceId}
                  value={option.informationMaintenanceId}
                >
                  {"Note: "}
                  {option.note} {"- TotalPrice: "}
                  {option.totalPrice} VND
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              autoFocus
              margin="dense"
              name="informationMaintenanceId"
              label="Information MaintenanceId"
              type="text"
              fullWidth
              variant="standard"
              value={formik.values.informationMaintenanceId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.informationMaintenanceId &&
                Boolean(formik.errors.informationMaintenanceId)
              }
              disabled={formik.touched.informationMaintenanceId}
              helperText={
                formik.touched.informationMaintenanceId &&
                formik.errors.informationMaintenanceId
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const ViewTaskDetailDialog = ({
  open,
  handleViewClose,
  token,
  item,
}) => {
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const { task, statustasks } = useSelector((state) => state.tasks);
  const [openAdd, setOpenAdd] = useState(false);
  const [reload, setReload] = useState(false);

  const handleStatusChange = async (sparePartsItemCostId, newStatus) => {
    try {
      await dispatch(
        ChangeStatusSparePartItemCostByCenter({
          token: token,
          id: sparePartsItemCostId,
          status: newStatus,
        })
      );
      await dispatch(
        GetByIdSparePartActiveCost({ token, id: item.sparePartsItemId })
      );
      setReload(!reload);
    } catch (error) {}
  };
  useEffect(() => {
    if (item) {
      dispatch(TaskGetById({ token, id: item.maintenanceTaskId }));
      // dispatch(SparePartItemById({ token, id: item.sparePartsItemId }));
    }
  }, [item, reload, dispatch]);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };
  const handleAddClickOpen = () => {
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
    setReload(!reload);
  };
  return (
    <Dialog
      open={open}
      onClose={handleViewClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          width: "65%",
          maxWidth: "80%",
          height: "65%",
          maxHeight: "80%",
        },
      }}
    >
      {statustasks === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {task && statustasks === "succeeded" && (
        <>
          <DialogTitle style={{ textAlign: "center", fontWeight: "bolder" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              View List Task
            </div>

            <Card>
              <TaskDetailComponent data={task} />
            </Card>
          </DialogTitle>

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
                      <TableCell>Maintenance SparePart Info Id</TableCell>
                      <TableCell>SparePart Name</TableCell>
                      <TableCell>Created Date</TableCell>

                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {task.responseMainTaskSpareParts.map((item) => (
                      <TableRow key={item.maintenanceTaskSparePartInfoId}>
                        <TableCell>
                          <ImageMainTask src={item.image} alt={item.image} />
                        </TableCell>
                        <TableCell
                        // style={{ fontWeight: "bold", fontSize: "25px" }}
                        >
                          {item.maintenanceSparePartInfoId}
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{formatDate(item.createdDate)}</TableCell>
                        <TableCell>
                          {item.status === "ACTIVE" ? (
                            <Select
                              value={item.status}
                              onChange={(event) => {
                                const newStatus = event.target.value;
                                handleStatusChange(
                                  item.sparePartsItemCostId,
                                  newStatus
                                );
                              }}
                              className="status"
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
                          ) : (
                            <span
                              className="status"
                              style={{
                                ...makeStyle(item.status),
                                // borderRadius: "10px",
                                // width: "125px",
                                // fontSize: "10px",
                                // height: "50px",
                              }}
                            >
                              {item.status}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            {/* <Typography>View List Task Spart Part</Typography> */}
          </DialogContent>
          {task.responseMainTaskServices.length > 0 && (
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
                        <TableCell>Maintenance Service Info Id</TableCell>
                        <TableCell>Service Name</TableCell>
                        <TableCell>Created Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {task.responseMainTaskServices.map((item) => (
                        <TableRow key={item.maintenanceTaskServiceInfoId}>
                          <TableCell>
                            <ImageMainTask src={item.image} alt={item.image} />
                          </TableCell>
                          <TableCell
                          // style={{ fontWeight: "bold", fontSize: "25px" }}
                          >
                            {item.maintenanceServiceInfoId}
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{formatDate(item.createdDate)}</TableCell>
                          <TableCell>
                            {item.status === "ACTIVE" ? (
                              <Select
                                value={item.status}
                                onChange={(event) => {
                                  const newStatus = event.target.value;
                                  handleStatusChange(
                                    item.sparePartsItemCostId,
                                    newStatus
                                  );
                                }}
                                className="status"
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
                            ) : (
                              <span
                                className="status"
                                style={{
                                  ...makeStyle(item.status),
                                  // borderRadius: "10px",
                                  // width: "125px",
                                  // fontSize: "10px",
                                  // height: "50px",
                                }}
                              >
                                {item.status}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </DialogContent>
          )}
        </>
      )}
      <DialogActions>
        <Button onClick={handleViewClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
