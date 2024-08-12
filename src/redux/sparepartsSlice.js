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
  async (token, { rejectWithValue }) => {
    try {
      const list = await SparePartsApi.getAll(token);
      console.log("sparepart/GetAll", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const GetSpartPartNotSparePartItemId = createAsyncThunk(
  "sparepart/GetSpartPartNotSparePartItemId",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const list = await SparePartsApi.GetListNotSparePartItemId({ token, id });
      console.log("sparepart/GetAll", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const CreateSpartPartPost = createAsyncThunk(
  "sparepart/CreateSpartPartPost",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const list = await SparePartsApi.post({ token, data });
      console.log("sparepart/CreateSpartPartPost", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const UpdateSpartPartPut = createAsyncThunk(
  "sparepart/UpdateSpartPartPut",
  async ({ token, id, data }, { rejectWithValue }) => {
    try {
      const list = await SparePartsApi.updateSparePart({ token, id, data });
      console.log("sparepart/UpdateSpartPartPut", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
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
      })
      .addCase(CreateSpartPartPost.pending, (state) => {
        state.statussparepart = "loading";
        state.sparepart = null;
        state.spareparts = [];
        state.errorsparepart = null;
      })
      .addCase(CreateSpartPartPost.fulfilled, (state, action) => {
        state.statussparepart = "succeeded";
        state.sparepart = action.payload;
      })
      .addCase(CreateSpartPartPost.rejected, (state, action) => {
        state.statussparepart = "failed";
        state.error = action.payload;
      })
      .addCase(GetSpartPartNotSparePartItemId.pending, (state) => {
        state.statussparepart = "loading";
        state.sparepart = null;
        state.spareparts = [];
        state.errorsparepart = null;
      })
      .addCase(GetSpartPartNotSparePartItemId.fulfilled, (state, action) => {
        state.statussparepart = "succeeded";
        state.spareparts = action.payload;
      })
      .addCase(GetSpartPartNotSparePartItemId.rejected, (state, action) => {
        state.statussparepart = "failed";
        state.error = action.payload;
      })
      .addCase(UpdateSpartPartPut.pending, (state) => {
        state.statussparepart = "loading";
        state.sparepart = null;
        state.spareparts = [];
        state.errorsparepart = null;
      })
      .addCase(UpdateSpartPartPut.fulfilled, (state, action) => {
        state.statussparepart = "succeeded";
        state.sparepart = action.payload;
      })
      .addCase(UpdateSpartPartPut.rejected, (state, action) => {
        state.statussparepart = "failed";
        state.error = action.payload;
      });
  },
});
export const {} = sparepartsSlice.actions;

export default sparepartsSlice.reducer;
