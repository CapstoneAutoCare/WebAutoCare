import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import VehicleApi from "../components/Axios/VehicleApi";

const initialState = {
    vehicles: [],
    statusvehicles: "idle",
    errorvehicles: null,
    vehicle: null,
};


export const VehicleGetListByCenterWhenBuyPackage = createAsyncThunk(
    "vehicles/VehicleGetListByCenterWhenBuyPackage",
    async ({ token, centerId }, { rejectWithValue }) => {
        try {
            const list = await VehicleApi.getListByCenterWhenBuyPackage({ token, centerId });
            console.log("vehicles/VehicleGetListByCenterWhenBuyPackage", list.data);
            return list.data;
        } catch (error) {
            return rejectWithValue(error.response.data.Exception);
        }
    }
);

// export const CreateVehiclesModelPost = createAsyncThunk(
//     "vehicles/CreateVehiclesModelPost",
//     async ({ token, data }, { rejectWithValue }) => {
//         try {
//             const list = await VehicleModelApi.post({ token, data });
//             console.log("vehicles/CreateVehiclesModelPost", list.data);
//             return list.data;
//         } catch (error) {
//             return rejectWithValue(error.response.data.Exception);
//         }
//     }
// );
const vehicleSlice = createSlice({
    name: "vehicles",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(VehicleGetListByCenterWhenBuyPackage.pending, (state) => {
                state.statusvehicles = "loading";
                state.vehicle = null;
                state.errorvehicles = null;
                state.vehicles = [];
            })
            .addCase(VehicleGetListByCenterWhenBuyPackage.fulfilled, (state, action) => {
                state.statusvehicles = "succeeded";
                state.vehicles = action.payload;
            })
            .addCase(VehicleGetListByCenterWhenBuyPackage.rejected, (state, action) => {
                state.statusvehicles = "failed";
                state.errorvehicles = action.payload;
            })
        // .addCase(CreateVehiclesModelPost.pending, (state) => {
        //     state.statusvehicles = "loading";
        //     state.vehicle = null;
        //     state.errorvehicles = null;
        //     state.vehicles = [];
        // })
        // .addCase(CreateVehiclesModelPost.fulfilled, (state, action) => {
        //     state.statusvehicles = "succeeded";
        //     state.vehicle = action.payload;
        // })
        // .addCase(CreateVehiclesModelPost.rejected, (state, action) => {
        //     state.statusvehicles = "failed";
        //     state.errorvehicles = action.payload;
        //     alert(action.payload);
        // });
    },
});
export const { } = vehicleSlice.actions;

export default vehicleSlice.reducer;
