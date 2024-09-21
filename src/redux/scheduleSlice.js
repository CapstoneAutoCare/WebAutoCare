import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ScheduleApi from "../components/Axios/ScheduleApi";

const initialState = {
  schedules: [],
  statusschedules: "idle",
  errorschedules: null,
  schedule: null,
};

export const ScheduleListGetall = createAsyncThunk(
  "schedules/ScheduleListGetall",
  async (token, { rejectWithValue }) => {
    try {
      const list = await ScheduleApi.getAll(token);
      console.log("schedules/ScheduleList", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const ScheduleGetListPackageCenterId = createAsyncThunk(
  "schedules/ScheduleGetListPackageCenterId",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const list = await ScheduleApi.getListPackageCenterId({ token, id });
      console.log("schedules/ScheduleGetListPackageCenterId", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const ScheduleGetListPlanIdAndPackageCenterIdBookingId = createAsyncThunk(
  "schedules/ScheduleGetListPlanIdAndPackageCenterIdBookingId",
  async ({ token, planId, id, bookingId }, { rejectWithValue }) => {
    try {
      const list = await ScheduleApi.getListPlanIdAndPackageCenterIdBookingId({ token, planId, id, bookingId });
      console.log("schedules/ScheduleGetListPlanIdAndPackageCenterIdBookingId", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const CreateSchedulePost = createAsyncThunk(
  "schedules/CreateSchedulePost",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const list = await ScheduleApi.createpost({ token, data });
      console.log("schedules/CreateSchedulePost", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);


export const UpdatechedulePut = createAsyncThunk(
  "schedules/UpdatechedulePut",
  async ({ token, id, data }, { rejectWithValue }) => {
    try {
      const list = await ScheduleApi.updateschedule({ token, id, data });
      console.log("schedules/UpdatechedulePut", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
const scheduleSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(ScheduleListGetall.pending, (state) => {
        state.statusschedules = "loading";
        state.schedule = null;
        state.errorschedules = null;
        state.schedules = [];
      })
      .addCase(ScheduleListGetall.fulfilled, (state, action) => {
        state.statusschedules = "succeeded";
        state.schedules = action.payload;
      })
      .addCase(ScheduleListGetall.rejected, (state, action) => {
        state.statusschedules = "failed";
        state.errorschedules = action.payload;
      })
      .addCase(CreateSchedulePost.pending, (state) => {
        state.statusschedules = "loading";
        state.schedule = null;
        state.errorschedules = null;
        state.schedules = [];
      })
      .addCase(CreateSchedulePost.fulfilled, (state, action) => {
        state.statusschedules = "succeeded";
        state.schedule = action.payload;
      })
      .addCase(CreateSchedulePost.rejected, (state, action) => {
        state.statusschedules = "failed";
        state.errorschedules = action.payload;
      })
      .addCase(ScheduleGetListPackageCenterId.pending, (state) => {
        state.statusschedules = "loading";
        state.schedule = null;
        state.errorschedules = null;
        state.schedules = [];
      })
      .addCase(ScheduleGetListPackageCenterId.fulfilled, (state, action) => {
        state.statusschedules = "succeeded";
        state.schedules = action.payload;
      })
      .addCase(ScheduleGetListPackageCenterId.rejected, (state, action) => {
        state.statusschedules = "failed";
        state.errorschedules = action.payload;
      })
      .addCase(ScheduleGetListPlanIdAndPackageCenterIdBookingId.pending, (state) => {
        state.statusschedules = "loading";
        state.schedule = null;
        state.errorschedules = null;
        state.schedules = [];
      })
      .addCase(ScheduleGetListPlanIdAndPackageCenterIdBookingId.fulfilled, (state, action) => {
        state.statusschedules = "succeeded";
        state.schedules = action.payload;
      })
      .addCase(ScheduleGetListPlanIdAndPackageCenterIdBookingId.rejected, (state, action) => {
        state.statusschedules = "failed";
        state.errorschedules = action.payload;
      })
      .addCase(UpdatechedulePut.pending, (state) => {
        state.statusschedules = "loading";
        state.schedule = null;
        state.errorschedules = null;
        state.schedules = [];
      })
      .addCase(UpdatechedulePut.fulfilled, (state, action) => {
        state.statusschedules = "succeeded";
        state.schedule = action.payload;
      })
      .addCase(UpdatechedulePut.rejected, (state, action) => {
        state.statusschedules = "failed";
        state.errorschedules = action.payload;
      })

      ;
  },
});
export const { } = scheduleSlice.actions;

export default scheduleSlice.reducer;
