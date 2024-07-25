import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import MaintenanceSparePartInfoesApi from "../components/Axios/MaintenanceSparePartInfoesApi";

const initialState = {
  statusmaintenanceSparePartInfos: "idle",
  errormaintenanceSparePartInfos: null,
  maintenanceSparePartInfos: [],
  maintenanceSparePartInfo: null,
};

export const MaintenanceSparePartInfoesAll = createAsyncThunk(
  "maintenanceSparePartInfoes/All",
  async ({ token }, { rejectWithValue }) => {
    try {
      const list = await MaintenanceSparePartInfoesApi.getAll(token);
      console.log("sparepart/GetAll", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const MaintenanceSparePartInfoesPost = createAsyncThunk(
  "maintenanceSparePartInfoes/MaintenanceSparePartInfoesPost",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const list = await MaintenanceSparePartInfoesApi.Post({
        token: token,
        data: data,
      });
      console.log(
        "nanceSparePartInfoes/MaintenanceSparePartInfoesPost",
        list.data
      );
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const MaintenanceSparePartInfoesChangeStatus = createAsyncThunk(
  "maintenanceSparePartInfoes/MaintenanceSparePartInfoesChangeStatus",
  async ({ token, id, status }, { rejectWithValue }) => {
    try {
      const list = await MaintenanceSparePartInfoesApi.changeStatus({
        token,
        id: id,
        status: status,
      });
      console.log(
        "maintenanceSparePartInfoes/MaintenanceSparePartInfoesChangeStatus",
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
const maintenanceSparePartInfoesSlice = createSlice({
  name: "maintenanceSparePartInfoes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(MaintenanceSparePartInfoesAll.pending, (state) => {
        state.statusmaintenanceSparePartInfos = "loading";
        state.maintenanceSparePartInfo = null;
        state.maintenanceSparePartInfos = [];
        state.errormaintenanceSparePartInfos = null;
      })
      .addCase(MaintenanceSparePartInfoesAll.fulfilled, (state, action) => {
        state.statusmaintenanceSparePartInfos = "succeeded";
        state.maintenanceSparePartInfos = action.payload;
      })
      .addCase(MaintenanceSparePartInfoesAll.rejected, (state, action) => {
        state.statusmaintenanceSparePartInfos = "failed";
        state.errormaintenanceSparePartInfos = action.payload;
      })
      .addCase(MaintenanceSparePartInfoesPost.pending, (state) => {
        state.statusmaintenanceSparePartInfos = "loading";
        state.maintenanceSparePartInfo = null;
        state.maintenanceSparePartInfos = [];
        state.errormaintenanceSparePartInfos = null;
      })
      .addCase(MaintenanceSparePartInfoesPost.fulfilled, (state, action) => {
        state.statusmaintenanceSparePartInfos = "succeeded";
        state.maintenanceSparePartInfos = action.payload;
      })
      .addCase(MaintenanceSparePartInfoesPost.rejected, (state, action) => {
        state.statusmaintenanceSparePartInfos = "failed";
        state.errormaintenanceSparePartInfos = action.payload;
      })
      .addCase(MaintenanceSparePartInfoesChangeStatus.pending, (state) => {
        state.statusmaintenanceSparePartInfos = "loading";
        state.maintenanceSparePartInfo = null;
        state.maintenanceSparePartInfos = [];
        state.errormaintenanceSparePartInfos = null;
      })
      .addCase(MaintenanceSparePartInfoesChangeStatus.fulfilled, (state, action) => {
        state.statusmaintenanceSparePartInfos = "succeeded";
        state.maintenanceSparePartInfos = action.payload;
      })
      .addCase(MaintenanceSparePartInfoesChangeStatus.rejected, (state, action) => {
        state.statusmaintenanceSparePartInfos = "failed";
        state.errormaintenanceSparePartInfos = action.payload;
        alert(action.payload);
      });
  },
});
export const {} = maintenanceSparePartInfoesSlice.actions;

export default maintenanceSparePartInfoesSlice.reducer;
