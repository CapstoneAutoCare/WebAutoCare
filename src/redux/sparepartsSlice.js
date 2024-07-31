import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SparePartsApi from "../components/Axios/SparePartsApi";

const initialState = {
  spareparts: [],
  statussparepart: "idle",
  errorsparepart: null,
  sparepart: null,
};

export const SparePartsAll = createAsyncThunk(
  "sparepart/GetAll",
  async ({ token }, { rejectWithValue }) => {
    try {
      const list = await SparePartsApi.getAll({ token });
      console.log("sparepart/GetAll", list.data);
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
const sparepartsSlice = createSlice({
  name: "sparepart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(SparePartsAll.pending, (state) => {
        state.statussparepart = "loading";
        state.sparepart = null;
        state.spareparts = [];
        state.errorsparepart = null;
      })
      .addCase(SparePartsAll.fulfilled, (state, action) => {
        state.statussparepart = "succeeded";
        state.spareparts = action.payload;
      })
      .addCase(SparePartsAll.rejected, (state, action) => {
        state.statussparepart = "failed";
        state.error = action.payload;
      });
  },
});
export const {} = sparepartsSlice.actions;

export default sparepartsSlice.reducer;
