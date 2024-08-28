import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ScheduleApi from "../components/Axios/ScheduleApi";
import BrandVehiclesApi from "../components/Axios/BrandVehiclesApi";

const initialState = {
  brands: [],
  statusbrands: "idle",
  errorbrands: null,
  brand: null,
  package: null,
  packages: [],
  statuspackages: "idle",
  errorpackages: null,
};

// export const ServicesAll = createAsyncThunk(
//   "services/GetAll",
//   async ({ token }, { rejectWithValue }) => {
//     try {
//       const list = await ServicesApi.getAll({ token });
//       console.log("services/GetAll", list.data);
//       return list.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data.Exception);
//     }
//   }
// );
export const PackageGetAllList = createAsyncThunk(
  "brands/PackageGetAllList",
  async (token, { rejectWithValue }) => {
    try {
      const list = await BrandVehiclesApi.packagegetAll(token);
      console.log("brands/PackageGetAllList", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const CreatePackage = createAsyncThunk(
  "brands/CreatePackage",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const list = await BrandVehiclesApi.packagePost({ token, data });
      console.log("brands/CreatePackage", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);


export const BrandGetAllList = createAsyncThunk(
  "brands/BrandGetAllList",
  async (token, { rejectWithValue }) => {
    try {
      const list = await BrandVehiclesApi.getAll(token);
      console.log("brands/BrandGetAllList", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const BrandVehiclesMaintenancesDifByCenter = createAsyncThunk(
  "brands/vehiclesMaintenancesDifByCenter",
  async (id, { rejectWithValue }) => {
    try {
      const list = await BrandVehiclesApi.vehiclesMaintenancesDifByCenter(id);
      console.log("brands/vehiclesMaintenancesDifByCenter", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const CreateBrandVehicles = createAsyncThunk(
  "brands/CreateBrandVehicles",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const list = await BrandVehiclesApi.post({ token, data });
      console.log("brands/CreateBrandVehicles", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(BrandGetAllList.pending, (state) => {
        state.statusbrands = "loading";
        state.brand = null;
        state.errorbrands = null;
        state.brands = [];
      })
      .addCase(BrandGetAllList.fulfilled, (state, action) => {
        state.statusbrands = "succeeded";
        state.brands = action.payload;
      })
      .addCase(BrandGetAllList.rejected, (state, action) => {
        state.statusbrands = "failed";
        state.errorbrands = action.payload;
      })
      .addCase(CreateBrandVehicles.pending, (state) => {
        state.statusbrands = "loading";
        state.brand = null;
        state.errorbrands = null;
        state.brands = [];
      })
      .addCase(CreateBrandVehicles.fulfilled, (state, action) => {
        state.statusbrands = "succeeded";
        state.brand = action.payload;
      })
      .addCase(CreateBrandVehicles.rejected, (state, action) => {
        state.statusbrands = "failed";
        state.errorbrands = action.payload;
        alert(action.payload);
      })
      .addCase(BrandVehiclesMaintenancesDifByCenter.pending, (state) => {
        state.statusbrands = "loading";
        state.brand = null;
        state.errorbrands = null;
        state.brands = [];
      })
      .addCase(BrandVehiclesMaintenancesDifByCenter.fulfilled, (state, action) => {
        state.statusbrands = "succeeded";
        state.brands = action.payload;
      })
      .addCase(BrandVehiclesMaintenancesDifByCenter.rejected, (state, action) => {
        state.statusbrands = "failed";
        state.errorbrands = action.payload;
        alert(action.payload);
      })



      .addCase(PackageGetAllList.pending, (state) => {
        state.statuspackages = "loading";
        state.package = null;
        state.errorpackages = null;
        state.packages = [];
      })
      .addCase(PackageGetAllList.fulfilled, (state, action) => {
        state.statuspackages = "succeeded";
        state.packages = action.payload;
      })
      .addCase(PackageGetAllList.rejected, (state, action) => {
        state.statuspackages = "failed";
        state.errorpackages = action.payload;
        alert(action.payload);
      })



      .addCase(CreatePackage.pending, (state) => {
        state.statuspackages = "loading";
        state.package = null;
        state.errorpackages = null;
        state.packages = [];
      })
      .addCase(CreatePackage.fulfilled, (state, action) => {
        state.statuspackages = "succeeded";
        state.package = action.payload;
      })
      .addCase(CreatePackage.rejected, (state, action) => {
        state.statuspackages = "failed";
        state.errorpackages = action.payload;
        alert(action.payload);
      })




      ;
  },
});
export const {} = brandSlice.actions;

export default brandSlice.reducer;
