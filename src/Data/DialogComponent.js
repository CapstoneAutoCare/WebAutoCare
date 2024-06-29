import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import {
  AddSparePartItemsByCenter,
  SparePartItemsByCenterId,
} from "../redux/sparepartItemsSlice";
import {
  AddMaintenanceServiceByCenter,
  MaintenanceServicesByCenterId,
} from "../redux/mainserviceSlice";

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
