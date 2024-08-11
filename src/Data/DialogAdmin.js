import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { BrandGetAllList, CreateBrandVehicles } from "../redux/brandSlice";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";
import { ref, set } from "firebase/database";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { CreateVehiclesModelPost } from "../redux/vehiclemodelsSlice";
import { CreateSchedulePost } from "../redux/scheduleSlice";
import { CreateSpartPartPost } from "../redux/sparepartsSlice";
import { CreateServicePost } from "../redux/servicesSlice";

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
        "Vehicle brand name is required"
      ),
      vehiclesBrandDescription: Yup.string().required(
        "Vehicle brand description is required"
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
            label="Vehicle Brand Name"
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
            label="Vehicle Brand Description"
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
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
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
      vehiclesBrandId: Yup.string().required("vehiclesBrandId is required"),
      vehicleModelName: Yup.string().required("vehicleModelName is required"),
      vehicleModelDecription: Yup.string().required(
        "vehicleModelDecription is required"
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
      <DialogTitle>Add Vehicle Model</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Autocomplete
            label="vehiclesBrandId"
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
                label="Name"
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
            label="vehicleModelName"
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
            label="vehicleModelDecription"
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
              Cancel
            </Button>
            <Button type="submit">Add</Button>
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
        "maintananceScheduleName is required"
      ),
      description: Yup.string().required("description is required"),
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

  useEffect(() => {}, [dispatch, open, setReload]);

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
              Select Brand
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
            label="Maintanance Schedule Name"
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
            label="description"
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
              Cancel
            </Button>
            <Button type="submit">Add</Button>
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
    },
    validationSchema: Yup.object({
      sparePartName: Yup.string().required("sparePartName is required"),
      sparePartDescription: Yup.string().required(
        "sparePartDescription is required"
      ),
      originalPrice: Yup.number()
        .required("originalPrice is required")
        .min(10000, "originalPrice must be at least 10,000 VND"),
      sparePartType: Yup.string().required("sparePartType is required"),
    }),

    onSubmit: async (values) => {
      try {
        // const data = {
        //   maintananceScheduleName: values.maintananceScheduleName,
        //   description: values.description ? values.description : null,
        //   vehicleModelId: selectedModel.vehicleModelId,
        // };
        await dispatch(
          CreateSpartPartPost({
            token,
            data: { ...values, vehicleModelId: selectedModel.vehicleModelId },
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
  console.log("Formik errors: ", formik.errors);

  useEffect(() => {}, [dispatch, open, setReload]);

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
              Select Brand
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
            name="sparePartName"
            label="sparePartName"
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
            label="sparePartType"
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
            label="sparePartDescription"
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
            label="originalPrice"
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
  const { vehiclemodels, statusvehiclemodels, errorvehiclemodels } =
    useSelector((state) => state.vehiclemodels);
  const { schedules, statusschedules, errorschedules } = useSelector(
    (state) => state.schedules
  );
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
  const filteredOptionsSchedule = selectedModel
    ? schedules.filter(
        (model) => model.vehicleModelId === selectedModel.vehicleModelId
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
      serviceCareName: Yup.string().required("serviceCareName is required"),
      serviceCareDescription: Yup.string().required(
        "serviceCareDescription is required"
      ),
      serviceCareType: Yup.string().required("serviceCareType is required"),
      originalPrice: Yup.number()
        .required("originalPrice is required")
        .min(10000, "originalPrice must be at least 10,000 VND"),
      schedulePackage: Yup.object(),
      selectedModel: Yup.object(),
    }),

    onSubmit: async (values) => {
      try {
        await dispatch(
          CreateServicePost({
            token,
            data: {
              ...values,
              maintananceScheduleId: schedulePackage.maintananceScheduleId,
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
  console.log("Formik errors: ", formik.errors);

  useEffect(() => {}, [dispatch, open, setReload]);

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
              Select Brand
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

          <TextField
            autoFocus
            margin="dense"
            name="serviceCareName"
            label="serviceCareName"
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
            label="serviceCareType"
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
            label="serviceCareDescription"
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
            label="originalPrice"
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
