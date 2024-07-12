import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import MaintenanceServicesApi from "../components/Axios/MaintenanceServicesApi";

const initialState = {
  maintenanceservices: [],
  statusmaintenanceservices: "idle",
  errormaintenanceservices: null,
};
export const MaintenanceServicesAll = createAsyncThunk(
  "maintenanceservice/GetAll",
  async (token) => {
    try {
      const list = await MaintenanceServicesApi.getAll(token);
      return list;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);
export const MaintenanceServicesByCenterId = createAsyncThunk(
  "maintenanceservice/GetListByCenter",
  async (centerId, token) => {
    try {
      const list = await MaintenanceServicesApi.getListByCenter(
        centerId,
        token
      );
      console.log(list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
export const AddMaintenanceServiceByCenter = createAsyncThunk(
  "maintenanceservice/AddMaintenanceServiceByCenter",
  async ({ token, data }) => {
    try {
      const list = await MaintenanceServicesApi.addMaintenanceServicesItem(
        token,
        data
      );
      console.log(list);
      return list;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
export const UpdateMaintenanceServiceByCenter = createAsyncThunk(
  "maintenanceservice/UpdateMaintenanceServiceByCenter",
  async ({ token, id, data }) => {
    try {
      const list = await MaintenanceServicesApi.updateMaintenanceServicesItem({
        token: token,
        id: id,
        data: data,
      });
      console.log(list);
      return list;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
const mainserviceSlice = createSlice({
  name: "maintenanceservice",
  initialState,
  reducers: {
    GetAll: (state, action) => {
      state.maintenanceservices = action.payload;
      state.error = null;
    },
    // GetListByCenter: (state, { action }) => {
    //   state.MaintenanceServices = action.payload;
    //   state.error = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(MaintenanceServicesAll.pending, (state) => {
        state.statusmaintenanceservices = "loading";
      })
      .addCase(MaintenanceServicesAll.fulfilled, (state, action) => {
        state.statusmaintenanceservices = "succeeded";
        state.maintenanceservices = action.payload;
      })
      .addCase(MaintenanceServicesAll.rejected, (state, action) => {
        state.statusmaintenanceservices = "failed";
        state.errormaintenanceservices = action.error.message;
      })
      .addCase(MaintenanceServicesByCenterId.pending, (state) => {
        state.statusmaintenanceservices = "loading";
      })
      .addCase(MaintenanceServicesByCenterId.fulfilled, (state, action) => {
        state.statusmaintenanceservices = "succeeded";
        state.maintenanceservices = action.payload;
        console.log("payload", state.maintenanceservices);
      })
      .addCase(MaintenanceServicesByCenterId.rejected, (state, action) => {
        state.statusmaintenanceservices = "failed";
        state.errormaintenanceservices = action.error.message;
      })
      .addCase(UpdateMaintenanceServiceByCenter.pending, (state) => {
        state.statusmaintenanceservices = "loading";
      })
      .addCase(UpdateMaintenanceServiceByCenter.fulfilled, (state, action) => {
        state.statusmaintenanceservices = "succeeded";
        state.maintenanceservices = action.payload;
        console.log("payload", state.maintenanceservices);
      })
      .addCase(UpdateMaintenanceServiceByCenter.rejected, (state, action) => {
        state.statusmaintenanceservices = "failed";
        state.errormaintenanceservices = action.error.message;
      });
  },
});
export const { GetAll } = mainserviceSlice.actions;

export default mainserviceSlice.reducer;
