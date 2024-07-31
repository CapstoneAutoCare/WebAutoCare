import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import MaintenanceServicesInforesApi from "../components/Axios/MaintenanceServicesInforesApi";

const initialState = {
  statusmaintenanceServiceInfoes: "idle",
  errormaintenanceServiceInfoes: null,
  maintenanceServiceInfoes: [],
  maintenanceServiceInfoe: null,
};

export const MaintenanceServiceInfoesAll = createAsyncThunk(
  "maintenanceServiceInfoes/MaintenanceServiceInfoesAll",
  async ({ token }, { rejectWithValue }) => {
    try {
      const list = await MaintenanceServicesInforesApi.getAll(token);
      console.log("maintenanceServiceInfoes/MaintenanceServiceInfoesAll", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const MaintenanceServiceInfoesPost = createAsyncThunk(
  "maintenanceServiceInfoes/MaintenanceServiceInfoesPost",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const list = await MaintenanceServicesInforesApi.Post({
        token: token,
        data: data,
      });
      console.log(
        "maintenanceServiceInfoes/MaintenanceServiceInfoesPost",
        list.data
      );
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const MaintenanceServiceInfoesChangeStatus = createAsyncThunk(
  "maintenanceServiceInfoes/MaintenanceServiceInfoesChangeStatus",
  async ({ token, id, status }, { rejectWithValue }) => {
    try {
      const list = await MaintenanceServicesInforesApi.changeStatus({
        token,
        id: id,
        status: status,
      });
      console.log(
        "maintenanceServiceInfoes/MaintenanceServiceInfoesChangeStatus",
        list.data
      );
      return list.data;
    } catch (error) {
      console.error("Status ERRROR",error.response.data.Exception);
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
const maintenanceServiceInfoesSlice = createSlice({
  name: "maintenanceServicetInfoes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(MaintenanceServiceInfoesAll.pending, (state) => {
        state.statusmaintenanceServiceInfoes = "loading";
        state.maintenanceServiceInfoe = null;
        state.maintenanceServiceInfoes = [];
        state.errormaintenanceServiceInfoes = null;
      })
      .addCase(MaintenanceServiceInfoesAll.fulfilled, (state, action) => {
        state.statusmaintenanceServiceInfoes = "succeeded";
        state.maintenanceServiceInfoes = action.payload;
      })
      .addCase(MaintenanceServiceInfoesAll.rejected, (state, action) => {
        state.statusmaintenanceServiceInfoes = "failed";
        state.maintenanceServiceInfoes = action.payload;
      })
      .addCase(MaintenanceServiceInfoesPost.pending, (state) => {
        state.statusmaintenanceServiceInfoes = "loading";
        state.maintenanceServiceInfoe = null;
        state.maintenanceServiceInfoes = [];
        state.errormaintenanceServiceInfoes = null;
      })
      .addCase(MaintenanceServiceInfoesPost.fulfilled, (state, action) => {
        state.statusmaintenanceServiceInfoes = "succeeded";
        state.maintenanceServiceInfoes = action.payload;
      })
      .addCase(MaintenanceServiceInfoesPost.rejected, (state, action) => {
        state.statusmaintenanceServiceInfoes = "failed";
        state.maintenanceServiceInfoes = action.payload;
        alert(action.payload);
      })
      .addCase(MaintenanceServiceInfoesChangeStatus.pending, (state) => {
        state.statusmaintenanceServiceInfoes = "loading";
        state.maintenanceServiceInfoe = null;
        state.maintenanceServiceInfoes = [];
        state.errormaintenanceServiceInfoes = null;
      })
      .addCase(MaintenanceServiceInfoesChangeStatus.fulfilled, (state, action) => {
        state.statusmaintenanceServiceInfoes = "succeeded";
        state.maintenanceServiceInfoes = action.payload;
      })
      .addCase(MaintenanceServiceInfoesChangeStatus.rejected, (state, action) => {
        state.statusmaintenanceServiceInfoes = "failed";
        state.maintenanceServiceInfoes = action.payload;
        alert(action.payload);
      });
  },
});
export const {} = maintenanceServiceInfoesSlice.actions;

export default maintenanceServiceInfoesSlice.reducer;
