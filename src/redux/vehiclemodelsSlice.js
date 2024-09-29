import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import VehicleModelApi from "../components/Axios/VehicleModelApi";

const initialState = {
  vehiclemodels: [],
  statusvehiclemodels: "idle",
  errorvehiclemodels: null,
  vehiclemodel: null,
};


export const VehicleModelsGetAllList = createAsyncThunk(
  "vehiclemodels/VehicleModelsGetAllList",
  async (token, { rejectWithValue }) => {
    try {
      const list = await VehicleModelApi.getAll(token);
      console.log("vehiclemodels/VehicleModelsGetAllList", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);

export const CreateVehiclesModelPost = createAsyncThunk(
  "vehiclemodels/CreateVehiclesModelPost",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const list = await VehicleModelApi.post({ token, data });
      console.log("vehiclemodels/CreateVehiclesModelPost", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);

export const UpdateVehiclesModelPut = createAsyncThunk(
  "vehiclemodels/UpdateVehiclesModelPut",
  async ({ token,id, data }, { rejectWithValue }) => {
    try {
      const list = await VehicleModelApi.update({ token, id,data });
      console.log("vehiclemodels/UpdateVehiclesModelPut", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
const brandSlice = createSlice({
  name: "vehiclemodels",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(VehicleModelsGetAllList.pending, (state) => {
        state.statusvehiclemodels = "loading";
        state.vehiclemodel = null;
        state.errorvehiclemodels = null;
        state.vehiclemodels = [];
      })
      .addCase(VehicleModelsGetAllList.fulfilled, (state, action) => {
        state.statusvehiclemodels = "succeeded";
        state.vehiclemodels = action.payload;
      })
      .addCase(VehicleModelsGetAllList.rejected, (state, action) => {
        state.statusvehiclemodels = "failed";
        state.errorvehiclemodels = action.payload;
      })
      .addCase(CreateVehiclesModelPost.pending, (state) => {
        state.statusvehiclemodels = "loading";
        state.vehiclemodel = null;
        state.errorvehiclemodels = null;
        state.vehiclemodels = [];
      })
      .addCase(CreateVehiclesModelPost.fulfilled, (state, action) => {
        state.statusvehiclemodels = "succeeded";
        state.vehiclemodel = action.payload;
      })
      .addCase(CreateVehiclesModelPost.rejected, (state, action) => {
        state.statusvehiclemodels = "failed";
        state.errorvehiclemodels = action.payload;
        alert(action.payload);
      })
      .addCase(UpdateVehiclesModelPut.pending, (state) => {
        state.statusvehiclemodels = "loading";
        state.vehiclemodel = null;
        state.errorvehiclemodels = null;
        state.vehiclemodels = [];
      })
      .addCase(UpdateVehiclesModelPut.fulfilled, (state, action) => {
        state.statusvehiclemodels = "succeeded";
        state.vehiclemodel = action.payload;
      })
      .addCase(UpdateVehiclesModelPut.rejected, (state, action) => {
        state.statusvehiclemodels = "failed";
        state.errorvehiclemodels = action.payload;
        alert(action.payload);
      })
      
      ;
  },
});
export const {} = brandSlice.actions;

export default brandSlice.reducer;
