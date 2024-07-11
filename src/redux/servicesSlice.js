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
  async (token) => {
    try {
      const list = await ServicesApi.getAll(token);
      console.log("services/GetAll", list.data);
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
const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ServicesAll.pending, (state) => {
        state.statusservices = "loading";
      })
      .addCase(ServicesAll.fulfilled, (state, action) => {
        state.statusservices = "succeeded";
        state.services = action.payload;
      })
      .addCase(ServicesAll.rejected, (state, action) => {
        state.statusservices = "failed";
        state.errorservices = action.error.message;
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
export const {} = servicesSlice.actions;

export default servicesSlice.reducer;
