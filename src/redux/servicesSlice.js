import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ServicesApi from "../components/Axios/ServicesApi";

const initialState = {
  services: [],
  statusservices: "idle",
  errorservices: null,
  service: null,
};

export const ServicesListGetAll = createAsyncThunk(
  "services/ServicesListGetAll",
  async (token, { rejectWithValue }) => {
    try {
      const list = await ServicesApi.getAll(token);
      console.log("services/ServicesListGetAll", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const GetServiceCaresNotInMaintenanceServices = createAsyncThunk(
  "services/GetServiceCaresNotInMaintenanceServices",
  async ({ token, centerId }, { rejectWithValue }) => {
    try {
      const list = await ServicesApi.GetServiceCaresNotInMaintenanceServices({
        token,
        centerId,
      });
      console.log(
        "services/GetServiceCaresNotInMaintenanceServices",
        list.data
      );
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const CreateServicePost = createAsyncThunk(
  "services/CreateServicePost",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const list = await ServicesApi.post({ token, data });
      console.log("services/CreateServicePost", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetServiceCaresNotInMaintenanceServices.pending, (state) => {
        state.statusservices = "loading";
        state.services = [];
        state.errorservices = null;
        state.service = null;
      })
      .addCase(
        GetServiceCaresNotInMaintenanceServices.fulfilled,
        (state, action) => {
          state.statusservices = "succeeded";
          state.services = action.payload;
        }
      )
      .addCase(
        GetServiceCaresNotInMaintenanceServices.rejected,
        (state, action) => {
          state.statusservices = "failed";
          state.errorservices = action.payload;
        }
      )
      .addCase(ServicesListGetAll.pending, (state) => {
        state.statusservices = "loading";
        state.services = [];
        state.errorservices = null;
        state.service = null;
      })
      .addCase(ServicesListGetAll.fulfilled, (state, action) => {
        state.statusservices = "succeeded";
        state.services = action.payload;
      })
      .addCase(ServicesListGetAll.rejected, (state, action) => {
        state.statusservices = "failed";
        state.errorservices = action.payload;
      })
      .addCase(CreateServicePost.pending, (state) => {
        state.statusservices = "loading";
        state.services = [];
        state.errorservices = null;
        state.service = null;
      })
      .addCase(CreateServicePost.fulfilled, (state, action) => {
        state.statusservices = "succeeded";
        state.service = action.payload;
      })
      .addCase(CreateServicePost.rejected, (state, action) => {
        state.statusservices = "failed";
        state.errorservices = action.payload;
      });
  },
});
export const {} = servicesSlice.actions;

export default servicesSlice.reducer;
