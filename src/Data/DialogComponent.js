import {
  Autocomplete,
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
import ClearIcon from "@mui/icons-material/Clear";

import {
  AddSparePartItemCost,
  AddSparePartItemsByCenter,
  ChangeStatusSparePartItemCostByCenter,
  GetByIdSparePartActiveCost,
  GetListByDifSparePartAndInforId,
  SparePartItemById,
  UpdateSparePartItemByCenter,
} from "../redux/sparepartItemsSlice";
import {
  AddMaintenanceServiceByCenter,
  AddMaintenanceServiceCost,
  ChangeStatusMaintenanceServiceCostByCenter,
  GetByIdMaintenanceServiceActiveCost,
  GetListByDifMaintenanceServiceAndInforId,
  MaintenanceServicesByCenterId,
  MaintenanceServicesById,
  UpdateMaintenanceServiceByCenter,
} from "../redux/mainserviceSlice";
import { useEffect, useState } from "react";
import {
  GetListByCenterAndStatusCheckinAndTaskInactive,
  MaintenanceInformationById,
} from "../redux/maintenanceInformationsSlice";
import {
  CardMainServiceCostComponent,
  formatNumberWithDots,
  ImageMainTask,
  TaskDetailComponent,
} from "../components/MaintenanceInformations/OutlinedCard";
import HorizontalLinearStepper from "../components/MaintenanceInformations/HorizontalLinearStepper";
import { BookingById } from "../redux/bookingSlice";
import { storage } from "./firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { SparePartsAll } from "../redux/sparepartsSlice";
import { ServicesAll } from "../redux/servicesSlice";
import { CardCostComponent } from "../components/MaintenanceInformations/OutlinedCard";
import { makeStyle } from "../components/Booking/Booking";
import {
  AddTaskByCenter,
  TaskGetById,
  TaskListGetByInforId,
} from "../redux/tasksSlice";
import { TechinicanByCenterId } from "../redux/techinicansSlice";
import { formatDate } from "./Pagination";
import { CreateReceipt } from "../redux/receiptSlice";
import { MaintenanceSparePartInfoesPost } from "../redux/maintenanceSparePartInfoesSlice";
import { MaintenanceServiceInfoesPost } from "../redux/maintenanceServiceInfoesSlice";
const validationSchemaSparePart = Yup.object({
  sparePartsItemName: Yup.string().required("Name is required"),
  sparePartsId: Yup.string(),
});
const validationSchemaService = Yup.object({
  maintenanceServiceName: Yup.string().required("Name is required"),
  serviceCareId: Yup.string(),
});
const statusOptions = ["ACTIVE", "INACTIVE"];

export const AddSparePartDialog = ({
  open,
  handleClose,
  centerId,
  token,
  setReload,
}) => {
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
        sparePartsId: values.sparePartId ? values.sparePartId : null,
      };

      await dispatch(AddSparePartItemsByCenter({ data, token }))
        .then(() => {
          // dispatch(SparePartItemsByCenterId({ centerId, token }));
          resetForm();
          handleClose();
          setReload((p) => !p);
        })
        .catch((error) => {
          console.error("Failed to add item:", error);
        });
    },
  });
  const handleClear = () => {
    formik.setFieldValue("sparePartsId", "");
  };
  const [searchTerm, setSearchTerm] = useState("");
  const filteredOptions = spareparts.filter((option) =>
    option.sparePartName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    dispatch(SparePartsAll(token));
  }, [dispatch, token, open, setReload]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          width: "75%",
          height: "75%",
          maxWidth: "none",
          maxHeight: "none",
        },
      }}
    >
      <DialogTitle>Add Spare Part Item</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Autocomplete
            label="SparePartsId"
            fullWidth
            margin="normal"
            disablePortal
            id="sparePartsId"
            options={filteredOptions}
            getOptionLabel={(option) =>
              `Name: ${option.sparePartName} - Odo: ${option.maintananceScheduleName} - Vehicle: ${option.reponseVehicleModel.vehiclesBrandName} ${option.reponseVehicleModel.vehicleModelName}`
            }
            onChange={(event, newValue) => {
              const selectedId = newValue;
              formik.setFieldValue(
                "sparePartId",
                selectedId?.sparePartId || ""
              );
              formik.setFieldValue(
                "sparePartsItemName",
                selectedId?.sparePartName || ""
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Name"
                name="sparePartsId"
                value={searchTerm}
                variant="outlined"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
          />
          
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              autoFocus
              margin="dense"
              name="sparePartId"
              label="Spare Part Id"
              type="text"
              fullWidth
              variant="standard"
              value={formik.values.sparePartId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.sparePartsId &&
                Boolean(formik.errors.sparePartsId)
              }
              disabled={true}
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
  const [searchTerm, setSearchTerm] = useState("");
  const filteredOptions = services.filter((option) =>
    option.serviceCareName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleClear = () => {
    formik.setFieldValue("serviceCareId", "");
  };
  useEffect(() => {
    dispatch(ServicesAll(token));
  }, [dispatch, token]);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Thêm Dịch Vụ Mới</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
        <Autocomplete
            label="ServiceCareId"
            fullWidth
            margin="normal"
            disablePortal
            id="serviceCareId"
            options={filteredOptions}
            getOptionLabel={(option) =>
              `Tên: ${option.serviceCareName} - Odo: ${option?.maintananceScheduleName} - Vehicle: ${option.reponseVehicleModel?.vehiclesBrandName} ${option.reponseVehicleModel?.vehicleModelName}`
            }
            onChange={(event, newValue) => {
              const selectedId = newValue;
              formik.setFieldValue(
                "serviceCareId",
                selectedId?.serviceCareId || ""
              );
              formik.setFieldValue(
                "maintenanceServiceName",
                selectedId?.serviceCareName || ""
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Name"
                name="serviceCareId"
                value={searchTerm}
                variant="outlined"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
          />
          {/* <FormControl fullWidth margin="normal">
            <InputLabel>Tên Dịch Vụ</InputLabel>
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
      console.log("MaintenanceInformationsDetailDialog have Item: ", item);
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
          width: "80%",
          maxWidth: "80%",
          height: "80%",
          maxHeight: "100%",
        },
      }}
    >
      <DialogTitle style={{ textAlign: "center", fontWeight: "bolder" }}>
        Thông Tin Bảo Trì Sửa Chữa Chi Tiết
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
          <DialogContent dividers>
            <HorizontalLinearStepper
              mainData={main}
              bookingData={booking}
              setReload={setReload}
            />
          </DialogContent>
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
        ).then(() => {
          handleClose();
        });
      } catch (error) {
        console.error("Failed to update spare part item", error);
      }
    },
  });

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    formik.setFieldValue("image", e.target.files[0].name);
  };
  useEffect(() => {
    if (item) {
      formik.setValues({
        status: item.status || "ACTIVE",
        sparePartsItemName: item.sparePartsItemName || "",
        image: item.image || "",
        capacity: item.capacity || 50,
      });
    }
  }, [dispatch, item, token]);
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
          console.log(imageUrl);
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
        <DialogContent dividers>
          <DialogTitle style={{ textAlign: "center", fontWeight: "bolder" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              Danh Sách Các Lịch Sử Giá
              <Button
                variant="contained"
                color="success"
                onClick={handleAddClickOpen}
              >
                Thêm Giá Mới
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
                      <TableCell>Mã Giá</TableCell>
                      <TableCell>Tiền</TableCell>
                      <TableCell>Ngày Tạo</TableCell>
                      <TableCell>Ghi Chú</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sparepartitem.responseSparePartsItemCosts
                      // .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                      .map((item) => (
                        <TableRow key={item.sparePartsItemCostId}>
                          <TableCell>#{item.sparePartsItemCostId}</TableCell>
                          <TableCell
                            style={{ fontWeight: "bold", fontSize: "25px" }}
                          >
                            {formatNumberWithDots(item.acturalCost)} VND
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
        </DialogContent>
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
      <DialogTitle>Thêm Dịch Vụ</DialogTitle>
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
        GetByIdMaintenanceServiceActiveCost({
          token,
          id: item.maintenanceServiceId,
        })
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
        <DialogContent dividers>
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
                      <TableCell>MaintenanceServiceCostId</TableCell>
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
                          <TableCell>{item.maintenanceServiceCostId}</TableCell>

                          <TableCell
                            style={{ fontWeight: "bold", fontSize: "25px" }}
                          >
                            {formatNumberWithDots(item.acturalCost)} VND
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
        </DialogContent>
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

  useEffect(() => {
    dispatch(ServicesAll(token));
  }, [dispatch, token, open]);
  return (
    <Dialog open={open} onClose={handleAddClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Spare Part Item</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
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
  maintenanceTaskName: Yup.string().required("maintenanceTaskName is required"),
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
      maintenanceTaskName: "",
    },
    validationSchema: validationSchemaTaskByCenter,
    onSubmit: async (values, { resetForm }) => {
      const data = {
        informationMaintenanceId: values.informationMaintenanceId,
        technicianId: values.technicianId,
        maintenanceTaskName: values.maintenanceTaskName,
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
      // await dispatch(GetListByCenterAndStatusCheckinAndTaskInactive(token));
      // await dispatch(TechinicanByCenterId({ centerId, token }));

      setReloadAdd(!reloadAdd);
    },
  });

  useEffect(() => {
    dispatch(TechinicanByCenterId({ centerId, token }));
    dispatch(GetListByCenterAndStatusCheckinAndTaskInactive(token));
  }, [dispatch, token, centerId, reloadAdd, open]);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Assign Task</DialogTitle>
      {statustech === "loading" && statusmi === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {statustech === "succeeded" &&
        statusmi === "succeeded" &&
        technicians &&
        maintenanceInformations && (
          <DialogContent>
            <form onSubmit={formik.handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel>FullName Technician</InputLabel>
                <Select
                  label="FullName Technician"
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
                    <MenuItem
                      key={option.technicianId}
                      value={option.technicianId}
                    >
                      FullName: {option.firstName} {option.lastName} - Email:{" "}
                      {option.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="technicianId"
                  label="technicianId"
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
                <InputLabel>Information Name</InputLabel>
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="maintenanceTaskName"
                  label="Name Task"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={formik.values.maintenanceTaskName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.maintenanceTaskName &&
                    Boolean(formik.errors.maintenanceTaskName)
                  }
                  helperText={
                    formik.touched.maintenanceTaskName &&
                    formik.errors.maintenanceTaskName
                  }
                />
              </div>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Add</Button>
              </DialogActions>
            </form>
          </DialogContent>
        )}
    </Dialog>
  );
};

const statusTask = ["ACTIVE", "DONE", "CANCELLED"];

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
          width: "80%",
          maxWidth: "80%",
          height: "80%",
          maxHeight: "100%",
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
              <TaskDetailComponent data={task} setReload={setReload} />
            </Card>
          </DialogTitle>
          {task.responseMainTaskSpareParts.length > 0 && (
            <Grid>
              <TableContainer
                component={Paper}
                style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Avatar</TableCell>
                      <TableCell>Id</TableCell>
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
                              {statusTask.map((status) => (
                                <MenuItem
                                  key={status}
                                  value={status}
                                  disabled={status === item.status}
                                >
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
          )}

          {task.responseMainTaskServices.length > 0 && (
            <Grid>
              <TableContainer
                component={Paper}
                style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Avatar</TableCell>
                      <TableCell>Id</TableCell>
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
                              {statusTask.map((status) => (
                                <MenuItem
                                  key={status}
                                  value={status}
                                  disabled={status === item.status}
                                >
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
          )}
        </>
      )}
      <DialogActions>
        <Button onClick={handleViewClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export const UseFormikCreateReceipt = ({
  open,
  handleClose,
  token,
  informationMaintenanceId,
}) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      informationMaintenanceId: informationMaintenanceId,
      description: "",
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Name is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const data = {
        informationMaintenanceId: informationMaintenanceId,
        description: values.description,
      };
      console.log("formdata create receipt", data);
      await dispatch(CreateReceipt({ token: token, data: data }))
        .then(() => {
          resetForm();
          handleClose();
        })
        .catch((error) => {
          console.error("Failed to add item:", error);
        });
    },
  });
  useEffect(() => {
    console.log("informationMaintenanceId formik:", informationMaintenanceId);
  }, [dispatch, token, informationMaintenanceId, open]);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Receipt</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              autoFocus
              margin="dense"
              name="informationMaintenanceId"
              label="InformationMaintenance Id"
              type="text"
              fullWidth
              variant="standard"
              value={informationMaintenanceId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.informationMaintenanceId &&
                Boolean(formik.errors.informationMaintenanceId)
              }
              disabled={informationMaintenanceId}
              helperText={
                formik.touched.informationMaintenanceId &&
                formik.errors.informationMaintenanceId
              }
            />
          </div>

          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
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

export const AddMaintenanceSparePartInfoesDialog = ({
  open,
  handleClose,
  token,
  informationMaintenanceId,
}) => {
  const dispatch = useDispatch();
  const { sparepartitemscosts } = useSelector((state) => state.sparepartitem);
  const [totalPrice, setTotalPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { main } = useSelector((state) => state.maintenanceInformation);

  const filteredOptions = sparepartitemscosts.filter(
    (option) =>
      option.sparePartsItemName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      option.vehicleModelName.includes(main.responseVehicles.vehicleModelName)
  );

  console.log("inforcare", main.responseVehicles.vehiclesBrandName);
  const formik = useFormik({
    initialValues: {
      maintenanceInformationId: informationMaintenanceId,
      sparePartsItemCostId: "",
      maintenanceSparePartInfoName: "",
      quantity: 1,
      actualCost: 0,
      note: "",
    },
    validationSchema: Yup.object({
      sparePartsItemCostId: Yup.string().required(
        "sparePartsItemCostId is required"
      ),
      maintenanceSparePartInfoName: Yup.string().required(
        "maintenanceSparePartInfoName is required"
      ),
      quantity: Yup.string().required("quantity is required"),
      actualCost: Yup.string().required("actualCost is required"),
      note: Yup.string().required("note is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const data = {
        maintenanceInformationId: informationMaintenanceId,
        sparePartsItemCostId: values.sparePartsItemCostId,
        maintenanceSparePartInfoName: values.maintenanceSparePartInfoName,
        quantity: values.quantity,
        actualCost: values.actualCost,
        note: values.note,
      };
      console.log("formdata AddMaintenanceSparePartInfoesDialog", data);
      await dispatch(
        MaintenanceSparePartInfoesPost({ token: token, data: data })
      )
        .then(() => {
          resetForm();
          handleClose();
        })
        .catch((error) => {
          console.error("Failed to add item:", error);
        });
    },
  });
  useEffect(() => {
    if (informationMaintenanceId) {
      console.log("informationMaintenanceId formik:", informationMaintenanceId);
      const centerId = localStorage.getItem("CenterId");

      dispatch(
        GetListByDifSparePartAndInforId({
          token: token,
          centerId: centerId,
          inforId: informationMaintenanceId,
        })
      );
      dispatch(
        MaintenanceInformationById({ miId: informationMaintenanceId, token })
      );
      const calculatedTotalPrice =
        formik.values.quantity * formik.values.actualCost;
      // const totaldiscount =
      //   calculatedTotalPrice + (calculatedTotalPrice * 10) / 100;
      setTotalPrice(calculatedTotalPrice);
    }
  }, [
    dispatch,
    token,
    informationMaintenanceId,
    formik.values.quantity,
    formik.values.actualCost,
  ]);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create MaintenanceSparePartInfoes </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Autocomplete
            fullWidth
            margin="normal"
            disablePortal
            id="sparePartsItemCostId"
            options={filteredOptions}
            getOptionLabel={(option) =>
              `Name: ${option.sparePartsItemName} - Actual Cost: ${option.acturalCost} - Vehicle: ${option.vehiclesBrandName} ${option.vehicleModelName}`
            }
            onChange={(event, newValue) => {
              const selectedCostId = newValue;
              formik.setFieldValue(
                "sparePartsItemCostId",
                selectedCostId?.sparePartsItemCostId || ""
              );
              formik.setFieldValue(
                "maintenanceSparePartInfoName",
                selectedCostId?.sparePartsItemName || ""
              );
              formik.setFieldValue(
                "actualCost",
                selectedCostId?.acturalCost || ""
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Name"
                name="sparePartsItemCostId"
                value={searchTerm}
                variant="outlined"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.sparePartsItemCostId}>
                {`Name: ${option.sparePartsItemName} - Actual Cost: ${option.acturalCost} - Vehicle: ${option.vehiclesBrandName} ${option.vehicleModelName}`}
              </li>
            )}
          />
          <TextField
            autoFocus
            margin="dense"
            name="maintenanceInformationId"
            label="InformationMaintenance Id"
            type="text"
            fullWidth
            variant="standard"
            value={informationMaintenanceId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.maintenanceInformationId &&
              Boolean(formik.errors.maintenanceInformationId)
            }
            disabled={!formik.values.maintenanceInformationId}
            helperText={
              formik.touched.maintenanceInformationId &&
              formik.errors.maintenanceInformationId
            }
          />

          <TextField
            margin="dense"
            name="maintenanceSparePartInfoName"
            label="MaintenanceSparePartInfoName"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.maintenanceSparePartInfoName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.maintenanceSparePartInfoName &&
              Boolean(formik.errors.maintenanceSparePartInfoName)
            }
            disabled={true}
            helperText={
              formik.touched.maintenanceSparePartInfoName &&
              formik.errors.maintenanceSparePartInfoName
            }
          />
          <TextField
            margin="dense"
            name="quantity"
            label="Quantity"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
          />
          <TextField
            margin="dense"
            name="actualCost"
            label="ActualCost"
            type="number"
            fullWidth
            variant="standard"
            value={formik.values.actualCost}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.actualCost && Boolean(formik.errors.actualCost)
            }
            disabled={formik.values.actualCost !== 0}
            helperText={formik.touched.actualCost && formik.errors.actualCost}
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
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            ${totalPrice}
          </Typography>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const AddMaintenanceServiceInfoesDialog = ({
  open,
  handleClose,
  token,
  informationMaintenanceId,
}) => {
  const dispatch = useDispatch();
  const { maintenanceservicescost } = useSelector(
    (state) => state.maintenanceservice
  );
  const [totalPrice, setTotalPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { main } = useSelector((state) => state.maintenanceInformation);

  const filteredOptions = maintenanceservicescost.filter(
    (option) =>
      option.maintenanceServiceName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      option.vehicleModelName.includes(main.responseVehicles.vehicleModelName)
  );
  const formik = useFormik({
    initialValues: {
      maintenanceInformationId: informationMaintenanceId,
      maintenanceServiceCostId: "",
      maintenanceServiceName: "",
      quantity: 1,
      actualCost: 0,
      note: "",
    },
    validationSchema: Yup.object({
      maintenanceServiceCostId: Yup.string().required(
        "maintenanceServiceCostId is required"
      ),
      maintenanceServiceName: Yup.string().required(
        "maintenanceServiceInfoName is required"
      ),
      quantity: Yup.string().required("quantity is required"),
      actualCost: Yup.string().required("actualCost is required"),
      note: Yup.string().required("note is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const data = {
        maintenanceInformationId: informationMaintenanceId,
        maintenanceServiceCostId: values.maintenanceServiceCostId,
        maintenanceServiceInfoName: values.maintenanceServiceName,
        quantity: 1,
        actualCost: values.actualCost,
        note: values.note,
      };
      console.log("formdata AddMaintenanceServiceInfoesDialog", data);
      await dispatch(MaintenanceServiceInfoesPost({ token: token, data: data }))
        .then(() => {
          resetForm();
          handleClose();
        })
        .catch((error) => {
          console.error("Failed to add item:", error);
        });
    },
  });
  useEffect(() => {
    if (informationMaintenanceId) {
      console.log("informationMaintenanceId formik:", informationMaintenanceId);
      const centerId = localStorage.getItem("CenterId");
      dispatch(
        GetListByDifMaintenanceServiceAndInforId({
          token: token,
          centerId: centerId,
          inforId: informationMaintenanceId,
        })
      );
      dispatch(
        MaintenanceInformationById({ miId: informationMaintenanceId, token })
      );
      const calculatedTotalPrice =
        formik.values.quantity * formik.values.actualCost;
      // const totaldiscount =
      //   calculatedTotalPrice + (calculatedTotalPrice * 10) / 100;
      setTotalPrice(calculatedTotalPrice);
    }
  }, [
    dispatch,
    token,
    informationMaintenanceId,
    formik.values.quantity,
    formik.values.actualCost,
  ]);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create MaintenanceServiceInfoes </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Autocomplete
            fullWidth
            margin="normal"
            disablePortal
            id="maintenanceServiceCostId"
            options={filteredOptions}
            getOptionLabel={(option) =>
              `Name: ${option.maintenanceServiceName} - Actual Cost: ${option.acturalCost}  - Vehicle: ${option.vehiclesBrandName} ${option.vehicleModelName}`
            }
            onChange={(event, newValue) => {
              const selectedCostId = newValue;
              formik.setFieldValue(
                "maintenanceServiceCostId",
                selectedCostId?.maintenanceServiceCostId || ""
              );
              formik.setFieldValue(
                "maintenanceServiceName",
                selectedCostId?.maintenanceServiceName || ""
              );
              formik.setFieldValue(
                "actualCost",
                selectedCostId?.acturalCost || ""
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Name"
                name="maintenanceServiceCostId"
                value={searchTerm}
                variant="outlined"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.maintenanceServiceCostId}>
                {`Name: ${option.maintenanceServiceName} - Actual Cost: ${option.acturalCost} - Vehicle: ${option.vehiclesBrandName} ${option.vehicleModelName}`}
              </li>
            )}
          />
          <TextField
            autoFocus
            margin="dense"
            name="maintenanceInformationId"
            label="InformationMaintenance Id"
            type="text"
            fullWidth
            variant="standard"
            value={informationMaintenanceId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.maintenanceInformationId &&
              Boolean(formik.errors.maintenanceInformationId)
            }
            disabled={!formik.values.maintenanceInformationId}
            helperText={
              formik.touched.maintenanceInformationId &&
              formik.errors.maintenanceInformationId
            }
          />

          <TextField
            margin="dense"
            name="maintenanceServiceName"
            label="MaintenanceServiceName"
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
            disabled={true}
            helperText={
              formik.touched.maintenanceServiceName &&
              formik.errors.maintenanceServiceName
            }
          />
          <TextField
            margin="dense"
            name="quantity"
            label="Quantity"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
            disabled={true}
          />
          <TextField
            margin="dense"
            name="actualCost"
            label="ActualCost"
            type="number"
            fullWidth
            variant="standard"
            value={formik.values.actualCost}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.actualCost && Boolean(formik.errors.actualCost)
            }
            disabled={formik.values.actualCost !== 0}
            helperText={formik.touched.actualCost && formik.errors.actualCost}
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
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            ${totalPrice}
          </Typography>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const ViewListTaskinInforDialog = ({ data, setReload }) => {
  const dispatch = useDispatch();
  const { tasks, statustasks } = useSelector((state) => state.tasks);
  const [imageFile, setImageFile] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);
  const token = localStorage.getItem("localtoken");

  const handleStatusChange = async (sparePartsItemCostId, newStatus) => {
    try {
      await dispatch(
        ChangeStatusSparePartItemCostByCenter({
          token: token,
          id: sparePartsItemCostId,
          status: newStatus,
        })
      );
      // await dispatch(
      //   GetByIdSparePartActiveCost({ token, id: item.sparePartsItemId })
      // );
      setReload((p) => !p);
    } catch (error) {}
  };
  useEffect(() => {
    console.log("Hien trang nay roi");
    if (data) {
      dispatch(
        TaskListGetByInforId({ token, id: data.informationMaintenanceId })
      );
      // dispatch(SparePartItemById({ token, id: item.sparePartsItemId }));
    }
  }, [data, setReload, dispatch, token]);

  return (
    <Dialog
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          width: "80%",
          maxWidth: "80%",
          height: "80%",
          maxHeight: "100%",
        },
      }}
    >
      {statustasks === "loading" && (
        <DialogContent dividers>
          <CircularProgress />
        </DialogContent>
      )}
      {tasks && statustasks === "succeeded" && (
        <>
          <DialogTitle style={{ textAlign: "center", fontWeight: "bolder" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              View List Task
            </div>
            {tasks.map((task) => (
              <Card key={task.maintenanceTaskId}>
                <TaskDetailComponent data={task} setReload={setReload} />
              </Card>
            ))}
          </DialogTitle>
          {tasks.map((task) => {
            task.responseMainTaskSpareParts.length > 0 && (
              <DialogContent dividers key={task.maintenanceTaskId}>
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
                              <ImageMainTask
                                src={item.image}
                                alt={item.image}
                              />
                            </TableCell>
                            <TableCell
                            // style={{ fontWeight: "bold", fontSize: "25px" }}
                            >
                              {item.maintenanceSparePartInfoId}
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              {formatDate(item.createdDate)}
                            </TableCell>
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
                                  {statusTask.map((status) => (
                                    <MenuItem
                                      key={status}
                                      value={status}
                                      disabled={status === item.status}
                                    >
                                      {status}
                                    </MenuItem>
                                  ))}
                                </Select>
                              ) : (
                                <span
                                  className="status"
                                  style={{
                                    ...makeStyle(item.status),
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
            );

            task.responseMainTaskServices.length > 0 && (
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
                              <ImageMainTask
                                src={item.image}
                                alt={item.image}
                              />
                            </TableCell>
                            <TableCell>
                              {item.maintenanceServiceInfoId}
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              {formatDate(item.createdDate)}
                            </TableCell>
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
                                  {statusTask.map((status) => (
                                    <MenuItem
                                      key={status}
                                      value={status}
                                      disabled={status === item.status}
                                    >
                                      {status}
                                    </MenuItem>
                                  ))}
                                </Select>
                              ) : (
                                <span
                                  className="status"
                                  style={{
                                    ...makeStyle(item.status),
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
            );
          })}
        </>
      )}
    </Dialog>
  );
};
