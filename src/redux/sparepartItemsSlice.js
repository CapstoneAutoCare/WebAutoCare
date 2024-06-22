import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SparePartItemsApi from "../components/Axios/SparePartItemsApi";

const initialState = {
  sparepartitems: [],
  status: "idle",
  error: null,
};
export const SparePartItemsAll = createAsyncThunk(
  "sparepartitem/GetAll",
  async (token) => {
    try {
      const list = await SparePartItemsApi.getAll(token);
      return list;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);
export const SparePartItemsByCenterId = createAsyncThunk(
  "sparepartitem/GetListByCenter",
  async (centerId, token) => {
    try {
      const list = await SparePartItemsApi.getListByCenter(centerId, token);
      console.log(list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
const sparepartitemsSlice = createSlice({
  name: "sparepartitem",
  initialState,
  reducers: {
    GetAll: (state, action) => {
      state.sparepartitems = action.payload;
      state.error = null;
    },
    // GetListByCenter: (state, { action }) => {
    //   state.sparepartitems = action.payload;
    //   state.error = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SparePartItemsAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(SparePartItemsAll.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sparepartitems = action.payload;
      })
      .addCase(SparePartItemsAll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(SparePartItemsByCenterId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(SparePartItemsByCenterId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sparepartitems = action.payload;
        console.log("payload", state.sparepartitems);
      })
      .addCase(SparePartItemsByCenterId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const { GetAll } = sparepartitemsSlice.actions;

export default sparepartitemsSlice.reducer;
