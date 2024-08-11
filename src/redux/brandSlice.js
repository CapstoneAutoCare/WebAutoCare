import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ScheduleApi from "../components/Axios/ScheduleApi";
import BrandVehiclesApi from "../components/Axios/BrandVehiclesApi";

const initialState = {
  brands: [],
  statusbrands: "idle",
  errorbrands: null,
  brand: null,
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
      });
  },
});
export const {} = brandSlice.actions;

export default brandSlice.reducer;
