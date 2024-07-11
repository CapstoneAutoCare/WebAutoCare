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
  async (token) => {
    try {
      const list = await SparePartsApi.getAll(token);
      console.log("sparepart/GetAll", list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.Messages);
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
        state.status = "loading";
      })
      .addCase(SparePartsAll.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.spareparts = action.payload;
      })
      .addCase(SparePartsAll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    //   .addCase(SparePartItemsByCenterId.pending, (state) => {
    //     state.status = "loading";
    //   })
    //   .addCase(SparePartItemsByCenterId.fulfilled, (state, action) => {
    //     state.status = "succeeded";
    //     state.sparepartitems = action.payload;
    //     console.log("payload", state.sparepartitems);
    //   })
    //   .addCase(SparePartItemsByCenterId.rejected, (state, action) => {
    //     state.status = "failed";
    //     state.error = action.error.message;
    //   })

    //   .addCase(AddSparePartItemsByCenter.pending, (state) => {
    //     state.status = "loading";
    //   })
    //   .addCase(AddSparePartItemsByCenter.fulfilled, (state, action) => {
    //     state.status = "succeeded";
    //     state.sparepartitems = action.payload;
    //     console.log("payload", state.sparepartitems);
    //   })
    //   .addCase(AddSparePartItemsByCenter.rejected, (state, action) => {
    //     state.status = "failed";
    //     state.error = action.error.message;
    //   })
  },
});
export const {} = sparepartsSlice.actions;

export default sparepartsSlice.reducer;
