import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import MaintenanceServicesApi from "../components/Axios/MaintenanceServicesApi";
import CostItemApi from "../components/Axios/CostItemApi";

const initialState = {
  maintenanceservices: [],
  statusmaintenanceservices: "idle",
  errormaintenanceservices: null,
  maintenanceservice: null,
  maintenanceservicescost: [],
};
export const MaintenanceServicesAll = createAsyncThunk(
  "maintenanceservice/GetAll",
  async (token) => {
    try {
      const list = await MaintenanceServicesApi.getAll(token);
      return list.data;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);
export const MaintenanceServicesById = createAsyncThunk(
  "maintenanceservice/MaintenanceServicesById",
  async ({ token, id }) => {
    try {
      const list = await MaintenanceServicesApi.GetById({ token, id });
      console.log("maintenanceservice/MaintenanceServicesById", list.data);

      return list.data;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);
export const MaintenanceServicesByCenterId = createAsyncThunk(
  "maintenanceservice/GetListByCenter",
  async (centerId, token) => {
    try {
      const list = await MaintenanceServicesApi.getListByCenter(
        centerId,
        token
      );
      console.log(list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
export const AddMaintenanceServiceByCenter = createAsyncThunk(
  "maintenanceservice/AddMaintenanceServiceByCenter",
  async ({ token, data }) => {
    try {
      const list = await MaintenanceServicesApi.addMaintenanceServicesItem(
        token,
        data
      );
      console.log(list);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
export const UpdateMaintenanceServiceByCenter = createAsyncThunk(
  "maintenanceservice/UpdateMaintenanceServiceByCenter",
  async ({ token, id, data }) => {
    try {
      const list = await MaintenanceServicesApi.updateMaintenanceServicesItem({
        token: token,
        id: id,
        data: data,
      });
      console.log(list);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
export const AddMaintenanceServiceCost = createAsyncThunk(
  "maintenanceservice/AddMaintenanceServiceCost",
  async ({ token, data }) => {
    try {
      const list = await CostItemApi.postMaintenanceServiceCost({
        token,
        data,
      });
      console.log("maintenanceservice/AddMaintenanceServiceCost", list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
export const ChangeStatusMaintenanceServiceCostByCenter = createAsyncThunk(
  "maintenanceservice/ChangeStatusMaintenanceServiceCostByCenter",
  async ({ token, id, status }) => {
    try {
      const list = await CostItemApi.changestatusCostMaintenanceService({
        token,
        id: id,
        status: status,
      });
      console.log(
        "maintenanceservice/ChangeStatusMaintenanceServiceCostByCenter",
        list.data
      );
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
export const GetByIdMaintenanceServiceActiveCost = createAsyncThunk(
  "maintenanceservice/getByIdMaintenanceServiceActiveCost",
  async ({ token, id }) => {
    try {
      const list = await CostItemApi.getByIdMaintenanceServiceActiveCost({
        token,
        id,
      });
      console.log(
        "maintenanceservice/getByIdMaintenanceServiceActiveCost",
        list.data
      );
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
const mainserviceSlice = createSlice({
  name: "maintenanceservice",
  initialState,
  reducers: {
    GetAll: (state, action) => {
      state.maintenanceservices = action.payload;
      state.error = null;
    },
    // GetListByCenter: (state, { action }) => {
    //   state.MaintenanceServices = action.payload;
    //   state.error = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(MaintenanceServicesAll.pending, (state) => {
        state.statusmaintenanceservices = "loading";
      })
      .addCase(MaintenanceServicesAll.fulfilled, (state, action) => {
        state.statusmaintenanceservices = "succeeded";
        state.maintenanceservices = action.payload;
      })
      .addCase(MaintenanceServicesAll.rejected, (state, action) => {
        state.statusmaintenanceservices = "failed";
        state.errormaintenanceservices = action.error.message;
      })
      .addCase(MaintenanceServicesByCenterId.pending, (state) => {
        state.statusmaintenanceservices = "loading";
      })
      .addCase(MaintenanceServicesByCenterId.fulfilled, (state, action) => {
        state.statusmaintenanceservices = "succeeded";
        state.maintenanceservices = action.payload;
        console.log("payload", state.maintenanceservices);
      })
      .addCase(MaintenanceServicesByCenterId.rejected, (state, action) => {
        state.statusmaintenanceservices = "failed";
        state.errormaintenanceservices = action.error.message;
      })
      .addCase(UpdateMaintenanceServiceByCenter.pending, (state) => {
        state.statusmaintenanceservices = "loading";
      })
      .addCase(UpdateMaintenanceServiceByCenter.fulfilled, (state, action) => {
        state.statusmaintenanceservices = "succeeded";
        state.maintenanceservices = action.payload;
        console.log("payload", state.maintenanceservices);
      })
      .addCase(UpdateMaintenanceServiceByCenter.rejected, (state, action) => {
        state.statusmaintenanceservices = "failed";
        state.errormaintenanceservices = action.error.message;
      })
      .addCase(MaintenanceServicesById.pending, (state) => {
        state.statusmaintenanceservices = "loading";
      })
      .addCase(MaintenanceServicesById.fulfilled, (state, action) => {
        state.statusmaintenanceservices = "succeeded";
        state.maintenanceservice = action.payload;
        console.log("payload", state.maintenanceservice);
      })
      .addCase(MaintenanceServicesById.rejected, (state, action) => {
        state.statusmaintenanceservices = "failed";
        state.errormaintenanceservices = action.error.message;
      })
      .addCase(ChangeStatusMaintenanceServiceCostByCenter.pending, (state) => {
        state.statusmaintenanceservices = "loading";
      })
      .addCase(
        ChangeStatusMaintenanceServiceCostByCenter.fulfilled,
        (state, action) => {
          state.statusmaintenanceservices = "succeeded";
          state.maintenanceservicescost = action.payload;
          console.log("payload", state.maintenanceservicescost);
        }
      )
      .addCase(
        ChangeStatusMaintenanceServiceCostByCenter.rejected,
        (state, action) => {
          state.statusmaintenanceservices = "failed";
          state.errormaintenanceservices = action.error.message;
        }
      )
      .addCase(AddMaintenanceServiceCost.pending, (state) => {
        state.statusmaintenanceservices = "loading";
      })
      .addCase(AddMaintenanceServiceCost.fulfilled, (state, action) => {
        state.statusmaintenanceservices = "succeeded";
        state.maintenanceservicescost = action.payload;
        console.log("payload", state.maintenanceservicescost);
      })
      .addCase(AddMaintenanceServiceCost.rejected, (state, action) => {
        state.statusmaintenanceservices = "failed";
        state.errormaintenanceservices = action.error.message;
      })
      .addCase(GetByIdMaintenanceServiceActiveCost.pending, (state) => {
        state.statusmaintenanceservices = "loading";
      })
      .addCase(
        GetByIdMaintenanceServiceActiveCost.fulfilled,
        (state, action) => {
          state.statusmaintenanceservices = "succeeded";
          state.maintenanceservicescost = action.payload;
          console.log("payload", state.maintenanceservicescost);
        }
      )
      .addCase(
        GetByIdMaintenanceServiceActiveCost.rejected,
        (state, action) => {
          state.statusmaintenanceservices = "failed";
          state.errormaintenanceservices = action.error.message;
        }
      );
  },
});
export const { GetAll } = mainserviceSlice.actions;

export default mainserviceSlice.reducer;
