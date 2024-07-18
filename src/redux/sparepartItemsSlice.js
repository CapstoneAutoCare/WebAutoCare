import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SparePartItemsApi from "../components/Axios/SparePartItemsApi";
import CostItemApi from "../components/Axios/CostItemApi";

const initialState = {
  sparepartitems: [],
  statussparepartitem: "idle",
  errorsparepartitem: null,
  sparepartitem: null,
  sparepartitemscosts: [],
  sparepartitemscost: null,
};

export const SparePartItemsAll = createAsyncThunk(
  "sparepartitem/GetAll",
  async (token) => {
    try {
      const list = await SparePartItemsApi.getAll(token);
      return list.data;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);
export const SparePartItemById = createAsyncThunk(
  "sparepartitem/SparePartItemById",
  async ({ token, id }) => {
    try {
      const list = await SparePartItemsApi.getById({ token: token, id: id });
      return list.data;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);
export const SparePartItemsByCenterId = createAsyncThunk(
  "sparepartitem/GetListByCenter",
  async (centerId, token) => {
    try {
      const list = await SparePartItemsApi.getListByCenter(centerId, token);
      console.log(list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
export const AddSparePartItemsByCenter = createAsyncThunk(
  "sparepartitem/AddSparePartItemsByCenter",
  async ({ token, data }) => {
    try {
      const list = await SparePartItemsApi.addSpartPartItem(token, data);
      console.log(list);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
export const UpdateSparePartItemByCenter = createAsyncThunk(
  "sparepartitem/UpdateSparePartItemByCenter",
  async ({ token, id, data }) => {
    try {
      const list = await SparePartItemsApi.updateSparePartItem({
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

export const ChangeStatusSparePartItemCostByCenter = createAsyncThunk(
  "sparepartitemCost/ChangeStatusSparePartItemCostByCenter",
  async ({ token, id, status }) => {
    try {
      const list = await CostItemApi.changestatusCostSpartPartItem({
        token: token,
        id: id,
        status: status,
      });
      console.log(list);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const GetByIdSparePartActiveCost = createAsyncThunk(
  "sparepartitemCost/GetByIdSparePartActiveCost",
  async ({ token, id }) => {
    try {
      const list = await CostItemApi.getByIdSparePartActiveCost(token, id);
      console.log(list);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
export const AddSparePartItemCost = createAsyncThunk(
  "sparepartitemCost/AddSparePartItemCost",
  async ({ token, data }) => {
    try {
      const list = await CostItemApi.postSparePartItemCost({
        token,
        data: data,
      });
      console.log(list);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
const sparepartitemsSlice = createSlice({
  name: "sparepartitem",
  initialState,
  reducers: {
    GetAll: (state, action) => {
      state.sparepartitems = action.payload;
      state.errorsparepartitem = null;
    },
    GetListByCenter: (state, action) => {
      state.sparepartitems = action.payload;
      state.errorsparepartitem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SparePartItemsAll.pending, (state) => {
        state.statussparepartitem = "loading";
        state.sparepartitem=null;
        state.sparepartitems=[];
        state.sparepartitemscost=null;
        state.sparepartitemscosts=[];
        state.statussparepartitem=null;
        state.sparepartitem=null;
        state.sparepartitems=[];
        state.sparepartitemscost=null;
        state.sparepartitemscosts=[];
        state.statussparepartitem=null;
      })
      .addCase(SparePartItemsAll.fulfilled, (state, action) => {
        state.statussparepartitem = "succeeded";
        state.sparepartitems = action.payload;
      })
      .addCase(SparePartItemsAll.rejected, (state, action) => {
        state.statussparepartitem = "failed";
        state.errorsparepartitem = action.error.message;
      })
      .addCase(SparePartItemsByCenterId.pending, (state) => {
        state.statussparepartitem = "loading";
        state.sparepartitem=null;
        state.sparepartitems=[];
        state.sparepartitemscost=null;
        state.sparepartitemscosts=[];
        state.statussparepartitem=null;
      })
      .addCase(SparePartItemsByCenterId.fulfilled, (state, action) => {
        state.statussparepartitem = "succeeded";
        state.sparepartitems = action.payload;
        console.log("payload", state.sparepartitems);
      })
      .addCase(SparePartItemsByCenterId.rejected, (state, action) => {
        state.statussparepartitem = "failed";
        state.errorsparepartitem = action.error.message;
      })

      .addCase(AddSparePartItemsByCenter.pending, (state) => {
        state.statussparepartitem = "loading";
        state.sparepartitem=null;
        state.sparepartitems=[];
        state.sparepartitemscost=null;
        state.sparepartitemscosts=[];
        state.statussparepartitem=null;
      })
      .addCase(AddSparePartItemsByCenter.fulfilled, (state, action) => {
        state.statussparepartitem = "succeeded";
        state.sparepartitems = action.payload;
        console.log("payload", state.sparepartitems);
      })
      .addCase(AddSparePartItemsByCenter.rejected, (state, action) => {
        state.statussparepartitem = "failed";
        state.errorsparepartitem = action.error.message;
      })
      .addCase(UpdateSparePartItemByCenter.pending, (state) => {
        state.statussparepartitem = "loading";
        state.sparepartitem=null;
        state.sparepartitems=[];
        state.sparepartitemscost=null;
        state.sparepartitemscosts=[];
        state.statussparepartitem=null;
      })
      .addCase(UpdateSparePartItemByCenter.fulfilled, (state, action) => {
        state.statussparepartitem = "succeeded";
        state.sparepartitem = action.payload;
        console.log("payload", state.sparepartitem);
      })
      .addCase(UpdateSparePartItemByCenter.rejected, (state, action) => {
        state.statussparepartitem = "failed";
        state.errorsparepartitem = action.error.message;
      })
      .addCase(GetByIdSparePartActiveCost.pending, (state) => {
        state.sparepartitemscost = "loading";
      })
      .addCase(GetByIdSparePartActiveCost.fulfilled, (state, action) => {
        state.statussparepartitem = "succeeded";
        state.sparepartitemscost = action.payload;
        console.log("payload", state.sparepartitemscost);
      })
      .addCase(GetByIdSparePartActiveCost.rejected, (state, action) => {
        state.statussparepartitem = "failed";
        state.errorsparepartitem = action.error.message;
      })
      .addCase(SparePartItemById.pending, (state) => {
        state.statussparepartitem = "loading";
        state.sparepartitem=null;
        state.sparepartitems=[];
        state.sparepartitemscost=null;
        state.sparepartitemscosts=[];
        state.statussparepartitem=null;
      })
      .addCase(SparePartItemById.fulfilled, (state, action) => {
        state.statussparepartitem = "succeeded";
        state.sparepartitem = action.payload;
        // console.log("payload", state.sparepartitem);
      })
      .addCase(SparePartItemById.rejected, (state, action) => {
        state.statussparepartitem = "failed";
        state.errorsparepartitem = action.error.message;
      });
  },
});
export const { GetAll, GetListByCenter } = sparepartitemsSlice.actions;

export default sparepartitemsSlice.reducer;
