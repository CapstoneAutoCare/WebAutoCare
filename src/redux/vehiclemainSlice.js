import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TechinicanApi from "../components/Axios/TechnicianApi";
import BrandVehiclesApi from "../components/Axios/BrandVehiclesApi";

const initialState = {
    vehiclemains: [],
    vehiclemain: null,
    statusvehiclemains: "idle",
    errorvehiclemains: null,
};
export const VehiclesMaintenancesByCenter = createAsyncThunk(
    "vehiclemains/VehiclesMaintenancesByCenter",
    async (id) => {
        try {
            const list = await BrandVehiclesApi.vehiclesMaintenancesByCenter(id);
            console.log("vehiclemains/VehiclesMaintenancesByCenter", list.data);
            return list.data;
        } catch (error) {
            throw new Error(error.Messages);
        }
    }
);
export const TechinicanByCenterId = createAsyncThunk(
    "technician/GetListByCenter",
    async (centerId, token) => {
        try {
            const list = await TechinicanApi.getListByCenter(centerId, token);
            console.log("technician/GetListByCenter", list.data);
            return list.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);
export const VehiclesMaintenancesPost = createAsyncThunk(
    "vehiclemains/VehiclesMaintenancesPost",
    async ({ token, data }, { rejectWithValue }) => {
        try {
            const list = await BrandVehiclesApi.vehiclesMaintenancesPost({ token, data });
            console.log("vehiclemains/VehiclesMaintenancesPost", list.data);
            return list.data;
        } catch (error) {
            return rejectWithValue(error.response.data.Exception);
        }
    }
);
const vehiclemainSlice = createSlice({
    name: "vehiclemains",
    initialState,
    reducers: {
        GetAll: (state, action) => {
            state.vehiclemains = action.payload;
            state.errorvehiclemains = null;
        },
        // GetListByCenter: (state, { action }) => {
        //   state.vehiclemains = action.payload;
        //   state.error = null;
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(VehiclesMaintenancesByCenter.pending, (state) => {
                state.statusvehiclemains = "loading";
                state.vehiclemains = [];
                state.vehiclemain = null;
                state.errorvehiclemains = null;
            })
            .addCase(VehiclesMaintenancesByCenter.fulfilled, (state, action) => {
                state.statusvehiclemains = "succeeded";
                state.vehiclemains = action.payload;
            })
            .addCase(VehiclesMaintenancesByCenter.rejected, (state, action) => {
                state.statusvehiclemains = "failed";
                state.errorvehiclemains = action.error.message;
            })
            .addCase(TechinicanByCenterId.pending, (state) => {
                state.statusvehiclemains = "loading";
                state.vehiclemains = [];
                state.vehiclemain = null;
                state.errorvehiclemains = null;
            })
            .addCase(TechinicanByCenterId.fulfilled, (state, action) => {
                state.statusvehiclemains = "succeeded";
                state.vehiclemains = action.payload;
                console.log("payload", state.vehiclemains);
            })
            .addCase(TechinicanByCenterId.rejected, (state, action) => {
                state.statusvehiclemains = "failed";
                state.errorvehiclemains = action.error.message;
            })
            .addCase(VehiclesMaintenancesPost.pending, (state) => {
                state.statusvehiclemains = "loading";
                state.vehiclemains = [];
                state.vehiclemain = null;
                state.errorvehiclemains = null;
            })
            .addCase(VehiclesMaintenancesPost.fulfilled, (state, action) => {
                state.statusvehiclemains = "succeeded";
                state.vehiclemain = action.payload;
                // console.log("payload", state.vehiclemain);
            })
            .addCase(VehiclesMaintenancesPost.rejected, (state, action) => {
                state.statusvehiclemains = "failed";
                state.errorvehiclemains = action.payload;
                alert(state.errorvehiclemains);
            });
    },
});
export const { GetAll } = vehiclemainSlice.actions;

export default vehiclemainSlice.reducer;
