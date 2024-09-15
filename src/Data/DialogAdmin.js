import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { BrandGetAllList, CreateBrandVehicles, CreatePackage } from "../redux/brandSlice";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ErrorMessage, Field, Form, Formik, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { CreateVehiclesModelPost } from "../redux/vehiclemodelsSlice";
import { CreateSchedulePost } from "../redux/scheduleSlice";
import {
  CreateSpartPartPost,
  SparePartsAll,
  UpdateSpartPartPut,
} from "../redux/sparepartsSlice";
import {
  CreateServicePost,
  ServicesListGetAll,
  UpdateServicePut,
} from "../redux/servicesSlice";
import { UpdateSparePartItemByCenter } from "../redux/sparepartItemsSlice";
import { PostCenter } from "../redux/centerSlice";
import { CreateCustomerCarePost } from "../redux/customercareSlice";
import { CreateTechPost } from "../redux/techinicansSlice";
import { storage } from "./firebase";
import {
  AddMaintenanceServiceByCenter,
  MaintenanceServicesByCenterId,
} from "../redux/mainserviceSlice";
import { CreateOdoHisotryPost } from "../redux/odohistory";
import axios from "axios";
const statusOptions = ["ACTIVE", "INACTIVE"];

export const AddBrandVehicleDialog = ({
  open,
  handleClose,
  token,
  setReload,
}) => {
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      vehiclesBrandName: "",
      vehiclesBrandDescription: "",
      logo: "",
    },
    validationSchema: Yup.object({
      vehiclesBrandName: Yup.string().required(
        "Yêu cầu tên hãng xe"
      ),
      vehiclesBrandDescription: Yup.string().required(
        "Yêu cầu mô tả"
      ),
    }),
    onSubmit: async (values) => {
      try {
        let imageUrl = values.logo;
        // if (imageFile) {
        //   const storageRef = ref(storage, `images/${imageFile.name}`);
        //   await uploadBytes(storageRef, imageFile);
        //   imageUrl = await getDownloadURL(storageRef);
        // }
        await dispatch(
          CreateBrandVehicles({
            token: token,
            data: { ...values, logo: "" },
          })
        );
        setReload((p) => !p);
        handleClose();
      } catch (error) {
        console.error("Failed to add brand vehicle", error);
      }
    },
  });
  console.log("Formik errors: ", formik.errors);
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    formik.setFieldValue("logo", e.target.files[0].name);
  };

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      setImageFile("");
    }
  }, [open, setReload]);

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
      <DialogTitle>Thêm Hãng Mới</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          {/* <TextField
            label="Logo"
            name="logo"
            type="file"
            onChange={handleFileChange}
            error={formik.touched.logo && Boolean(formik.errors.logo)}
            helperText={formik.touched.logo && formik.errors.logo}
            fullWidth
            margin="normal"
          /> */}
          <TextField
            autoFocus
            margin="dense"
            name="vehiclesBrandName"
            label="Tên Hãng Xe"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.vehiclesBrandName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.vehiclesBrandName &&
              Boolean(formik.errors.vehiclesBrandName)
            }
            helperText={
              formik.touched.vehiclesBrandName &&
              formik.errors.vehiclesBrandName
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            margin="dense"
            name="vehiclesBrandDescription"
            label="Mô Tả Hãng Xe"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.vehiclesBrandDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.vehiclesBrandDescription &&
              Boolean(formik.errors.vehiclesBrandDescription)
            }
            helperText={
              formik.touched.vehiclesBrandDescription &&
              formik.errors.vehiclesBrandDescription
            }
          />

          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit">Thêm</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const AddPackageDialog = ({
  open,
  handleClose,
  token,
  setReload,
}) => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: "",
      quantitySparepartAllowUsed: 30,
      quantityMaintenanceServiceAllowUsed: 30,
      description: "",
      monthlyPrice: 1,
      durationMonths: 1,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(
        "Yêu cầu tên gói"
      ),
      quantitySparepartAllowUsed: Yup.number().required(
        "Yêu cầu số lượng phụ tùng"
      ).min(30, "Thấp nhất là 30"),
      quantityMaintenanceServiceAllowUsed: Yup.number().required(
        "Yêu cầu số lượng dịch vụ"
      ).min(30, "Thấp nhất là 30"),
      description: Yup.string().required(
        "Yêu cầu mô tả"
      ),
      monthlyPrice: Yup.number().required(
        "Yêu cầu giá hàng tháng"
      ).min(100000, "Thấp nhất là 100.000 VND"),
      durationMonths: Yup.number().required(
        "Yêu cầu thời gian"
      ).min(1, "Thấp nhất là 1"),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(
          CreatePackage({
            token: token,
            data: { ...values },
          })
        );
        setReload((p) => !p);
        handleClose();
      } catch (error) {
        console.error("Failed to package", error);
      }
    },
  });
  console.log("Formik errors: ", formik.errors);


  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open, setReload]);

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
      <DialogTitle>Thêm Gói Đăng Kí</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Tên Gói"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.name &&
              Boolean(formik.errors.name)
            }
            helperText={
              formik.touched.name &&
              formik.errors.name
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            margin="dense"
            name="quantitySparepartAllowUsed"
            label="Số Lượng Phụ Tùng"
            type="number"
            fullWidth
            variant="standard"
            value={formik.values.quantitySparepartAllowUsed}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.quantitySparepartAllowUsed &&
              Boolean(formik.errors.quantitySparepartAllowUsed)
            }
            helperText={
              formik.touched.quantitySparepartAllowUsed &&
              formik.errors.quantitySparepartAllowUsed
            }
          />

          <TextField
            margin="dense"
            name="quantityMaintenanceServiceAllowUsed"
            label="Số Lượng Dịch Vụ"
            type="number"
            fullWidth
            variant="standard"
            value={formik.values.quantityMaintenanceServiceAllowUsed}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.quantityMaintenanceServiceAllowUsed &&
              Boolean(formik.errors.quantityMaintenanceServiceAllowUsed)
            }
            helperText={
              formik.touched.quantityMaintenanceServiceAllowUsed &&
              formik.errors.quantityMaintenanceServiceAllowUsed
            }
          />


          <TextField
            margin="dense"
            name="description"
            label="Mô Tả"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description &&
              Boolean(formik.errors.description)
            }
            helperText={
              formik.touched.description &&
              formik.errors.description
            }
            multiline
            rows={4}
          />



          <TextField
            margin="dense"
            name="monthlyPrice"
            label="Giá Hàng Tháng"
            type="number"
            fullWidth
            variant="standard"
            value={formik.values.monthlyPrice}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.monthlyPrice &&
              Boolean(formik.errors.monthlyPrice)
            }
            helperText={
              formik.touched.monthlyPrice &&
              formik.errors.monthlyPrice
            }
          />
          <TextField
            margin="dense"
            name="durationMonths"
            label="Thời Gian Tháng"
            type="number"
            fullWidth
            variant="standard"
            value={formik.values.durationMonths}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.durationMonths &&
              Boolean(formik.errors.durationMonths)
            }
            helperText={
              formik.touched.durationMonths &&
              formik.errors.durationMonths
            }
          />

          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="submit">Thêm</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const AddVehicleModelDialog = ({
  open,
  handleClose,
  token,
  setReload,
}) => {
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const { brands, statusbrands, errorbrands } = useSelector(
    (state) => state.brands
  );
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = brands.filter((option) =>
    option.vehiclesBrandName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const formik = useFormik({
    initialValues: {
      vehiclesBrandId: "",
      vehicleModelName: "",
      image: "",
      vehicleModelDecription: "",
    },
    validationSchema: Yup.object({
      vehiclesBrandId: Yup.string().required("Yêu cầu tên hãng xe"),
      vehicleModelName: Yup.string().required("Yêu cầu loại xe"),
      vehicleModelDecription: Yup.string().required(
        "Yêu cầu mô tả"
      ),
    }),
    onSubmit: async (values) => {
      try {
        // let imageUrl = values.image;
        // if (imageFile) {
        //   const storageRef = ref(storage, `images/${imageFile.name}`);
        //   await uploadBytes(storageRef, imageFile);
        //   imageUrl = await getDownloadURL(storageRef);
        // }
        await dispatch(
          CreateVehiclesModelPost({
            token: token,
            data: { ...values, image: "" },
          })
        );
        setReload((p) => !p);
        handleClose();
      } catch (error) {
        console.error("Failed to add model vehicle", error);
      }
    },
  });

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    formik.setFieldValue("image", e.target.files[0].name);
  };

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      setImageFile(null);
    }
  }, [dispatch, open, setReload]);

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
      <DialogTitle>Thêm Loại Xe</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <InputLabel
            shrink
            htmlFor="vehiclesBrandId"
            style={{
              backgroundColor: "white",
              padding: "0 8px",
            }}
          >
            Chọn Hãng Xe
          </InputLabel>
          <Autocomplete
            // label="Chọn Hãng Xe"
            fullWidth
            margin="normal"
            disablePortal
            id="vehiclesBrandId"
            options={filteredOptions}
            getOptionLabel={(option) =>
              `Tên Hãng: ${option.vehiclesBrandName} - Mã Hãng Xe: ${option.vehiclesBrandId} `
            }
            onChange={(event, newValue) => {
              const selectedId = newValue;
              formik.setFieldValue(
                "vehiclesBrandId",
                selectedId?.vehiclesBrandId || ""
              );
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.vehiclesBrandId}>
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
                  <div>Hãng xe: {option.vehiclesBrandName}</div>
                  <div style={{ fontSize: "0.8em", color: "gray" }}>
                    Mã: {option.vehiclesBrandId}
                  </div>
                </div>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                // label="Chọn Hãng Xe"
                name="vehiclesBrandId"
                value={searchTerm}
                variant="outlined"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* <TextField
            label="Logo"
            name="image"
            type="file"
            onChange={handleFileChange}
            error={formik.touched.image && Boolean(formik.errors.image)}
            helperText={formik.touched.image && formik.errors.image}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          /> */}
          <TextField
            autoFocus
            margin="dense"
            name="vehicleModelName"
            label="Tên Loại Xe"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.vehicleModelName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.vehicleModelName &&
              Boolean(formik.errors.vehicleModelName)
            }
            helperText={
              formik.touched.vehicleModelName && formik.errors.vehicleModelName
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            margin="dense"
            name="vehicleModelDecription"
            label="Mô Tả Loại Xe"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.vehicleModelDecription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.vehicleModelDecription &&
              Boolean(formik.errors.vehicleModelDecription)
            }
            helperText={
              formik.touched.vehicleModelDecription &&
              formik.errors.vehicleModelDecription
            }
          />

          <DialogActions>
            <Button
              onClick={() => {
                formik.resetForm();
                handleClose();
              }}
            >
              Huy
            </Button>
            <Button type="submit">Thêm</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const AddScheduleDialog = ({ open, handleClose, token, setReload }) => {
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const { brands, statusbrands, errorbrands } = useSelector(
    (state) => state.brands
  );
  const { vehiclemodels, statusvehiclemodels, errorvehiclemodels } =
    useSelector((state) => state.vehiclemodels);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [modelSearchTerm, setModelSearchTerm] = useState("");

  const filteredOptionsBrand = brands.filter((option) =>
    option.vehiclesBrandName
      .toLowerCase()
      .includes(brandSearchTerm.toLowerCase())
  );

  const filteredOptionsModel = selectedBrand
    ? vehiclemodels.filter(
      (model) => model.vehiclesBrandId === selectedBrand.vehiclesBrandId
    )
    : [];

  const formik = useFormik({
    initialValues: {
      vehicleModelId: "",
      description: "",
      maintananceScheduleName: 0,
    },
    validationSchema: Yup.object({
      maintananceScheduleName: Yup.number().required(
        "Yêu cầu nhập số Odo"
      ).min(1000, "Ít nhất là 1000"),
      description: Yup.string().required("Yêu cầu mô tả"),
    }),

    onSubmit: async (values) => {
      try {
        const data = {
          maintananceScheduleName: values.maintananceScheduleName,
          description: values.description ? values.description : null,
          vehicleModelId: selectedModel.vehicleModelId,
        };
        await dispatch(
          CreateSchedulePost({
            token,
            data,
          })
        );
        setReload((p) => !p);
        handleClose();
      } catch (error) {
        console.error("Failed to add model vehicle", error);
      }
    },
  });
  console.log("Formik errors: ", formik.errors);

  useEffect(() => { }, [dispatch, open, setReload]);

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
      <DialogTitle>Thêm Gói Odo</DialogTitle>
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
              Chọn Hãng Xe
            </InputLabel>
            <Autocomplete
              id="vehiclesBrandId"
              key={filteredOptionsBrand.vehiclesBrandId}
              fullWidth
              options={filteredOptionsBrand}
              getOptionLabel={(option) =>
                `Hãng xe: ${option.vehiclesBrandName} (Mã: ${option.vehiclesBrandId})`
              }
              onChange={(event, newValue) => {
                setSelectedBrand(newValue);
                setSelectedModel(null);
                setModelSearchTerm(null);
                console.log("Hãng xe: ", newValue);
              }}
              renderOption={(props, option) => (
                <li {...props} key={option.vehiclesBrandId}>
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
                    <div>Hãng xe: {option.vehiclesBrandName}</div>
                    <div style={{ fontSize: "0.8em", color: "gray" }}>
                      Mã: {option.vehiclesBrandId}
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
                      console.log(e.target.value);
                    }}
                  />
                )}
              />
            </FormControl>
          )}
          <TextField
            autoFocus
            margin="dense"
            name="maintananceScheduleName"
            label="Số Gói Odo"
            type="number"
            fullWidth
            variant="standard"
            value={formik.values.maintananceScheduleName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.maintananceScheduleName &&
              Boolean(formik.errors.maintananceScheduleName)
            }
            helperText={
              formik.touched.maintananceScheduleName &&
              formik.errors.maintananceScheduleName
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            margin="dense"
            name="description"
            label="Mô Tả"
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
            <Button
              onClick={() => {
                formik.resetForm();
                handleClose();
              }}
            >
              Hủy
            </Button>
            <Button type="submit">Thêm</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const AddSparePartDialog = ({ open, handleClose, token, setReload }) => {
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const { brands, statusbrands, errorbrands } = useSelector(
    (state) => state.brands
  );
  const { vehiclemodels, statusvehiclemodels, errorvehiclemodels } =
    useSelector((state) => state.vehiclemodels);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [modelSearchTerm, setModelSearchTerm] = useState("");

  const filteredOptionsBrand = brands.filter((option) =>
    option.vehiclesBrandName
      .toLowerCase()
      .includes(brandSearchTerm.toLowerCase())
  );

  const filteredOptionsModel = selectedBrand
    ? vehiclemodels.filter(
      (model) => model.vehiclesBrandId === selectedBrand.vehiclesBrandId
    )
    : [];

  const formik = useFormik({
    initialValues: {
      vehicleModelId: "",
      sparePartName: "",
      sparePartDescription: "",
      sparePartType: "",
      originalPrice: 0,
      image: "",
    },
    validationSchema: Yup.object({
      sparePartName: Yup.string().required("Yêu cầu tên phụ tùng"),
      sparePartDescription: Yup.string().required(
        "Yêu câu mô tả"
      ),
      originalPrice: Yup.number()
        .required("Yêu cầu giá tiền")
        .min(10000, "Ít Nhất 10.000VND"),
      sparePartType: Yup.string().required("Yêu cầu loại"),
    }),

    onSubmit: async (values) => {
      try {
        let imageUrl = values.image;
        if (imageFile) {
          const storageRef = ref(storage, `images/${imageFile.name}`);
          await uploadBytes(storageRef, imageFile);
          imageUrl = await getDownloadURL(storageRef);
        }
        await dispatch(
          CreateSpartPartPost({
            token,
            data: { ...values, vehicleModelId: selectedModel.vehicleModelId, image: imageUrl },
          })
        );
        setReload((p) => !p);
        handleClose();
      } catch (error) {
        console.error("Failed to add model vehicle", error);
        alert(error);
      }
    },
  });
  // console.log("Formik errors: ", formik.errors);
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    formik.setFieldValue("image", e.target.files[0].name);
  };
  useEffect(() => { }, [dispatch, open, setReload]);

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
      <DialogTitle> Thêm Phụ Tùng Mới Của Xe Cho Hãng</DialogTitle>
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
              Chọn Hãng Xe
            </InputLabel>
            <Autocomplete
              id="vehiclesBrandId"
              key={filteredOptionsBrand.vehiclesBrandId}
              fullWidth
              options={filteredOptionsBrand}
              getOptionLabel={(option) =>
                `Hãng xe: ${option.vehiclesBrandName} (Mã: ${option.vehiclesBrandId})`
              }
              onChange={(event, newValue) => {
                setSelectedBrand(newValue);
                setSelectedModel(null);
                setModelSearchTerm(null);
                console.log("Hãng xe: ", newValue);
              }}
              renderOption={(props, option) => (
                <li {...props} key={option.vehiclesBrandId}>
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
                    <div>Hãng xe: {option.vehiclesBrandName}</div>
                    <div style={{ fontSize: "0.8em", color: "gray" }}>
                      Mã: {option.vehiclesBrandId}
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
                      console.log(e.target.value);
                    }}
                  />
                )}
              />
            </FormControl>
          )}
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
          <TextField
            autoFocus
            margin="dense"
            name="sparePartName"
            label="Tên Phụ Tùng"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.sparePartName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.sparePartName &&
              Boolean(formik.errors.sparePartName)
            }
            helperText={
              formik.touched.sparePartName && formik.errors.sparePartName
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            margin="dense"
            name="sparePartType"
            label="Loại Phụ Tùng"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.sparePartType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.sparePartType &&
              Boolean(formik.errors.sparePartType)
            }
            helperText={
              formik.touched.sparePartType && formik.errors.sparePartType
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            name="sparePartDescription"
            label="Mô Tả Phụ Tùng"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.sparePartDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.sparePartDescription &&
              Boolean(formik.errors.sparePartDescription)
            }
            helperText={
              formik.touched.sparePartDescription &&
              formik.errors.sparePartDescription
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            margin="dense"
            name="originalPrice"
            label="Giá"
            type="number"
            fullWidth
            variant="standard"
            value={formik.values.originalPrice}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.originalPrice &&
              Boolean(formik.errors.originalPrice)
            }
            helperText={
              formik.touched.originalPrice && formik.errors.originalPrice
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <DialogActions>
            <Button
              onClick={() => {
                formik.resetForm();
                handleClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const AddServiceDialog = ({ open, handleClose, token, setReload }) => {
  const dispatch = useDispatch();
  const { brands, statusbrands, errorbrands } = useSelector(
    (state) => state.brands
  );
  const [imageFile, setImageFile] = useState(null);
  const { plans, statusplans, errorplans } = useSelector(
    (state) => state.plans
  );
  const { vehiclemodels, statusvehiclemodels, errorvehiclemodels } =
    useSelector((state) => state.vehiclemodels);
  const { schedules, statusschedules, errorschedules } = useSelector(
    (state) => state.schedules
  );
  const [filterPlans, setFilterPlans] = useState("");

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [schedulePackage, setSchedulePackage] = useState(null);
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [scheduleSearchTerm, setScheduleSearchTerm] = useState("");

  const filteredOptionsBrand = brands.filter((option) =>
    option.vehiclesBrandName
      .toLowerCase()
      .includes(brandSearchTerm.toLowerCase())
  );

  const filteredOptionsModel = selectedBrand
    ? vehiclemodels.filter(
      (model) => model.vehiclesBrandId === selectedBrand.vehiclesBrandId
    )
    : [];
  const filteredPlans = plans.filter(
    (model) => model.reponseVehicleModels.vehicleModelId === selectedModel?.vehicleModelId

  );
  const filteredOptionsSchedule = filterPlans
    ? schedules.filter(
      (model) => model.maintenancePlanId === filterPlans.maintenancePlanId
    )
    : [];
  const formik = useFormik({
    initialValues: {
      serviceCareName: "",
      serviceCareDescription: "",
      serviceCareType: "",
      maintananceScheduleId: null,
      originalPrice: 0,
    },
    validationSchema: Yup.object({
      serviceCareName: Yup.string().required("Yêu cầu dịch vụ"),
      serviceCareDescription: Yup.string().required(
        "Yêu cầu mô tả dịch vụ"
      ),
      serviceCareType: Yup.string().required("Yêu cầu loại dịch vụ"),
      originalPrice: Yup.number()
        .required("Yêu cầu giá")
        .min(10000, "Thấp nhất là 10.000VND"),
      schedulePackage: Yup.object(),
      selectedModel: Yup.object(),
    }),

    onSubmit: async (values) => {
      try {
        let imageUrl = values.image;
        if (imageFile) {
          const storageRef = ref(storage, `images/${imageFile.name}`);
          await uploadBytes(storageRef, imageFile);
          imageUrl = await getDownloadURL(storageRef);
        }
        await dispatch(
          CreateServicePost({
            token,
            data: {
              ...values,
              maintananceScheduleId: schedulePackage.maintananceScheduleId,
              image: imageUrl,
            },
          })
        );
        setReload((p) => !p);
        handleClose();
        setSelectedBrand(null);
        setSelectedModel(null);
        setSchedulePackage(null);
        setBrandSearchTerm("");
        setModelSearchTerm("");
        setScheduleSearchTerm("");
        formik.resetForm();
      } catch (error) {
        console.error("Failed to add model vehicle", error);
        alert(error);
      }
    },
  });
  // console.log("Formik errors: ", formik.errors);
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    formik.setFieldValue("image", e.target.files[0].name);
  };
  useEffect(() => { }, [dispatch, open, setReload]);

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
      <DialogTitle> Thêm Dịch Vụ Mới Của Xe Cho Hãng</DialogTitle>
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
              Chọn Hãng Xe
            </InputLabel>
            <Autocomplete
              id="vehiclesBrandId"
              key={filteredOptionsBrand.vehiclesBrandId}
              fullWidth
              options={filteredOptionsBrand}
              getOptionLabel={(option) =>
                `Hãng xe: ${option.vehiclesBrandName} (Mã: ${option.vehiclesBrandId})`
              }
              onChange={(event, newValue) => {
                setSelectedBrand(newValue);
                setSelectedModel(null);
                setModelSearchTerm(null);
                setScheduleSearchTerm(null);
                setSchedulePackage(null);
                console.log("Hãng xe: ", newValue);
              }}
              renderOption={(props, option) => (
                <li {...props} key={option.vehiclesBrandId}>
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
                    <div>Hãng xe: {option.vehiclesBrandName}</div>
                    <div style={{ fontSize: "0.8em", color: "gray" }}>
                      Mã: {option.vehiclesBrandId}
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
                htmlFor="maintenancePlanId"
                style={{
                  backgroundColor: "white",
                  padding: "0 8px",
                }}
              >
                Chọn Gói Odo
              </InputLabel>
              <Autocomplete
                id="maintenancePlanId"
                fullWidth
                options={filteredPlans}
                key={filteredPlans?.maintenancePlanId}
                getOptionLabel={(option) =>
                  `Gói odo:  ${option?.maintenancePlanName} (Mã: ${option?.maintenancePlanId})`
                }
                onChange={(event, newValue) => {
                  setFilterPlans(newValue);
                  console.log("Gói: ", newValue);
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option?.maintenancePlanId}>
                    {/* <img
                      src={option?.logo}
                      alt={option?.maintenancePlanName}
                      style={{
                        width: 40,
                        height: 40,
                        marginRight: 10,
                        objectFit: "contain",
                      }}
                    /> */}
                    <div>
                      <div>Gói odo {option?.maintenancePlanName}</div>
                      <div style={{ fontSize: "0.8em", color: "gray" }}>
                        Mã: {option?.maintenancePlanId}
                      </div>
                    </div>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    onChange={(e) => {
                      // setModelSearchTerm(e.target.value);
                      console.log(e.target.value);
                    }}
                  />
                )}
              />
            </FormControl>
          )}


          {filterPlans && (
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel
                shrink
                htmlFor="maintananceScheduleId"
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
                key={filteredOptionsSchedule?.maintananceScheduleId}
                getOptionLabel={(option) =>
                  ` Odo:  ${option?.maintananceScheduleName} (Mã: ${option?.maintananceScheduleId})`
                }
                onChange={(event, newValue) => {
                  setSchedulePackage(newValue);
                  console.log("Odo: ", newValue);
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.maintananceScheduleId}>
                    {/* <img
                      src={option?.logo}
                      alt={option.maintananceScheduleName}
                      style={{
                        width: 40,
                        height: 40,
                        marginRight: 10,
                        objectFit: "contain",
                      }}
                    /> */}
                    <div>
                      <div>Odo {option.maintananceScheduleName}</div>
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
          <TextField
            autoFocus
            margin="dense"
            name="serviceCareName"
            label="Tên Dịch Vụ"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.serviceCareName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.serviceCareName &&
              Boolean(formik.errors.serviceCareName)
            }
            helperText={
              formik.touched.serviceCareName && formik.errors.serviceCareName
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            margin="dense"
            name="serviceCareType"
            label="Loại Dịch Vụ"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.serviceCareType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.serviceCareType &&
              Boolean(formik.errors.serviceCareType)
            }
            helperText={
              formik.touched.serviceCareType && formik.errors.serviceCareType
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            name="serviceCareDescription"
            label="Mô Tả Dịch Vụ"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.serviceCareDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.serviceCareDescription &&
              Boolean(formik.errors.serviceCareDescription)
            }
            helperText={
              formik.touched.serviceCareDescription &&
              formik.errors.serviceCareDescription
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            margin="dense"
            name="originalPrice"
            label="Giá"
            type="number"
            fullWidth
            variant="standard"
            value={formik.values.originalPrice}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.originalPrice &&
              Boolean(formik.errors.originalPrice)
            }
            helperText={
              formik.touched.originalPrice && formik.errors.originalPrice
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <DialogActions>
            <Button
              onClick={() => {
                formik.resetForm();
                handleClose();
              }}
            >
              Hủy
            </Button>
            <Button type="submit">Thêm</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export const UpdateSparePartDialog = ({
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
      sparePartName: item?.sparePartName || "",
      sparePartType: item?.sparePartType || "",
      sparePartDescription: item?.sparePartDescription || "",
      originalPrice: item?.originalPrice || 0,
      image: item?.image || "",
    },
    validationSchema: Yup.object({
      status: Yup.string().required("Status is required"),
      sparePartName: Yup.string().required("Yêu cầu tên phụ tùng"),
      sparePartType: Yup.string().required("Yêu cầu loại dịch vụ"),
      sparePartDescription: Yup.string().required(
        "Yêu cầu mô tả"
      ),
      originalPrice: Yup.number()
        .required("Yêu cầu giá tiền")
        .min(10000, "Thấp nhất là 10.000VND"),
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
          UpdateSpartPartPut({
            token: token,
            id: item.sparePartId,
            data: { ...values, image: imageUrl },
          })
        ).then(() => {
          dispatch(SparePartsAll(token));
          handleClose();
          resetForm();
          setReload((p) => !p);
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
        status: item?.status || "ACTIVE",
        sparePartName: item?.sparePartName || "",
        sparePartType: item?.sparePartType || "",
        sparePartDescription: item?.sparePartDescription || "",
        originalPrice: item?.originalPrice || 0,
        image: item?.image || "",
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
        Cập Nhật Phụ Tùng Trung Tâm
      </DialogTitle>

      {item && (
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
              name="sparePartName"
              value={formik.values.sparePartName}
              onChange={formik.handleChange}
              error={
                formik.touched.sparePartName &&
                Boolean(formik.errors.sparePartName)
              }
              helperText={
                formik.touched.sparePartName && formik.errors.sparePartName
              }
              fullWidth
              margin="normal"
            />

            <TextField
              label="Loại Phụ Tùng"
              name="sparePartType"
              value={formik.values.sparePartType}
              onChange={formik.handleChange}
              error={
                formik.touched.sparePartType &&
                Boolean(formik.errors.sparePartType)
              }
              helperText={
                formik.touched.sparePartType && formik.errors.sparePartType
              }
              fullWidth
              margin="normal"
            />

            <TextField
              label="Mô Tả Phụ Tùng"
              name="sparePartDescription"
              value={formik.values.sparePartDescription}
              onChange={formik.handleChange}
              error={
                formik.touched.sparePartDescription &&
                Boolean(formik.errors.sparePartDescription)
              }
              helperText={
                formik.touched.sparePartDescription &&
                formik.errors.sparePartDescription
              }
              fullWidth
              margin="normal"
            />

            <TextField
              label="Giá Tiền"
              name="originalPrice"
              type="number"
              value={formik.values.originalPrice}
              onChange={formik.handleChange}
              error={
                formik.touched.originalPrice &&
                Boolean(formik.errors.originalPrice)
              }
              helperText={
                formik.touched.originalPrice && formik.errors.originalPrice
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
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
                Hủy
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
};
export const UpdateServiceDialog = ({
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
      serviceCareName: item?.serviceCareName,
      serviceCareType: item?.serviceCareType || "",
      serviceCareDescription: item?.serviceCareDescription || "",
      originalPrice: item?.originalPrice,
      image: item?.image || "",

    },
    validationSchema: Yup.object({
      status: Yup.string().required("Status is required"),
      serviceCareName: Yup.string().required("Yêu cầu tên dịch vụ"),
      serviceCareType: Yup.string().required("Yêu cầu loại dịch vụ"),
      serviceCareDescription: Yup.string().required(
        "Yêu cầu mô tả dịch vụ"
      ),
      originalPrice: Yup.number()
        .required("Yêu cầu giá dịch vụ")
        .min(10000, "Thấp nhất là 10000"),
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
          UpdateServicePut({
            token: token,
            id: item.serviceCareId,
            data: { ...values, image: imageUrl },
          })
        ).then(() => {
          dispatch(ServicesListGetAll(token));
          handleClose();
          resetForm();
        });
        setReload((p) => !p);
        resetForm();
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
        status: item?.status,
        serviceCareName: item?.serviceCareName,
        serviceCareType: item?.serviceCareType,
        serviceCareDescription: item?.serviceCareDescription,
        originalPrice: item?.originalPrice,
        image: item?.image || "",

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
                label="Tên Dịch Vụ"
                name="serviceCareName"
                value={formik.values.serviceCareName}
                onChange={formik.handleChange}
                error={
                  formik.touched.serviceCareName &&
                  Boolean(formik.errors.serviceCareName)
                }
                helperText={
                  formik.touched.serviceCareName &&
                  formik.errors.serviceCareName
                }
                fullWidth
                margin="normal"
              />

              <TextField
                label="Loại Dịch Vụ"
                name="serviceCareType"
                value={formik.values.serviceCareType}
                onChange={formik.handleChange}
                error={
                  formik.touched.serviceCareType &&
                  Boolean(formik.errors.serviceCareType)
                }
                helperText={
                  formik.touched.serviceCareType &&
                  formik.errors.serviceCareType
                }
                fullWidth
                margin="normal"
              />

              <TextField
                label="Mô Tả Dịch Vụ"
                name="serviceCareDescription"
                value={formik.values.serviceCareDescription}
                onChange={formik.handleChange}
                error={
                  formik.touched.serviceCareDescription &&
                  Boolean(formik.errors.serviceCareDescription)
                }
                helperText={
                  formik.touched.serviceCareDescription &&
                  formik.errors.serviceCareDescription
                }
                fullWidth
                margin="normal"
              />

              <TextField
                label="Giá"
                name="originalPrice"
                type="number"
                value={formik.values.originalPrice}
                onChange={formik.handleChange}
                error={
                  formik.touched.capacity &&
                  Boolean(formik.errors.originalPrice)
                }
                helperText={
                  formik.touched.capacity && formik.errors.originalPrice
                }
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
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
                  Hủy
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};
export const RegisterDialog = ({ open, handleClose, token, setReload }) => {
  const [step, setStep] = useState(1);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    gender: "null",
    phone: "",
    maintenanceCenterName: "",
    maintenanceCenterDescription: "",
    address: "",
    district: "",
    city: "",
    country: "Vn",
    logo: "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg",
  };

  const validationSchemaStep1 = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const validationSchemaStep2 = Yup.object().shape({
    gender: Yup.string().required("Required"),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    maintenanceCenterName: Yup.string().required("Required"),
    maintenanceCenterDescription: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    district: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
  });

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    if (step === 1) {
      setStep(2);
      setSubmitting(false);
    } else {
      console.log("value: ", values);
      setLoading(true);

      dispatch(PostCenter(values))
        .then((result) => {
          if (PostCenter.fulfilled.match(result)) {
            handleClose();
          } else {
            setErrors(result.payload || {});
          }
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        })
        .finally(() => {
          setLoading(false);
          setSubmitting(false);
          setReload(p => !p)
        });
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await axios.get(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
        {
          headers: {
            'Content-Type': 'application/json',
            'Token': "eb08b899-649c-11ef-ab1c-267b3de2ff84",
          },
        }
      );
      setProvinces(response.data.data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await axios.get(
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
        {
          params: { province_id: provinceId },
          headers: {
            'Content-Type': 'application/json',
            'Token': "eb08b899-649c-11ef-ab1c-267b3de2ff84",
          },
        }
      );
      setDistricts(response.data.data);
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, [setReload, token]);
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
      <DialogTitle></DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={
            step === 1 ? validationSchemaStep1 : validationSchemaStep2
          }
          onSubmit={handleSubmit}
          validateOnMount={false}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({
            errors,
            touched,
            isSubmitting,
            validateForm,
            setTouched,
            submitForm,
            setFieldValue,
            values,

          }) => (
            <Form>
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    color: "#030304",
                    fontWeight: 500,
                    textAlign: "center",
                    letterSpacing: "0.1em",
                    mb: 4,
                  }}
                >
                  Tạo Trung Tâm
                </Typography>
                {step === 1 ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Email"
                        name="email"
                        error={touched.email && errors.email}
                        helperText={touched.email && errors.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Mật Khẩu"
                        name="password"
                        type="password"
                        error={touched.password && errors.password}
                        helperText={touched.password && errors.password}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Xác Nhận Mật Khẩu"
                        name="confirmPassword"
                        type="password"
                        error={touched.confirmPassword && errors.confirmPassword}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Số Điện Thoại"
                        name="phone"
                        error={touched.phone && errors.phone}
                        helperText={touched.phone && errors.phone}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Tên Trung Tâm"
                        name="maintenanceCenterName"
                        error={touched.maintenanceCenterName && errors.maintenanceCenterName}
                        helperText={
                          touched.maintenanceCenterName && errors.maintenanceCenterName
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Mô Tả Trung Tâm"
                        name="maintenanceCenterDescription"
                        error={
                          touched.maintenanceCenterDescription &&
                          errors.maintenanceCenterDescription
                        }
                        helperText={
                          touched.maintenanceCenterDescription &&
                          errors.maintenanceCenterDescription
                        }
                        multiline
                        rows={4}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth variant="outlined" margin="normal" error={touched.city && errors.city}>
                        <InputLabel>Thành Phố</InputLabel>
                        <Select
                          name="city"
                          value={values.city}
                          onChange={(e) => {
                            setFieldValue("city", e.target.value);
                            const selectedProvince = provinces.find(
                              (province) => province.ProvinceName === e.target.value
                            );
                            if (selectedProvince) {
                              fetchDistricts(selectedProvince.ProvinceID);
                            }
                          }}
                          label="City"
                          disabled={!provinces.length}
                        >
                          {provinces.map((province) => (
                            <MenuItem key={province.ProvinceID} value={province.ProvinceName}>
                              {province.ProvinceName}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.city && <FormHelperText>{errors.city}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <FormControl fullWidth variant="outlined" margin="normal" error={touched.district && errors.district}>
                        <InputLabel>Quận / Huyện</InputLabel>
                        <Select
                          name="Quận / Huyện"
                          value={values.district}
                          onChange={(e) => setFieldValue("district", e.target.value)}
                          label="District"
                          disabled={!values.city}
                        >
                          {districts.map((district) => (
                            <MenuItem key={district.DistrictID} value={district.DistrictName}>
                              {district.DistrictName}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.district && <FormHelperText>{errors.district}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Địa Chỉ"
                        name="address"
                        error={touched.address && errors.address}
                        helperText={touched.address && errors.address}
                      />
                    </Grid>
                  </Grid>
                )}
              </Box>
              <DialogActions>
                {step === 2 && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                )}
                {step === 1 && (
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={() => {
                      validateForm().then((errors) => {
                        if (Object.keys(errors).length === 0) {
                          setStep(2);
                        } else {
                          setTouched(errors);
                        }
                      });
                    }}
                  >
                    Next
                  </Button>
                )}
                {step === 2 && (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting || loading}
                    onClick={submitForm}
                  >
                    {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
                  </Button>
                )}
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export const RegisterCustomerCare = ({
  open,
  handleClose,
  token,
  setReload,
}) => {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    logo: "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg",
    birthday: Yup.date,
  };

  const validationSchemaStep1 = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const validationSchemaStep2 = Yup.object().shape({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    phone: Yup.string().required("Required"),
    birthday: Yup.date().required("Required").nullable(),
    address: Yup.string().required("Required"),
  });

  const handleSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
    if (step === 1) {
      setStep(2);
      setSubmitting(false);
    } else {
      dispatch(CreateCustomerCarePost({ token, data: values }))
        .then((result) => {
          if (CreateCustomerCarePost.fulfilled.match(result)) {
            handleClose();
            resetForm();
            setStep(1);
            setReload((r) => !r);
          } else {
            setErrors(result.payload || {});
          }
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        })
        .finally(() => {
          setSubmitting(false);
        });
      setReload((r) => !r);
    }
  };

  const renderStep1Fields = (errors, touched) => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Field
          as={TextField}
          fullWidth
          label="Email"
          name="email"
          error={touched.email && errors.email}
          helperText={touched.email && errors.email}
        />
      </Grid>
      <Grid item xs={12}>
        <Field
          as={TextField}
          fullWidth
          label="Mật Khẩu"
          name="password"
          type="password"
          error={touched.password && errors.password}
          helperText={touched.password && errors.password}
        />
      </Grid>
      <Grid item xs={12}>
        <Field
          as={TextField}
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          error={touched.confirmPassword && errors.confirmPassword}
          helperText={touched.confirmPassword && errors.confirmPassword}
        />
      </Grid>
    </Grid>
  );

  const renderStep2Fields = (errors, touched) => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Field
          as={TextField}
          fullWidth
          label="Họ"
          name="firstName"
          error={touched.firstName && errors.firstName}
          helperText={touched.firstName && errors.firstName}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Field
          as={TextField}
          fullWidth
          label="Tên"
          name="lastName"
          error={touched.lastName && errors.lastName}
          helperText={touched.lastName && errors.lastName}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <FormControl fullWidth error={touched.gender && Boolean(errors.gender)}>
          <InputLabel id="gender-label" shrink>
            Giới Tính
          </InputLabel>
          <Field
            as={Select}
            labelId="gender-label"
            name="gender"
            fullWidth
            displayEmpty
          >
            <MenuItem value="">
              <em>Chọn giới tính</em>
            </MenuItem>
            <MenuItem value="Nam">Nam</MenuItem>
            <MenuItem value="Nữ">Nữ</MenuItem>
          </Field>
          {touched.gender && errors.gender && (
            <span style={{ color: "red" }}>{errors.gender}</span>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Field
          as={TextField}
          fullWidth
          label="Số Điện"
          name="phone"
          error={touched.phone && errors.phone}
          helperText={touched.phone && errors.phone}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Field
          as={TextField}
          fullWidth
          label="Ngày Sinh"
          name="birthday"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          error={touched.birthday && errors.birthday}
          helperText={touched.birthday && errors.birthday}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <Field
          as={TextField}
          fullWidth
          label="Địa Chỉ"
          name="address"
          error={touched.address && errors.address}
          helperText={touched.address && errors.address}
        />
      </Grid>
    </Grid>
  );

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
      <DialogTitle></DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={
            step === 1 ? validationSchemaStep1 : validationSchemaStep2
          }
          onSubmit={handleSubmit}
          validateOnMount={false}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({
            errors,
            touched,
            isSubmitting,
            validateForm,
            setTouched,
            submitForm,
          }) => (
            <Form>
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    color: "#030304",
                    fontWeight: 500,
                    textAlign: "center",
                    letterSpacing: "0.1em",
                    mb: 4,
                  }}
                >
                  TẠO NHÂN VIÊN
                </Typography>
                {step === 1
                  ? renderStep1Fields(errors, touched)
                  : renderStep2Fields(errors, touched)}
              </Box>
              <DialogActions>
                {step === 2 && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                  >
                    TRẢ VỀ
                  </Button>
                )}
                {step === 1 && (
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={() => {
                      validateForm().then((errors) => {
                        if (Object.keys(errors).length === 0) {
                          setStep(2);
                        } else {
                          setTouched(errors);
                        }
                      });
                    }}
                  >
                    TIẾP TỤC
                  </Button>
                )}
                {step === 2 && (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={submitForm}
                  >
                    TẠO
                  </Button>
                )}
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export const RegisterTechCare = ({ open, handleClose, token, setReload }) => {
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    logo: "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg",
    birthday: Yup.date,
  };

  const validationSchemaStep1 = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const validationSchemaStep2 = Yup.object().shape({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    phone: Yup.string().required("Required"),
    birthday: Yup.date().required("Required").nullable(),
    address: Yup.string().required("Required"),
  });

  const handleSubmit = (values, { setSubmitting, setErrors, resetForm }) => {
    if (step === 1) {
      setStep(2);
      setSubmitting(false);
    } else {
      dispatch(CreateTechPost({ token, data: values }))
        .then((result) => {
          if (CreateTechPost.fulfilled.match(result)) {
            handleClose();
            resetForm();
            setStep(1);
            setReload((r) => !r);
          } else {
            setErrors(result.payload || {});
          }
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
        })
        .finally(() => {
          setSubmitting(false);
        });
      setReload((r) => !r);
    }
  };

  const renderStep1Fields = (errors, touched) => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Field
          as={TextField}
          fullWidth
          label="Email"
          name="email"
          error={touched.email && errors.email}
          helperText={touched.email && errors.email}
        />
      </Grid>
      <Grid item xs={12}>
        <Field
          as={TextField}
          fullWidth
          label="Mật Khẩu"
          name="password"
          type="password"
          error={touched.password && errors.password}
          helperText={touched.password && errors.password}
        />
      </Grid>
      <Grid item xs={12}>
        <Field
          as={TextField}
          fullWidth
          label="Xác Nhận Lại Mật Khẩu"
          name="confirmPassword"
          type="password"
          error={touched.confirmPassword && errors.confirmPassword}
          helperText={touched.confirmPassword && errors.confirmPassword}
        />
      </Grid>
    </Grid>
  );

  const renderStep2Fields = (errors, touched) => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Field
          as={TextField}
          fullWidth
          label="Họ"
          name="firstName"
          error={touched.firstName && errors.firstName}
          helperText={touched.firstName && errors.firstName}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Field
          as={TextField}
          fullWidth
          label="Tên"
          name="lastName"
          error={touched.lastName && errors.lastName}
          helperText={touched.lastName && errors.lastName}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <FormControl fullWidth error={touched.gender && Boolean(errors.gender)}>
          <InputLabel id="gender-label" shrink>
            Giới Tính
          </InputLabel>
          <Field
            as={Select}
            labelId="gender-label"
            name="gender"
            fullWidth
            displayEmpty
          >
            <MenuItem value="">
              <em>Chọn giới tính</em>
            </MenuItem>
            <MenuItem value="Nam">Nam</MenuItem>
            <MenuItem value="Nữ">Nữ</MenuItem>
          </Field>
          {touched.gender && errors.gender && (
            <span style={{ color: "red" }}>{errors.gender}</span>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Field
          as={TextField}
          fullWidth
          label="Số Điện Thoại"
          name="phone"
          error={touched.phone && errors.phone}
          helperText={touched.phone && errors.phone}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Field
          as={TextField}
          fullWidth
          label="Ngày Sinh"
          name="birthday"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          error={touched.birthday && errors.birthday}
          helperText={touched.birthday && errors.birthday}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <Field
          as={TextField}
          fullWidth
          label="Address"
          name="address"
          error={touched.address && errors.address}
          helperText={touched.address && errors.address}
        />
      </Grid>
    </Grid>
  );

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
      <DialogTitle></DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={
            step === 1 ? validationSchemaStep1 : validationSchemaStep2
          }
          onSubmit={handleSubmit}
          validateOnMount={false}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({
            errors,
            touched,
            isSubmitting,
            validateForm,
            setTouched,
            submitForm,
          }) => (
            <Form>
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    color: "#030304",
                    fontWeight: 500,
                    textAlign: "center",
                    letterSpacing: "0.1em",
                    mb: 4,
                  }}
                >
                  Tạo Nhân Viên
                </Typography>
                {step === 1
                  ? renderStep1Fields(errors, touched)
                  : renderStep2Fields(errors, touched)}
              </Box>
              <DialogActions>
                {step === 2 && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                  >
                    TRẢ VỀ
                  </Button>
                )}
                {step === 1 && (
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={() => {
                      validateForm().then((errors) => {
                        if (Object.keys(errors).length === 0) {
                          setStep(2);
                        } else {
                          setTouched(errors);
                        }
                      });
                    }}
                  >
                    TIẾP TỤC                  </Button>
                )}
                {step === 2 && (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={submitForm}
                  >
                    TẠO
                  </Button>
                )}
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export const AddMaintenanceServiceDialogOutSide = ({
  openView,
  handleCloseOutSide,
  centerId,
  token,
  setReload,
}) => {
  const dispatch = useDispatch();

  const { vehiclemodels, statusvehiclemodels, errorvehiclemodels } =
    useSelector((state) => state.vehiclemodels);
  const { vehiclemains, statusvehiclemains, errorvehiclemains } = useSelector(
    (state) => state.vehiclemains
  );
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const filteredOptionsBrand = vehiclemains.filter((option) =>
    option?.responseBrand?.vehiclesBrandName.toLowerCase().includes(brandSearchTerm.toLowerCase())
  );

  const filteredOptionsModel = selectedBrand
    ? vehiclemodels.filter(
      (model) => model.vehiclesBrandId === selectedBrand?.responseBrand?.vehiclesBrandId
    )
    : [];
  const formik = useFormik({
    initialValues: {
      vehicleModelId: null,
      maintenanceServiceName: null,
    },
    onSubmit: async (values, { resetForm }) => {
      const data = {
        maintenanceServiceName: values.maintenanceServiceName,
        vehicleModelId: selectedModel.vehicleModelId,
      };
      await dispatch(AddMaintenanceServiceByCenter({ token, data }))
        .then(() => {
          dispatch(MaintenanceServicesByCenterId({ centerId, token }));
          resetForm();
          setReload((p) => !p);
          handleCloseOutSide();
          setSelectedBrand(null);
          setSelectedModel(null);
          setBrandSearchTerm("");
          setModelSearchTerm("");
          formik.resetForm();
        })
        .catch((error) => {
          console.error("Failed to add item:", error);
        });
      setReload((p) => !p);
      setSelectedBrand(null);
      setSelectedModel(null);
      setBrandSearchTerm("");
      setModelSearchTerm("");
      resetForm();
    },
  });
  useEffect(() => {
    if (openView) {
      setSelectedBrand(null);
      setSelectedModel(null);
      setBrandSearchTerm("");
      setModelSearchTerm("");
    }
  }, [dispatch, token, centerId, openView, setReload]);
  return (
    <Dialog
      open={openView}
      onClose={handleCloseOutSide}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Thêm Dịch Vụ Cho Trung Tâm </DialogTitle>
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
                console.log("Hãng xe: ", newValue);
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
                  onChange={(e) => {
                    setBrandSearchTerm(e.target.value);
                    setSelectedModel(null);
                    setModelSearchTerm(null);
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
                      console.log(e.target.value);
                    }}
                  />
                )}
              />
            </FormControl>
          )}
          {selectedModel && (
            <TextField
              margin="dense"
              name="maintenanceServiceName"
              label="Tên Dịch Vụ"
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
          )}
          <DialogActions>
            <Button onClick={handleCloseOutSide}>Trả Về</Button>
            <Button type="submit">Thêm</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};



export const UseFormikCreateOdoHisotry = ({
  open,
  handleClose,
  token,
  informationMaintenanceId,
  vehicleId,
}) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      maintenanceInformationId: informationMaintenanceId,
      vehiclesId: vehicleId,
      description: "",
      odo: "",
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Yêu cầu thêm"),
      odo: Yup.number().required("Yêu cầu thêm").min(1, "Thấp nhất là 1")
    }),
    onSubmit: async (values, { resetForm }) => {
      const data = {
        maintenanceInformationId: informationMaintenanceId,
        description: values.description,
        vehiclesId: vehicleId,
        description: values.description,
        odo: values.odo
      };
      console.log("formdata create odohisotry", data);
      await dispatch(CreateOdoHisotryPost({ token: token, data: data }))
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
    console.log("vehicleId formik:", vehicleId);
  }, [dispatch, token, informationMaintenanceId, open, vehicleId]);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Lưu lịch sử odo xe</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              autoFocus
              margin="dense"
              name="informationMaintenanceId"
              label="Mã Thông Tin Bảo Trì"
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
            autoFocus
            margin="dense"
            name="vehiclesId"
            label="Mã Xe"
            type="text"
            fullWidth
            variant="standard"
            value={vehicleId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.vehicleId &&
              Boolean(formik.errors.vehicleId)
            }
            disabled={vehicleId}
            helperText={
              formik.touched.vehicleId &&
              formik.errors.vehicleId
            }
          />
          <TextField
            margin="dense"
            name="odo"
            label="Odo"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.odo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.odo && Boolean(formik.errors.odo)
            }
            helperText={formik.touched.odo && formik.errors.odo}
          />

          <TextField
            margin="dense"
            name="description"
            label="Mô Tả"
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
    </Dialog >
  );
};