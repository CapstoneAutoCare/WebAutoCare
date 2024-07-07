import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TechinicanApi from "../components/Axios/TechnicianApi";

const initialState = {
  technicians: [],
  status: "idle",
  error: null,
};
export const TechinicanAll = createAsyncThunk(
  "technician/GetAll",
  async (token) => {
    try {
      const list = await TechinicanApi.getAll(token);
      return list;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);
export const TechinicanByCenterId = createAsyncThunk(
  "technician/GetListByCenter",
  async (centerId, token) => {
    try {
      const list = await TechinicanApi.getListByCenter(centerId, token);
      console.log(list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
const techinicansSlice = createSlice({
  name: "technician",
  initialState,
  reducers: {
    GetAll: (state, action) => {
      state.technicians = action.payload;
      state.error = null;
    },
    // GetListByCenter: (state, { action }) => {
    //   state.technicians = action.payload;
    //   state.error = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(TechinicanAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(TechinicanAll.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.technicians = action.payload;
      })
      .addCase(TechinicanAll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(TechinicanByCenterId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(TechinicanByCenterId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.technicians = action.payload;
        console.log("payload", state.technicians);
      })
      .addCase(TechinicanByCenterId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const { GetAll } = techinicansSlice.actions;

export default techinicansSlice.reducer;
