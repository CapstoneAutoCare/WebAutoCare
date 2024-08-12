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
  center: null,
  centerlists: [],
};
export const PostCenter = createAsyncThunk(
  "centers/CreateCenter",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CenterApi.CreateCenter(data);
      console.log("centers/CreateCenter", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.Exception || "An error occurred"
      );
    }
  }
);
export const CenterTotalGetListByMainInfor = createAsyncThunk(
  "centers/CenterTotalGetListByMainInfor",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const list = await CenterApi.TotalGetListByMainInfor({
        token,
        centerId: id,
      });
      console.log("centers/CenterTotalGetListByMainInfor", list.data);

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
      console.log(
        "centers/CenterTotalGetListByStatusAndStatusCostService",
        list.data
      );
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
        console.log(
          "centers/CenterTotalGetListByStatusAndStatusCostSparePart",
          list.data
        );

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
      console.log("centers/CenterTotalGetListByStatusPaidReceipt", list.data);

      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const CenterGetAll = createAsyncThunk(
  "centers/GetAll",
  async (token, { rejectWithValue }) => {
    try {
      const list = await CenterApi.GetAll(token);
      console.log("centers/GetAll", list.data);

      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const ChangeStatusPut = createAsyncThunk(
  "centers/ChangeStatusPut",
  async ({ token, id, status }, { rejectWithValue }) => {
    try {
      const list = await CenterApi.patchStatus({ id, status, token });
      console.log("centers/ChangeStatusPut", list.data);

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
        state.center = null;
        state.centerlists = [];
      })
      .addCase(CenterTotalGetListByMainInfor.fulfilled, (state, action) => {
        state.statuscenter = "succeeded";
        state.maininforss = action.payload;
      })
      .addCase(CenterTotalGetListByMainInfor.rejected, (state, action) => {
        state.statuscenter = "failed";
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
          state.center = null;
          state.centerlists = [];
        }
      )
      .addCase(
        CenterTotalGetListByStatusAndStatusCostService.fulfilled,
        (state, action) => {
          state.statuscenter = "succeeded";
          state.serviceItems = action.payload;
        }
      )
      .addCase(
        CenterTotalGetListByStatusAndStatusCostService.rejected,
        (state, action) => {
          state.statuscenter = "failed";
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
          state.center = null;
          state.centerlists = [];
        }
      )
      .addCase(
        CenterTotalGetListByStatusAndStatusCostSparePart.fulfilled,
        (state, action) => {
          state.statuscenter = "succeeded";
          state.sparepartItems = action.payload;
        }
      )
      .addCase(
        CenterTotalGetListByStatusAndStatusCostSparePart.rejected,
        (state, action) => {
          state.statuscenter = "failed";
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
        state.center = null;
        state.centerlists = [];
      })
      .addCase(
        CenterTotalGetListByStatusPaidReceipt.fulfilled,
        (state, action) => {
          state.statuscenter = "succeeded";
          state.payments = action.payload;
        }
      )
      .addCase(
        CenterTotalGetListByStatusPaidReceipt.rejected,
        (state, action) => {
          state.statuscenter = "failed";
          state.errorcenter = action.payload;
        }
      )
      .addCase(PostCenter.pending, (state) => {
        state.statuscenter = "loading";
        state.serviceItems = [];
        state.sparepartItems = [];
        state.maininforss = [];
        state.payments = [];
        state.errorcenter = null;
        state.center = null;
        state.centerlists = [];
      })
      .addCase(PostCenter.fulfilled, (state, action) => {
        state.statuscenter = "succeeded";
        state.center = action.payload;
      })
      .addCase(PostCenter.rejected, (state, action) => {
        state.statuscenter = "failed";
        state.errorcenter = action.payload;
        alert(action.payload);
      })
      .addCase(CenterGetAll.pending, (state) => {
        state.statuscenter = "loading";
        state.serviceItems = [];
        state.sparepartItems = [];
        state.maininforss = [];
        state.payments = [];
        state.errorcenter = null;
        state.center = null;
        state.centerlists = [];
      })
      .addCase(CenterGetAll.fulfilled, (state, action) => {
        state.statuscenter = "succeeded";
        state.centerlists = action.payload;
      })
      .addCase(CenterGetAll.rejected, (state, action) => {
        state.statuscenter = "failed";
        state.errorcenter = action.payload;
        alert(action.payload);
      })
      .addCase(ChangeStatusPut.pending, (state) => {
        state.statuscenter = "loading";
        state.serviceItems = [];
        state.sparepartItems = [];
        state.maininforss = [];
        state.payments = [];
        state.errorcenter = null;
        state.center = null;
        state.centerlists = [];
      })
      .addCase(ChangeStatusPut.fulfilled, (state, action) => {
        state.statuscenter = "succeeded";
        state.center = action.payload;
      })
      .addCase(ChangeStatusPut.rejected, (state, action) => {
        state.statuscenter = "failed";
        state.errorcenter = action.payload;
        alert(action.payload);
      });
  },
});
export const {} = centersSlice.actions;

export default centersSlice.reducer;
