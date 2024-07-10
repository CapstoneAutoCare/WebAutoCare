import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SparePartItemsApi from "../components/Axios/SparePartItemsApi";

const initialState = {
  sparepartitems: [],
  status: "idle",
  error: null,
  sparepartitem:null
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
export const AddSparePartItemsByCenter = createAsyncThunk(
  "sparepartitem/AddSparePartItemsByCenter",
  async ({ token, data }) => {
    try {
      const list = await SparePartItemsApi.addSpartPartItem(token, data);
      console.log(list);
      return list;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
export const UpdateSparePartItemByCenter = createAsyncThunk(
  "sparepartitem/UpdateSparePartItemByCenter",
  async ({ token, id, data }) => {
    try {
      const list = await SparePartItemsApi.updateSparePartItem(token, id, data);
      console.log(list);
      return list;
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
    GetListByCenter: (state, action) => {
      state.sparepartitems = action.payload;
      state.error = null;
    },
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
      })

      .addCase(AddSparePartItemsByCenter.pending, (state) => {
        state.status = "loading";
      })
      .addCase(AddSparePartItemsByCenter.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sparepartitems = action.payload;
        console.log("payload", state.sparepartitems);
      })
      .addCase(AddSparePartItemsByCenter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(UpdateSparePartItemByCenter.pending, (state) => {
        state.status = "loading";
      })
      .addCase(UpdateSparePartItemByCenter.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sparepartitem = action.payload;
        console.log("payload", state.sparepartitem);
      })
      .addCase(UpdateSparePartItemByCenter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const { GetAll, GetListByCenter } = sparepartitemsSlice.actions;

export default sparepartitemsSlice.reducer;
