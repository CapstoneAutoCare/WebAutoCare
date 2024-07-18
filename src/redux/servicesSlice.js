import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ServicesApi from "../components/Axios/ServicesApi";

const initialState = {
  services: [],
  statusservices: "idle",
  errorservices: null,
  service: null,
};

export const ServicesAll = createAsyncThunk(
  "services/GetAll",
  async ({ token }, { rejectWithValue }) => {
    try {
      const list = await ServicesApi.getAll({ token });
      console.log("services/GetAll", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
// export const SparePartItemsByCenterId = createAsyncThunk(
//   "sparepartitem/GetListByCenter",
//   async (centerId, token) => {
//     try {
//       const list = await SparePartItemsApi.getListByCenter(centerId, token);
//       console.log(list.data);
//       return list.data;
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   }
// );
// export const AddSparePartItemsByCenter = createAsyncThunk(
//   "sparepartitem/AddSparePartItemsByCenter",
//   async ({token, data}) => {
//     try {
//       const list = await SparePartItemsApi.addSpartPartItem(token, data);
//       console.log(list);
//       return list;
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   }
// );
const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ServicesAll.pending, (state) => {
        state.statusservices = "loading";
        state.services = [];
        state.errorservices = null;
        state.service = null;
      })
      .addCase(ServicesAll.fulfilled, (state, action) => {
        state.statusservices = "succeeded";
        state.services = action.payload;
      })
      .addCase(ServicesAll.rejected, (state, action) => {
        state.statusservices = "failed";
        state.errorservices = action.payload;
      });
  },
});
export const {} = servicesSlice.actions;

export default servicesSlice.reducer;
