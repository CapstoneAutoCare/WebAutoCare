import {
  Autocomplete,
  Box,
  Button,
  ButtonBase,
  Card,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
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
import ClearIcon from "@mui/icons-material/Clear";
import * as Yup from "yup";

import {
  AddSparePartItemCost,
  AddSparePartItemsByCenter,
  ChangeStatusSparePartItemCostByCenter,
  GetByIdSparePartActiveCost,
  GetListByDifSparePartAndInforId,
  SparePartItemById,
  SparePartItemsByCenterId,
  UpdateSparePartItemByCenter,
} from "../redux/sparepartItemsSlice";
import {
  AddMaintenanceServiceByCenter,
  AddMaintenanceServiceCost,
  AddMaintenanceServicListPost,
  ChangeStatusMaintenanceServiceCostByCenter,
  GetByIdMaintenanceServiceActiveCost,
  GetListByDifMaintenanceServiceAndInforId,
  MaintenanceServicesByCenterId,
  MaintenanceServicesById,
  UpdateMaintenanceServiceByCenter,
} from "../redux/mainserviceSlice";
import { useEffect, useRef, useState } from "react";
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
import {
  GetSpartPartNotSparePartItemId,
  SparePartsAll,
} from "../redux/sparepartsSlice";
import { GetServiceCaresNotInMaintenanceServices } from "../redux/servicesSlice";
import { CardCostComponent } from "../components/MaintenanceInformations/OutlinedCard";
import { makeStyle } from "../components/Booking/Booking";
import {
  AddTaskByCenter,
  DChangeStatusMTServiceInfor,
  DChangeStatusMTSparePartInfor,
  TaskGetById,
  TaskListGetByInforId,
} from "../redux/tasksSlice";
import { TechinicanByCenterId } from "../redux/techinicansSlice";
import { formatDate } from "./Pagination";
import { CreateReceipt } from "../redux/receiptSlice";
import { MaintenanceSparePartInfoesPost } from "../redux/maintenanceSparePartInfoesSlice";
import { MaintenanceServiceInfoesPost } from "../redux/maintenanceServiceInfoesSlice";
import { CreateBrandVehicles } from "../redux/brandSlice";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { VehiclesMaintenancesByCenter } from "../redux/vehiclemainSlice";

const statusOptions = ["ACTIVE", "INACTIVE"];

export const AddSparePartDialog = ({
  open,
  handleClose,
  centerId,
  token,
  setReload,
}) => {
  const dispatch = useDispatch();
  const { spareparts } = useSelector((state) => state.spareparts);
  const { brands } = useSelector((state) => state.brands);
  const { vehiclemodels } = useSelector((state) => state.vehiclemodels);
  const { vehiclemains, statusvehiclemains, errorvehiclemains } = useSelector(
    (state) => state.vehiclemains
  );
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedSpareParts, setSelectedSpareParts] = useState([]);
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const filteredOptionsBrand = vehiclemains.filter((option) =>
    option?.responseBrand?.vehiclesBrandName
      .toLowerCase()
      .includes(brandSearchTerm.toLowerCase())
  );

  const filteredOptionsModel = selectedBrand
    ? vehiclemodels.filter(
      (model) => model.vehiclesBrandId === selectedBrand?.responseBrand?.vehiclesBrandId
    )
    : [];
  const filteredOptionsSparePart = selectedModel
    ? spareparts.filter(
      (part) =>
        part.reponseVehicleModel.vehicleModelId ===
        selectedModel.vehicleModelId
    )
    : [];

  const formik = useFormik({
    initialValues: {
      sparePartsIds: [],
    },
    onSubmit: async (values, { resetForm }) => {
      const data = {
        SparePartsId: values.sparePartsIds,
      };

      try {
        await dispatch(AddSparePartItemsByCenter({ token, data })).then(() => {
          dispatch(SparePartItemsByCenterId({ centerId, token }));
          resetForm();
          handleClose();
          setReload((p) => !p);
          setModelSearchTerm(null);
          setSelectedBrand(null);
          setSelectedModel(null);
          setSelectedSpareParts(null);
          dispatch(GetSpartPartNotSparePartItemId({ token, id: centerId }));
        });
        handleClose();
        setReload((p) => !p);
        dispatch(GetSpartPartNotSparePartItemId({ token, id: centerId }));
      } catch (error) {
        console.error("Failed to add item:", error);
      }
    },
  });

  useEffect(() => {
    if (open) {
      setSelectedSpareParts([]);
      setSelectedBrand(null);
      setSelectedModel(null);
      setBrandSearchTerm("");
      setModelSearchTerm("");
      dispatch(GetSpartPartNotSparePartItemId({ token, id: centerId }));
      dispatch(VehiclesMaintenancesByCenter(centerId));
    }
  }, [dispatch, token, centerId, open, setReload]);

  const handleSparePartChange = (event, option) => {
    if (event.target.checked) {
      setSelectedSpareParts([...selectedSpareParts, option.sparePartId]);
    } else {
      setSelectedSpareParts(
        selectedSpareParts.filter((id) => id !== option.sparePartId)
      );
    }
    formik.setFieldValue("sparePartsIds", [
      ...selectedSpareParts,
      option.sparePartId,
    ]);
  };

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
      <DialogTitle>Thêm Phụ Tùng Trung Tâm</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel
              shrink
              htmlFor="vehiclesBrandId"
              style={{
                backgroundColor: "white",
                padding: "0 8px",
              }}
            >
              Chọn Hãng
            </InputLabel>
            <Autocomplete
              id="vehiclesBrandId"
              fullWidth
              options={filteredOptionsBrand}
              getOptionLabel={(option) =>
                `Hãng xe: ${option?.responseBrand?.vehiclesBrandName} (Mã: ${option?.responseBrand?.vehiclesBrandId})`
              }
              onChange={(event, newValue) => {
                setSelectedBrand(newValue);
                setSelectedModel(null);
              }}
              renderOption={(props, option) => (
                <li {...props} key={option?.responseBrand?.vehiclesBrandId}>
                  <img
                    src={option?.responseBrand?.logo}
                    alt={option?.responseBrand?.vehiclesBrandName}
                    style={{
                      width: 40,
                      height: 40,
                      marginRight: 10,
                      objectFit: "contain",
                    }}
                  />
                  <div>
                    <div>Hãng xe: {option?.responseBrand?.vehiclesBrandName}</div>
                    <div style={{ fontSize: "0.8em", color: "gray" }}>
                      Mã: {option?.responseBrand?.vehiclesBrandId}
                    </div>
                  </div>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  onChange={(e) => setBrandSearchTerm(e.target.value)}
                />
              )}
            />
          </FormControl>

          {selectedBrand && (
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel
                shrink
                htmlFor="vehicleModelId"
                style={{
                  backgroundColor: "white",
                  padding: "0 8px",
                }}
              >
                Chọn Loại Xe
              </InputLabel>
              <Autocomplete
                id="vehiclesModelId"
                fullWidth
                options={filteredOptionsModel}
                getOptionLabel={(option) =>
                  `Loại xe:  ${option.vehicleModelName} (Mã: ${option.vehicleModelId})`
                }
                onChange={(event, newValue) => {
                  setSelectedModel(newValue);
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.vehicleModelId}>
                    <img
                      src={option?.logo}
                      alt={option.vehicleModelName}
                      style={{
                        width: 40,
                        height: 40,
                        marginRight: 10,
                        objectFit: "contain",
                      }}
                    />
                    <div>
                      <div>Xe {option.vehicleModelName}</div>
                      <div style={{ fontSize: "0.8em", color: "gray" }}>
                        Mã: {option.vehicleModelId}
                      </div>
                    </div>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    onChange={(e) => setModelSearchTerm(e.target.value)}
                  />
                )}
              />
            </FormControl>
          )}

          {selectedModel && (
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel shrink htmlFor="sparePartId">
                Chọn Phụ Tùng
              </InputLabel>
              <FormGroup>
                {filteredOptionsSparePart.map((option) => (
                  <FormControlLabel
                    key={option.sparePartId}
                    control={
                      <Checkbox
                        checked={selectedSpareParts.includes(
                          option.sparePartId
                        )}
                        onChange={(event) =>
                          handleSparePartChange(event, option)
                        }
                      />
                    }
                    label={`${option.sparePartName} - Giá ${option?.originalPrice} VND (Mã: ${option.sparePartId})`}
                  />
                ))}
              </FormGroup>
            </FormControl>
          )}

          <DialogActions>
            <Button
              onClick={() => {
                handleClose();
                formik.resetForm();
              }}
            >
              Trả Về
            </Button>
            <Button type="submit">Thêm</Button>
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
  setReload,
}) => {
  const dispatch = useDispatch();

  const { vehiclemains, statusvehiclemains, errorvehiclemains } = useSelector(
    (state) => state.vehiclemains
  );
  const { vehiclemodels, statusvehiclemodels, errorvehiclemodels } =
    useSelector((state) => state.vehiclemodels);
  const { schedules, statusschedules, errorschedules } = useSelector(
    (state) => state.schedules
  );
  const { services, statusservices } = useSelector((state) => state.services);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [schedulePackage, setSchedulePackage] = useState(null);
  const [serviceselects, setServiceselects] = useState([]);
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [scheduleSearchTerm, setScheduleSearchTerm] = useState("");
  const filteredOptionsBrand = vehiclemains.filter((option) =>
    option?.responseBrand?.vehiclesBrandName
      .toLowerCase()
      .includes(brandSearchTerm.toLowerCase())
  );

  const filteredOptionsModel = selectedBrand
    ? vehiclemodels.filter(
      (model) => model.vehiclesBrandId === selectedBrand.responseBrand.vehiclesBrandId
    )
    : [];
  const filteredOptionsSchedule = selectedModel
    ? schedules.filter(
      (model) => model.vehicleModelId === selectedModel.vehicleModelId
    )
    : [];
  const filteredOptionsService = schedulePackage
    ? services.filter(
      (model) =>
        model.maintananceScheduleId === schedulePackage.maintananceScheduleId
    )
    : [];
  const formik = useFormik({
    initialValues: {
      serviceCareIds: [],
    },
    onSubmit: async (values, { resetForm }) => {
      const data = {
        serviceCareIds: values.serviceCareIds,
      };
      await dispatch(AddMaintenanceServicListPost({ token, data }))
        .then(() => {
          dispatch(MaintenanceServicesByCenterId({ centerId, token }));
          resetForm();
          handleClose();
          setReload((p) => !p);
          handleClose();
          setSelectedBrand(null);
          setSelectedModel(null);
          setSchedulePackage(null);
          setBrandSearchTerm("");
          setModelSearchTerm("");
          setScheduleSearchTerm("");
          formik.resetForm();
        })
        .catch((error) => {
          console.error("Failed to add item:", error);
        });
      setReload((p) => !p);
      setSelectedBrand(null);
      setSelectedModel(null);
      setSchedulePackage(null);
      setBrandSearchTerm("");
      setModelSearchTerm("");
      setScheduleSearchTerm("");
      resetForm();
    },
  });
  const [searchTerm, setSearchTerm] = useState("");
  const filteredOptions = services.filter((option) =>
    option.serviceCareName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleServiceChange = (event, option) => {
    if (event.target.checked) {
      setServiceselects([...serviceselects, option.serviceCareId]);
    } else {
      setServiceselects(
        serviceselects.filter((id) => id !== option.serviceCareId)
      );
    }
    formik.setFieldValue("serviceCareIds", [
      ...serviceselects,
      option.serviceCareId,
    ]);
  };
  useEffect(() => {
    if (open) {
      setServiceselects([]);
      setSelectedBrand(null);
      setSelectedModel(null);
      setBrandSearchTerm("");
      setModelSearchTerm("");
      dispatch(GetServiceCaresNotInMaintenanceServices({ token, centerId }));
      dispatch(VehiclesMaintenancesByCenter(centerId));

    }
  }, [dispatch, token, centerId, open, setReload]);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Thêm Dịch Vụ Trong Gói </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel
              shrink
              htmlFor="vehiclesBrandId"
              style={{
                backgroundColor: "white",
                padding: "0 8px",
              }}
            >
              Chọn Hãng
            </InputLabel>
            <Autocomplete
              id="vehiclesBrandId"
              key={filteredOptionsBrand?.responseBrand?.vehiclesBrandId}
              fullWidth
              options={filteredOptionsBrand}
              getOptionLabel={(option) =>
                `Hãng xe: ${option?.responseBrand?.vehiclesBrandName} (Mã: ${option?.responseBrand?.vehiclesBrandId})`
              }
              onChange={(event, newValue) => {
                setSelectedBrand(newValue);
                setSelectedModel(null);
                setModelSearchTerm(null);
                setScheduleSearchTerm(null);
                setSchedulePackage(null);
                setServiceselects([]);
                console.log("Hãng xe: ", newValue);
              }}
              renderOption={(props, option) => (
                <li {...props} key={option.responseBrand?.vehiclesBrandId}>
                  <img
                    src={option?.responseBrand?.logo}
                    alt={option?.responseBrand?.vehiclesBrandName}
                    style={{
                      width: 40,
                      height: 40,
                      marginRight: 10,
                      objectFit: "contain",
                    }}
                  />
                  <div>
                    <div>Hãng xe: {option?.responseBrand?.vehiclesBrandName}</div>
                    <div style={{ fontSize: "0.8em", color: "gray" }}>
                      Mã: {option?.responseBrand?.vehiclesBrandId}
                    </div>
                  </div>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  onChange={(e) => {
                    setBrandSearchTerm(e.target.value);
                    setSelectedModel(null);
                    setModelSearchTerm(null);
                    setScheduleSearchTerm(null);
                  }}
                />
              )}
            />
          </FormControl>

          {selectedBrand && (
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel
                shrink
                htmlFor="vehicleModelId"
                style={{
                  backgroundColor: "white",
                  padding: "0 8px",
                }}
              >
                Chọn Loại Xe
              </InputLabel>
              <Autocomplete
                id="vehiclesModelId"
                fullWidth
                options={filteredOptionsModel}
                key={selectedBrand?.vehiclesBrandId}
                getOptionLabel={(option) =>
                  `Loại xe:  ${option.vehicleModelName} (Mã: ${option.vehicleModelId})`
                }
                onChange={(event, newValue) => {
                  setSelectedModel(newValue);
                  setScheduleSearchTerm(null);
                  setSchedulePackage(null);
                  setServiceselects([]);

                  console.log("Loai xe: ", newValue);
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.vehiclesModelId}>
                    <img
                      src={option?.logo}
                      alt={option.vehiclesBrandName}
                      style={{
                        width: 40,
                        height: 40,
                        marginRight: 10,
                        objectFit: "contain",
                      }}
                    />
                    <div>
                      <div>Xe {option.vehicleModelName}</div>
                      <div style={{ fontSize: "0.8em", color: "gray" }}>
                        Mã: {option.vehicleModelId}
                      </div>
                    </div>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    onChange={(e) => {
                      setModelSearchTerm(e.target.value);
                      setScheduleSearchTerm(null);
                      setSchedulePackage(null);
                      console.log(e.target.value);
                    }}
                  />
                )}
              />
            </FormControl>
          )}
          {selectedModel && (
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel
                shrink
                htmlFor="vehicleModelId"
                style={{
                  backgroundColor: "white",
                  padding: "0 8px",
                }}
              >
                Chọn Gói Odo
              </InputLabel>
              <Autocomplete
                id="maintananceScheduleId"
                fullWidth
                options={filteredOptionsSchedule}
                key={selectedModel?.vehicleModelId}
                getOptionLabel={(option) =>
                  `Gói odo:  ${option?.maintananceScheduleName} (Mã: ${option?.maintananceScheduleId})`
                }
                onChange={(event, newValue) => {
                  setSchedulePackage(newValue);
                  setServiceselects([]);

                  console.log("Gói: ", newValue);
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.maintananceScheduleId}>
                    <img
                      src={option?.logo}
                      alt={option.maintananceScheduleName}
                      style={{
                        width: 40,
                        height: 40,
                        marginRight: 10,
                        objectFit: "contain",
                      }}
                    />
                    <div>
                      <div>Gói odo {option.maintananceScheduleName}</div>
                      <div style={{ fontSize: "0.8em", color: "gray" }}>
                        Mã: {option.maintananceScheduleId}
                      </div>
                    </div>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    onChange={(e) => {
                      setModelSearchTerm(e.target.value);
                      console.log(e.target.value);
                    }}
                  />
                )}
              />
            </FormControl>
          )}
          {schedulePackage && (
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel shrink htmlFor="serviceCareId">
                Chọn Dịch Vụ
              </InputLabel>
              <FormGroup>
                {filteredOptionsService.map((option) => (
                  <FormControlLabel
                    key={option.serviceCareId}
                    control={
                      <Checkbox
                        checked={serviceselects?.includes(
                          option?.serviceCareId
                        )}
                        onChange={(event) => handleServiceChange(event, option)}
                      />
                    }
                    label={`${option?.serviceCareName} - Giá ${option?.originalPrice} VND (Mã: ${option?.serviceCareId})`}
                  />
                ))}
              </FormGroup>
            </FormControl>
          )}

          <DialogActions>
            <Button onClick={handleClose}>Trả Về</Button>
            <Button type="submit">Thêm</Button>
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
          width: "70%",
          maxWidth: "70%",
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
  setReload,
}) => {
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      status: item?.status || "ACTIVE",
      sparePartsItemName: item?.sparePartsItemName || "",
      image: item?.image || "",
      capacity: item?.capacity || 50,
      sparePartsItemType: item?.sparePartsItemType || "",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Status is required"),
      sparePartsItemName: Yup.string().required(
        "Spare Part Item Name is required"
      ),
      sparePartsItemType: Yup.string().required(
        "sparePartsItemType is required"
      ),
      capacity: Yup.number()
        .min(1, "Capacity must be at least 1")
        .required("Capacity is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
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
          resetForm();
          setReload((c) => !c);
        });
        setReload((c) => !c);
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
        sparePartsItemType: item.sparePartsItemType || "",
        capacity: item.capacity || 50,
      });
    }
  }, [dispatch, item, token, setReload]);
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
        Cập Nhật Phụ Tùng Trung Tâm
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
                label="Tên Phụ Tùng"
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
                label="Loại"
                name="sparePartsItemType"
                value={formik.values.sparePartsItemType}
                onChange={formik.handleChange}
                error={
                  formik.touched.sparePartsItemType &&
                  Boolean(formik.errors.sparePartsItemType)
                }
                helperText={
                  formik.touched.sparePartsItemType &&
                  formik.errors.sparePartsItemType
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Hình Ảnh"
                name="image"
                type="file"
                onChange={handleFileChange}
                error={formik.touched.image && Boolean(formik.errors.image)}
                helperText={formik.touched.image && formik.errors.image}
                fullWidth
                margin="normal"
              />
              {/* <TextField
                label="Chứa"
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
              /> */}
              <DialogActions>
                <Button type="submit" color="primary">
                  Cập Nhật
                </Button>
                <Button
                  onClick={() => {
                    handleClose();
                    formik.resetForm();
                  }}
                >
                  Đóng
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};
const packageOptions = [
  { label: "Có Gói", value: true },
  { label: "Không Có Gói", value: false },
];
export const UpdateMaintenanceServiceDialog = ({
  open,
  handleClose,
  token,
  item,
  setReload,
}) => {
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (item) {
      formik.setValues({
        status: item.status || "ACTIVE",
        maintenanceServiceName: item.maintenanceServiceName || "",
        image: item.image || "",
        boolean: item.boolean,
      });
    }
  }, [dispatch, item, setReload]);

  const formik = useFormik({
    initialValues: {
      status: item?.status || "ACTIVE",
      maintenanceServiceName: item?.maintenanceServiceName || "",
      image: item?.image || "",
      boolean: item?.boolean,
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Status is required"),
      maintenanceServiceName: Yup.string().required(
        "Spare Part Item Name is required"
      ),
      boolean: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
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
        ).then(() => {
          handleClose();
          resetForm();
        });
        setReload((p) => !p);
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
        Cập Nhật Dịch Vụ Trung Tâm
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
              <FormControl fullWidth margin="normal">
                <InputLabel>Chọn Gói</InputLabel>
                <Select
                  label="Chọn Gói"
                  name="boolean"
                  value={formik.values.boolean}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.boolean && Boolean(formik.errors.boolean)
                  }
                >
                  {packageOptions.map((option) => (
                    <MenuItem key={option} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Tên Dịch Vụ"
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
                label="Hình Ảnh"
                name="image"
                type="file"
                onChange={handleFileChange}
                error={formik.touched.image && Boolean(formik.errors.image)}
                helperText={formik.touched.image && formik.errors.image}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <DialogActions>
                <Button type="submit" color="primary">
                  Cập Nhật
                </Button>
                <Button
                  onClick={() => {
                    handleClose();
                    formik.resetForm();
                  }}
                >
                  Đóng
                </Button>
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
  const role = localStorage.getItem("ROLE");
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
    } catch (error) { }
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

            {role === "CENTER" && (
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
            )}

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
        <Button onClick={handleViewClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

const validationSchemaMaintenanceServicesCost = Yup.object({
  acturalCost: Yup.number()
    .required("Nhập Tiền")
    .min(1000, "Thấp nhất là 1000 VND"),
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
    // dispatch(ServicesAll(token));
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
            <Button onClick={handleAddClose}>Trả Về</Button>
            <Button type="submit">Thêm</Button>
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
  const role = localStorage.getItem("ROLE");

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
    } catch (error) { }
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
            {role === "CENTER" && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                Xem Danh Sách Giá
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddClickOpen}
                >
                  Thêm Giá Mới
                </Button>
              </div>)}

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
                      <TableCell>Mã Giá</TableCell>
                      <TableCell>Giá</TableCell>
                      <TableCell>Ngày Tạo</TableCell>
                      <TableCell>Ghi Chú</TableCell>
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
        <Button onClick={handleViewClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};
const validationSchemaSparePartItemsCost = Yup.object({
  acturalCost: Yup.number()
    .required("Nhập Tiền")
    .min(1000, "Thấp nhất là 1000 VND"),
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
    // dispatch(ServicesAll(token));
  }, [dispatch, token, open]);
  return (
    <Dialog open={open} onClose={handleAddClose} maxWidth="md" fullWidth>
      <DialogTitle>Thêm Phụ Tùng Trung Tâm</DialogTitle>
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
            <Button onClick={handleAddClose}>Trả Về</Button>
            <Button type="submit">Thêm</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const validationSchemaTaskByCenter = Yup.object({
  technicianId: Yup.string().required("Yêu cầu thêm nhân viên"),
  informationMaintenanceId: Yup.string().required(
    "Yêu cầu thêm thông tin"
  ),
  maintenanceTaskName: Yup.string().required("Yêu cầu thêm thông tin"),
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
    dispatch(
      GetListByCenterAndStatusCheckinAndTaskInactive({ token, centerId })
    );
  }, [dispatch, token, centerId, reloadAdd, open]);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Bàn giao xe cho nhân viên</DialogTitle>
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
                <InputLabel>Tên Nhân Viên</InputLabel>
                <Select
                  label="Tên Nhân Viên"
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
                  label="Mã Nhân Viên"
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
                <InputLabel>Thông Tin Sửa Chữa</InputLabel>
                <Select
                  label="Thông Tin Sửa Chữa"
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
                      {"Xe: "}
                      {option.responseVehicles?.vehiclesBrandName}{" "}
                      {option.responseVehicles?.vehicleModelName}
                      {" - "}
                      {option.responseVehicles?.licensePlate}
                      {"- Ghi Chú: "}
                      {option.note} {"- Tiền: "}
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
                  label="Mã Thông Tin"
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
                  label="Giao Việc"
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
                <Button onClick={handleClose}>Trả Về</Button>
                <Button type="submit">Thêm</Button>
              </DialogActions>
            </form>
          </DialogContent>
        )}
    </Dialog>
  );
};

// const statusTask = ["ACTIVE", "DONE", "CANCELLED"];
const statusTask = ["ACTIVE", "DONE"];
const statusMapTotalTask = {
  ACTIVE: "Tiếp Nhận",
  DONE: "Hoàn Thành",
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

  const handleStatusChangeMTSsI = async (
    maintenanceTaskServiceInfoId,
    newStatus
  ) => {
    try {
      await dispatch(
        DChangeStatusMTServiceInfor({
          token: token,
          id: maintenanceTaskServiceInfoId,
          status: newStatus,
        })
      );
      setReload(!reload);
    } catch (error) { }
  };

  const handleStatusChangeMTSpI = async (
    maintenanceTaskSparePartInfoId,
    newStatus
  ) => {
    try {
      await dispatch(
        DChangeStatusMTSparePartInfor({
          token: token,
          id: maintenanceTaskSparePartInfoId,
          status: newStatus,
        })
      );
      setReload(!reload);
    } catch (error) { }
  };

  useEffect(() => {
    if (item) {
      dispatch(TaskGetById({ token, id: item.maintenanceTaskId }));
      // dispatch(SparePartItemById({ token, id: item.sparePartsItemId }));
    }
  }, [item, reload, dispatch]);

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
              Xem Danh Sách Giao Việc
            </div>

            <Card>
              <TaskDetailComponent data={task} setReload={setReload} />
            </Card>
          </DialogTitle>
          <Grid>
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
                        <TableCell>Tên Phụ Tùng </TableCell>
                        <TableCell>Ngày Tạo</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {task.responseMainTaskSpareParts.map((item) => (
                        <TableRow key={item.maintenanceTaskSparePartInfoId}>
                          <TableCell>
                            <ImageMainTask src={item.image} alt={item.image} />
                          </TableCell>
                          <TableCell>
                            {item.maintenanceTaskSparePartInfoId}
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{formatDate(item.createdDate)}</TableCell>
                          <TableCell>
                            {item.status === "ACTIVE" ? (
                              <Select
                                value={item.status}
                                onChange={(event) => {
                                  const newStatus = event.target.value;
                                  handleStatusChangeMTSpI(
                                    item.maintenanceTaskSparePartInfoId,
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
                                    {statusMapTotalTask[status]}
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
                                {statusMapTotalTask[item.status]}
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
                        <TableCell>Tên Dịch Vụ </TableCell>
                        <TableCell>Ngày Tạo</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {task.responseMainTaskServices.map((item) => (
                        <TableRow key={item.maintenanceTaskServiceInfoId}>
                          <TableCell>
                            <ImageMainTask src={item.image} alt={item.image} />
                          </TableCell>
                          <TableCell>
                            {item.maintenanceTaskServiceInfoId}
                          </TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{formatDate(item.createdDate)}</TableCell>
                          <TableCell>
                            {item.status === "ACTIVE" ? (
                              <Select
                                value={item.status}
                                onChange={(event) => {
                                  const newStatus = event.target.value;
                                  handleStatusChangeMTSsI(
                                    item.maintenanceTaskServiceInfoId,
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
                                    {statusMapTotalTask[status]}
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
                                {statusMapTotalTask[item.status]}
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
          </Grid>
        </>
      )}
      <DialogActions>
        <Button onClick={handleViewClose}>Đóng</Button>
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
      <DialogTitle>Tạo Hóa Đơn</DialogTitle>
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
            <Button onClick={handleClose}>Trả Về</Button>
            <Button type="submit">Thêm</Button>
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
      option.vehicleModelId.includes(main.responseVehicles.vehicleModelId)
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
      <DialogTitle>Tạo Thông Tin Phụ Tùng Thay Thế </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Autocomplete
            fullWidth
            margin="normal"
            disablePortal
            id="sparePartsItemCostId"
            options={filteredOptions}
            getOptionLabel={(option) =>
              `Tên: ${option.sparePartsItemName} - Giá: ${option.acturalCost} - Xe: ${option.vehiclesBrandName} ${option.vehicleModelName} `
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
                label="Tên"
                name="sparePartsItemCostId"
                value={searchTerm}
                variant="outlined"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.sparePartsItemCostId}>
                {`Tên: ${option.sparePartsItemName} - Giá: ${option.acturalCost} - Xe: ${option.vehiclesBrandName} ${option.vehicleModelName} `}
              </li>
            )}
          />
          <TextField
            autoFocus
            margin="dense"
            name="maintenanceInformationId"
            label="Mã Thông Tin"
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
            label="Tên"
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
            label="Số Lượng"
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
            label="Giá"
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
            label="Ghi Chú"
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
            {totalPrice} VND
          </Typography>
          <DialogActions>
            <Button onClick={handleClose}>Trả Về</Button>
            <Button type="submit">Thêm</Button>
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

  const filteredOptions = maintenanceservicescost.filter((option) => {
    const vehicleModelName = option.vehicleModelId || "";
    const searchVehicleModelName = main.responseVehicles.vehicleModelId || "";

    return (
      option.maintenanceServiceName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      vehicleModelName.includes(searchVehicleModelName)
    );
  });
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
      <DialogTitle>Tạo Dịch Vụ Thay Thế </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Autocomplete
            fullWidth
            margin="normal"
            disablePortal
            id="maintenanceServiceCostId"
            options={filteredOptions}
            getOptionLabel={(option) =>
              `Tên: ${option.maintenanceServiceName} - Giá: ${option.acturalCost}  - Xe: ${option.vehiclesBrandName} ${option.vehicleModelName}`
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
                {`Tên: ${option.maintenanceServiceName} - Giá: ${option.acturalCost} - Xe: ${option.vehiclesBrandName} ${option.vehicleModelName} `}
              </li>
            )}
          />
          <TextField
            autoFocus
            margin="dense"
            name="maintenanceInformationId"
            label="Mã Thông Tin"
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
            label="Tên"
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
            label="Số Lượng"
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
            label="Giá"
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
            label="Ghi Chú"
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
            {totalPrice} VND
          </Typography>
          <DialogActions>
            <Button onClick={handleClose}>Trả Về</Button>
            <Button type="submit">Thêm</Button>
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
    } catch (error) { }
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
              Danh Sách Giao Việc Chi Tiết
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
                          <TableCell>Mã Phụ Tùng Thay Thế</TableCell>
                          <TableCell>Tên Phụ Tùng Làm</TableCell>
                          <TableCell>Ngày Tạo</TableCell>

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
                          <TableCell>Mã Dịch Vụ Thay Thế</TableCell>
                          <TableCell>Tên Dịch Vụ Làm</TableCell>
                          <TableCell>Ngày Tạo</TableCell>
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
