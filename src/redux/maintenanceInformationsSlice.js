import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import MaintenanceInformationsApi from "../components/Axios/MaintenanceInformationsApi";

const initialState = {
  maintenanceInformations: [],
  statusmi: "idle",
  errormi: null,
  main: null,
};

export const MaintenanceInformationsAll = createAsyncThunk(
  "maintenanceInformation/GetAll",
  async (token) => {
    try {
      const list = await MaintenanceInformationsApi.getAll(token);
      return list;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);
export const MaintenanceInformationsByCenterId = createAsyncThunk(
  "maintenanceInformation/GetListByCenter",
  async (centerId, token) => {
    try {
      const list = await MaintenanceInformationsApi.getListByCenter(
        centerId,
        token
      );
      console.log(list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
export const MaintenanceInformationById = createAsyncThunk(
  "maintenanceInformation/GetById",
  async ({ miId, token }) => {
    try {
      const list = await MaintenanceInformationsApi.getById(token, miId);
      console.log("Get by iD", list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
export const AddmaintenanceInformationsByCenter = createAsyncThunk(
  "maintenanceInformation/AddmaintenanceInformationsByCenter",
  async ({ token, data }) => {
    try {
      const list = await MaintenanceInformationsApi.addSpartPartItem(
        token,
        data
      );
      console.log(list);
      return list;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
const maintenanceInformationsSlice = createSlice({
  name: "maintenanceInformation",
  initialState,
  reducers: {
    // GetAll: (state, action) => {
    //   state.maintenanceInformations = action.payload;
    //   state.error = null;
    // },
    // GetListByCenter: (state, action) => {
    //   state.maintenanceInformations = action.payload;
    //   state.error = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(MaintenanceInformationsAll.pending, (state) => {
        state.statusmi = "loading";
      })
      .addCase(MaintenanceInformationsAll.fulfilled, (state, action) => {
        state.statusmi = "succeeded";
        state.maintenanceInformations = action.payload;
      })
      .addCase(MaintenanceInformationsAll.rejected, (state, action) => {
        state.statusmi = "failed";
        state.errormi = action.error.message;
      })
      .addCase(MaintenanceInformationsByCenterId.pending, (state) => {
        state.statusmi = "loading";
      })
      .addCase(MaintenanceInformationsByCenterId.fulfilled, (state, action) => {
        state.statusmi = "succeeded";
        state.maintenanceInformations = action.payload;
        console.log("payload", state.maintenanceInformations);
      })
      .addCase(MaintenanceInformationById.fulfilled, (state, action) => {
        state.statusmi = "succeeded";
        state.main = action.payload;
        console.log("Get By Id", state.main);
      })
      .addCase(MaintenanceInformationsByCenterId.rejected, (state, action) => {
        state.statusmi = "failed";
        state.errormi = action.error.message;
      })
      .addCase(AddmaintenanceInformationsByCenter.pending, (state) => {
        state.statusmi = "loading";
      })
      .addCase(
        AddmaintenanceInformationsByCenter.fulfilled,
        (state, action) => {
          state.statusmi = "succeeded";
          state.maintenanceInformations = action.payload;
          console.log("payload", state.maintenanceInformations);
        }
      )
      .addCase(AddmaintenanceInformationsByCenter.rejected, (state, action) => {
        state.statusmi = "failed";
        state.errormi = action.error.message;
      });
  },
});
export const {} = maintenanceInformationsSlice.actions;

export default maintenanceInformationsSlice.reducer;
