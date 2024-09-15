import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ScheduleApi from "../components/Axios/ScheduleApi";
import MaintenanceVehiclesDetailsApi from "../components/Axios/MaintenanceVehiclesDetailsApi";

const initialState = {
    maintenanceVehiclesDetails: [],
    statusmaintenanceVehiclesDetails: "idle",
    errormaintenanceVehiclesDetails: null,
    maintenanceVehiclesDetail: null,
};

export const MaintenanceVehiclesDetailsListGetall = createAsyncThunk(
    "maintenanceVehiclesDetails/MaintenanceVehiclesDetailsListGetall",
    async (token, { rejectWithValue }) => {
        try {
            const list = await MaintenanceVehiclesDetailsApi.getAll(token);
            console.log("schedules/ScheduleList", list.data);
            return list.data;
        } catch (error) {
            return rejectWithValue(error.response.data.Exception);
        }
    }
);
export const MaintenanceVehiclesDetailsgetListByVehicleId = createAsyncThunk(
    "maintenanceVehiclesDetails/MaintenanceVehiclesDetailsgetListByVehicleId",
    async ({ token, vehicleId }, { rejectWithValue }) => {
        try {
            const list = await MaintenanceVehiclesDetailsApi.getListByVehicleId({ token, vehicleId });
            console.log("maintenanceVehiclesDetails/MaintenanceVehiclesDetailsgetListByVehicleId", list.data);
            return list.data;
        } catch (error) {
            return rejectWithValue(error.response.data.Exception);
        }
    }
);

export const MaintenanceVehiclesDetailsGetbyId = createAsyncThunk(
    "maintenanceVehiclesDetails/MaintenanceVehiclesDetailsGetbyId",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const list = await MaintenanceVehiclesDetailsApi.getbyId({ token, id });
            console.log("maintenanceVehiclesDetails/MaintenanceVehiclesDetailsGetbyId", list.data);
            return list.data;
        } catch (error) {
            return rejectWithValue(error.response.data.Exception);
        }
    }
);
export const MaintenanceVehiclesDetailgetListByPlanAndVehicleAndCenter = createAsyncThunk(
    "maintenanceVehiclesDetails/MaintenanceVehiclesDetailgetListByPlanAndVehicleAndCenter",
    async ({ token, planId, vehicleId, centerId }, { rejectWithValue }) => {
        try {
            const list = await MaintenanceVehiclesDetailsApi.getListByPlanAndVehicleAndCenter({ token, planId, vehicleId, centerId });
            console.log("schedules/MaintenanceVehiclesDetailgetListByPlanAndVehicleAndCenter", list.data);
            return list.data;
        } catch (error) {
            return rejectWithValue(error.response.data.Exception);
        }
    }
);
export const CreateMaintenanceVehiclesDetailPost = createAsyncThunk(
    "maintenanceVehiclesDetails/CreateMaintenanceVehiclesDetailPost",
    async ({ token, data }, { rejectWithValue }) => {
        try {
            const list = await MaintenanceVehiclesDetailsApi.createpost({ token, data });
            console.log("schedules/CreateMaintenanceVehiclesDetailPost", list.data);
            return list.data;
        } catch (error) {
            return rejectWithValue(error.response.data.Exception);
        }
    }
);
const maintenanceVehiclesDetailsSlice = createSlice({
    name: "maintenanceVehiclesDetails",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(MaintenanceVehiclesDetailsListGetall.pending, (state) => {
                state.statusmaintenanceVehiclesDetails = "loading";
                state.maintenanceVehiclesDetail = null;
                state.errormaintenanceVehiclesDetails = null;
                state.maintenanceVehiclesDetails = [];
            })
            .addCase(MaintenanceVehiclesDetailsListGetall.fulfilled, (state, action) => {
                state.statusmaintenanceVehiclesDetails = "succeeded";
                state.maintenanceVehiclesDetails = action.payload;
            })
            .addCase(MaintenanceVehiclesDetailsListGetall.rejected, (state, action) => {
                state.statusmaintenanceVehiclesDetails = "failed";
                state.errormaintenanceVehiclesDetails = action.payload;
            })


            .addCase(MaintenanceVehiclesDetailsgetListByVehicleId.pending, (state) => {
                state.statusmaintenanceVehiclesDetails = "loading";
                state.maintenanceVehiclesDetail = null;
                state.errormaintenanceVehiclesDetails = null;
                state.maintenanceVehiclesDetails = [];
            })
            .addCase(MaintenanceVehiclesDetailsgetListByVehicleId.fulfilled, (state, action) => {
                state.statusmaintenanceVehiclesDetails = "succeeded";
                state.maintenanceVehiclesDetails = action.payload;
            })
            .addCase(MaintenanceVehiclesDetailsgetListByVehicleId.rejected, (state, action) => {
                state.statusmaintenanceVehiclesDetails = "failed";
                state.errormaintenanceVehiclesDetails = action.payload;
            })


            .addCase(MaintenanceVehiclesDetailsGetbyId.pending, (state) => {
                state.statusmaintenanceVehiclesDetails = "loading";
                state.maintenanceVehiclesDetail = null;
                state.errormaintenanceVehiclesDetails = null;
                state.maintenanceVehiclesDetails = [];
            })
            .addCase(MaintenanceVehiclesDetailsGetbyId.fulfilled, (state, action) => {
                state.statusmaintenanceVehiclesDetails = "succeeded";
                state.maintenanceVehiclesDetail = action.payload;
            })
            .addCase(MaintenanceVehiclesDetailsGetbyId.rejected, (state, action) => {
                state.statusmaintenanceVehiclesDetails = "failed";
                state.errormaintenanceVehiclesDetails = action.payload;
            })


            .addCase(MaintenanceVehiclesDetailgetListByPlanAndVehicleAndCenter.pending, (state) => {
                state.statusmaintenanceVehiclesDetails = "loading";
                state.maintenanceVehiclesDetail = null;
                state.errormaintenanceVehiclesDetails = null;
                state.maintenanceVehiclesDetails = [];
            })
            .addCase(MaintenanceVehiclesDetailgetListByPlanAndVehicleAndCenter.fulfilled, (state, action) => {
                state.statusmaintenanceVehiclesDetails = "succeeded";
                state.maintenanceVehiclesDetails = action.payload;
            })
            .addCase(MaintenanceVehiclesDetailgetListByPlanAndVehicleAndCenter.rejected, (state, action) => {
                state.statusmaintenanceVehiclesDetails = "failed";
                state.errormaintenanceVehiclesDetails = action.payload;
            })
    },
});
export const { } = maintenanceVehiclesDetailsSlice.actions;

export default maintenanceVehiclesDetailsSlice.reducer;
