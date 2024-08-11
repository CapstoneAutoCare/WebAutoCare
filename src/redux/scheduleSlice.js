import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ScheduleApi from "../components/Axios/ScheduleApi";

const initialState = {
  schedules: [],
  statusschedules: "idle",
  errorschedules: null,
  schedule: null,
};

// export const ServicesAll = createAsyncThunk(
//   "services/GetAll",
//   async ({ token }, { rejectWithValue }) => {
//     try {
//       const list = await ServicesApi.getAll({ token });
//       console.log("services/GetAll", list.data);
//       return list.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data.Exception);
//     }
//   }
// );
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
      });
  },
});
export const {} = scheduleSlice.actions;

export default scheduleSlice.reducer;
