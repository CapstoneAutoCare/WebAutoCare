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
      return list.data;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);
export const MaintenanceInformationsByCenterId = createAsyncThunk(
  "maintenanceInformation/GetListByCenter",
  async ({ centerId, token }, { rejectWithValue }) => {
    try {
      const list = await MaintenanceInformationsApi.getListByCenter({
        token,
        centerId,
      });
      console.log(list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const MaintenanceInformationById = createAsyncThunk(
  "maintenanceInformation/GetById",
  async ({ miId, token }, { rejectWithValue }) => {
    try {
      const list = await MaintenanceInformationsApi.getById(token, miId);
      console.log("Get by iD", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const AddmaintenanceInformationsByCenter = createAsyncThunk(
  "maintenanceInformation/AddmaintenanceInformationsByCenter",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const list = await MaintenanceInformationsApi.addSpartPartItem({
        token,
        data,
      });
      console.log(list);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const ChangeStatusMi = createAsyncThunk(
  "maintenanceInformation/ChangeStatusMi",
  async ({ token, id, status }, { rejectWithValue }) => {
    try {
      const list = await MaintenanceInformationsApi.changeStatus({
        token,
        id,
        status,
      });
      console.log(list);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const GetListByCenterAndStatus = createAsyncThunk(
  "maintenanceInformation/GetListByCenterAndStatus",
  async ({ token }, { rejectWithValue }) => {
    try {
      const list = await MaintenanceInformationsApi.getListByCenterAndStatus({
        token,
        status: "CHECKIN",
      });
      console.log("maintenanceInformation/GetListByCenterAndStatus", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const GetListByCenterAndStatusCheckinAndTaskInactive = createAsyncThunk(
  "maintenanceInformation/GetListByCenterAndStatusCheckinAndTaskInactive",
  async (token, { rejectWithValue }) => {
    try {
      const list =
        await MaintenanceInformationsApi.GetListByCenterAndStatusCheckinAndTaskInactive(
          token
        );
      console.log(
        "maintenanceInformation/GetListByCenterAndStatusCheckinAndTaskInactive",
        list.data
      );
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
const maintenanceInformationsSlice = createSlice({
  name: "maintenanceInformation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(MaintenanceInformationsAll.pending, (state) => {
        state.statusmi = "loading";
        state.maintenanceInformations = [];
        state.main = null;
        state.errormi = null;
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
        state.maintenanceInformations = [];
        state.main = null;
        state.errormi = null;
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
        state.errormi = action.payload;
      })
      .addCase(AddmaintenanceInformationsByCenter.pending, (state) => {
        state.statusmi = "loading";
        state.maintenanceInformations = [];
        state.main = null;
        state.errormi = null;
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
        state.errormi = action.payload;
      })
      .addCase(ChangeStatusMi.pending, (state) => {
        state.statusmi = "loading";
        state.maintenanceInformations = [];
        state.main = null;
        state.errormi = null;
      })
      .addCase(ChangeStatusMi.fulfilled, (state, action) => {
        state.statusmi = "succeeded";
        state.main = action.payload;
        console.log("payload", state.main);
      })
      .addCase(ChangeStatusMi.rejected, (state, action) => {
        state.statusmi = "failed";
        state.errormi = action.payload;
      })
      .addCase(GetListByCenterAndStatus.pending, (state) => {
        state.statusmi = "loading";
        state.maintenanceInformations = [];
        state.main = null;
        state.errormi = null;
      })
      .addCase(GetListByCenterAndStatus.fulfilled, (state, action) => {
        state.statusmi = "succeeded";
        state.maintenanceInformations = action.payload;
        console.log("payload", state.maintenanceInformations);
      })
      .addCase(GetListByCenterAndStatus.rejected, (state, action) => {
        state.statusmi = "failed";
        state.errormi = action.payload;
      })
      .addCase(
        GetListByCenterAndStatusCheckinAndTaskInactive.pending,
        (state) => {
          state.statusmi = "loading";
          state.maintenanceInformations = [];
          state.main = null;
          state.errormi = null;
        }
      )
      .addCase(
        GetListByCenterAndStatusCheckinAndTaskInactive.fulfilled,
        (state, action) => {
          state.statusmi = "succeeded";
          state.maintenanceInformations = action.payload;
          console.log("payload", state.maintenanceInformations);
        }
      )
      .addCase(
        GetListByCenterAndStatusCheckinAndTaskInactive.rejected,
        (state, action) => {
          state.statusmi = "failed";
          state.errormi = action.payload;
        }
      );
  },
});
export const {} = maintenanceInformationsSlice.actions;

export default maintenanceInformationsSlice.reducer;
