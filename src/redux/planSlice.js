import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ScheduleApi from "../components/Axios/ScheduleApi";
import PlanApi from "../components/Axios/PlanApi";

const initialState = {
  plans: [],
  statusplans: "idle",
  errorplans: null,
  plan: null,
};

export const PlanListGetall = createAsyncThunk(
  "plans/PlanListGetall",
  async (token, { rejectWithValue }) => {
    try {
      const list = await PlanApi.getAll(token);
      console.log("plans/PlanListGetall", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);

export const PlanListByCenterAndVehicle = createAsyncThunk(
  "plans/PlanListByCenterAndVehicle",
  async ({token,id,vehicleId}, { rejectWithValue }) => {
    try {
      const list = await PlanApi.getListByCenterAndVehicle({token,id,vehicleId});
      console.log("plans/PlanListByCenterAndVehicle", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const CreatePlanPost = createAsyncThunk(
  "plans/CreatePlanPost",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const list = await PlanApi.createpost({ token, data });
      console.log("plans/CreatePlanPost", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
const planSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(PlanListGetall.pending, (state) => {
        state.statusplans = "loading";
        state.plan = null;
        state.errorplans = null;
        state.plans = [];
      })
      .addCase(PlanListGetall.fulfilled, (state, action) => {
        state.statusplans = "succeeded";
        state.plans = action.payload;
      })
      .addCase(PlanListGetall.rejected, (state, action) => {
        state.statusplans = "failed";
        state.errorplans = action.payload;
      })


      .addCase(CreatePlanPost.pending, (state) => {
        state.statusplans = "loading";
        state.plan = null;
        state.errorplans = null;
        state.plans = [];
      })
      .addCase(CreatePlanPost.fulfilled, (state, action) => {
        state.statusplans = "succeeded";
        state.plan = action.payload;
      })
      .addCase(CreatePlanPost.rejected, (state, action) => {
        state.statusplans = "failed";
        state.errorplans = action.payload;
      })
      .addCase(PlanListByCenterAndVehicle.pending, (state) => {
        state.statusplans = "loading";
        state.plan = null;
        state.errorplans = null;
        state.plans = [];
      })
      .addCase(PlanListByCenterAndVehicle.fulfilled, (state, action) => {
        state.statusplans = "succeeded";
        state.plans = action.payload;
      })
      .addCase(PlanListByCenterAndVehicle.rejected, (state, action) => {
        state.statusplans = "failed";
        state.errorplans = action.payload;
      })
      
      ;
  },
});
export const {} = planSlice.actions;

export default planSlice.reducer;
