import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TechinicanApi from "../components/Axios/TechnicianApi";

const initialState = {
  technicians: [],
  statustech: "idle",
  errortech: null,
};
export const TechinicanAll = createAsyncThunk(
  "technician/GetAll",
  async (token) => {
    try {
      const list = await TechinicanApi.getAll(token);
      return list.data;
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
      console.log("technician/GetListByCenter", list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
export const CreateTechPost = createAsyncThunk(
  "centers/CreateTechPost",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const list = await TechinicanApi.CreateTech({ token, data });
      console.log("centers/CreateTechPost", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
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
        state.statustech = "loading";
        state.technicians = [];
        state.technician = null;
        state.errortech = null;
      })
      .addCase(TechinicanAll.fulfilled, (state, action) => {
        state.statustech = "succeeded";
        state.technicians = action.payload;
      })
      .addCase(TechinicanAll.rejected, (state, action) => {
        state.statustech = "failed";
        state.errortech = action.error.message;
      })
      .addCase(TechinicanByCenterId.pending, (state) => {
        state.statustech = "loading";
        state.technicians = [];
        state.technician = null;
        state.errortech = null;
      })
      .addCase(TechinicanByCenterId.fulfilled, (state, action) => {
        state.statustech = "succeeded";
        state.technicians = action.payload;
        console.log("payload", state.technicians);
      })
      .addCase(TechinicanByCenterId.rejected, (state, action) => {
        state.statustech = "failed";
        state.error = action.error.message;
      })
      .addCase(CreateTechPost.pending, (state) => {
        state.statustech = "loading";
        state.technicians = [];
        state.technician = null;
        state.errortech = null;
      })
      .addCase(CreateTechPost.fulfilled, (state, action) => {
        state.statustech = "succeeded";
        state.technician = action.payload;
        console.log("payload", state.technician);
      })
      .addCase(CreateTechPost.rejected, (state, action) => {
        state.statustech = "failed";
        state.errortech = action.payload;
        alert(state.errortech);
      });
  },
});
export const { GetAll } = techinicansSlice.actions;

export default techinicansSlice.reducer;
