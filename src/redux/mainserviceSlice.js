import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import MaintenanceServicesApi from "../components/Axios/MaintenanceServicesApi";

const initialState = {
  maintenanceservices: [],
  status: "idle",
  error: null,
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
        state.status = "loading";
      })
      .addCase(MaintenanceServicesAll.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.maintenanceservices = action.payload;
      })
      .addCase(MaintenanceServicesAll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(MaintenanceServicesByCenterId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(MaintenanceServicesByCenterId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.maintenanceservices = action.payload;
        console.log("payload", state.maintenanceservices);
      })
      .addCase(MaintenanceServicesByCenterId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const { GetAll } = mainserviceSlice.actions;

export default mainserviceSlice.reducer;
