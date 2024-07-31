import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TechinicanApi from "../components/Axios/TechnicianApi";
import CenterApi from "../components/Axios/CenterApi";

const initialState = {
  sparepartItems: [],
  serviceItems: [],
  maininforss: [],
  payments: [],
  statuscenter: "idle",
  errorcenter: null,
};
export const CenterTotalGetListByMainInfor = createAsyncThunk(
  "centers/CenterTotalGetListByMainInfor",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const list = await CenterApi.TotalGetListByMainInfor({
        token,
        centerId: id,
      });
      console.log("centers/CenterTotalGetListByMainInfor",list.data);

      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const CenterTotalGetListByStatusAndStatusCostService = createAsyncThunk(
  "centers/CenterTotalGetListByStatusAndStatusCostService",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const list = await CenterApi.TotalGetListByStatusAndStatusCostService({
        token,
        centerId: id,
      });
      console.log("centers/CenterTotalGetListByStatusAndStatusCostService",list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const CenterTotalGetListByStatusAndStatusCostSparePart =
  createAsyncThunk(
    "centers/CenterTotalGetListByStatusAndStatusCostSparePart",
    async ({ token, id }, { rejectWithValue }) => {
      try {
        const list = await CenterApi.TotalGetListByStatusAndStatusCostSparePart(
          { token, centerId: id }
        );
        console.log("centers/CenterTotalGetListByStatusAndStatusCostSparePart",list.data);

        return list.data;
      } catch (error) {
        return rejectWithValue(error.response.data.Exception);
      }
    }
  );

export const CenterTotalGetListByStatusPaidReceipt = createAsyncThunk(
  "centers/CenterTotalGetListByStatusPaidReceipt",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const list = await CenterApi.TotalGetListByStatusPaidReceipt({
        token,
        centerId: id,
      });
      console.log("centers/CenterTotalGetListByStatusPaidReceipt",list.data);

      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
const centersSlice = createSlice({
  name: "centers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CenterTotalGetListByMainInfor.pending, (state) => {
        state.statuscenter = "loading";
        state.serviceItems = [];
        state.sparepartItems = [];
        state.maininforss = [];
        state.payments = [];
        state.errorcenter = null;
      })
      .addCase(CenterTotalGetListByMainInfor.fulfilled, (state, action) => {
        state.statustech = "succeeded";
        state.maininforss = action.payload;
      })
      .addCase(CenterTotalGetListByMainInfor.rejected, (state, action) => {
        state.statustech = "failed";
        state.errorcenter = action.payload;
      })
      .addCase(
        CenterTotalGetListByStatusAndStatusCostService.pending,
        (state) => {
          state.statuscenter = "loading";
          state.serviceItems = [];
          state.sparepartItems = [];
          state.maininforss = [];
          state.payments = [];
          state.errorcenter = null;
        }
      )
      .addCase(
        CenterTotalGetListByStatusAndStatusCostService.fulfilled,
        (state, action) => {
          state.statustech = "succeeded";
          state.serviceItems = action.payload;
        }
      )
      .addCase(
        CenterTotalGetListByStatusAndStatusCostService.rejected,
        (state, action) => {
          state.statustech = "failed";
          state.errorcenter = action.payload;
        }
      )
      .addCase(
        CenterTotalGetListByStatusAndStatusCostSparePart.pending,
        (state) => {
          state.statuscenter = "loading";
          state.serviceItems = [];
          state.sparepartItems = [];
          state.maininforss = [];
          state.payments = [];
          state.errorcenter = null;
        }
      )
      .addCase(
        CenterTotalGetListByStatusAndStatusCostSparePart.fulfilled,
        (state, action) => {
          state.statustech = "succeeded";
          state.sparepartItems = action.payload;
        }
      )
      .addCase(
        CenterTotalGetListByStatusAndStatusCostSparePart.rejected,
        (state, action) => {
          state.statustech = "failed";
          state.errorcenter = action.payload;
        }
      )
      .addCase(CenterTotalGetListByStatusPaidReceipt.pending, (state) => {
        state.statuscenter = "loading";
        state.serviceItems = [];
        state.sparepartItems = [];
        state.maininforss = [];
        state.payments = [];
        state.errorcenter = null;
      })
      .addCase(
        CenterTotalGetListByStatusPaidReceipt.fulfilled,
        (state, action) => {
          state.statustech = "succeeded";
          state.payments = action.payload;
        }
      )
      .addCase(
        CenterTotalGetListByStatusPaidReceipt.rejected,
        (state, action) => {
          state.statustech = "failed";
          state.errorcenter = action.payload;
        }
      );
  },
});
export const {} = centersSlice.actions;

export default centersSlice.reducer;
