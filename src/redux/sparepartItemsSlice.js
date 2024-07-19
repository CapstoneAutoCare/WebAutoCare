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
  async (token, { rejectWithValue }) => {
    try {
      const list = await SparePartItemsApi.getAll(token);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const SparePartItemById = createAsyncThunk(
  "sparepartitem/SparePartItemById",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const list = await SparePartItemsApi.getById({ token: token, id: id });
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const SparePartItemsByCenterId = createAsyncThunk(
  "sparepartitem/GetListByCenter",
  async ({ centerId, token }, { rejectWithValue }) => {
    try {
      const list = await SparePartItemsApi.getListByCenter({ token, centerId });
      console.log(list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const AddSparePartItemsByCenter = createAsyncThunk(
  "sparepartitem/AddSparePartItemsByCenter",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const list = await SparePartItemsApi.addSpartPartItem({ token, data });
      console.log("sparepartitem/AddSparePartItemsByCenter", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const UpdateSparePartItemByCenter = createAsyncThunk(
  "sparepartitem/UpdateSparePartItemByCenter",
  async ({ token, id, data }, { rejectWithValue }) => {
    try {
      const list = await SparePartItemsApi.updateSparePartItem({
        token: token,
        id: id,
        data: data,
      });
      console.log(list);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);

export const ChangeStatusSparePartItemCostByCenter = createAsyncThunk(
  "sparepartitemCost/ChangeStatusSparePartItemCostByCenter",
  async ({ token, id, status }, { rejectWithValue }) => {
    try {
      const list = await CostItemApi.changestatusCostSpartPartItem({
        token: token,
        id: id,
        status: status,
      });
      console.log(list);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);

export const GetByIdSparePartActiveCost = createAsyncThunk(
  "sparepartitemCost/GetByIdSparePartActiveCost",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const list = await CostItemApi.getByIdSparePartActiveCost(token, id);
      console.log(list);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const AddSparePartItemCost = createAsyncThunk(
  "sparepartitemCost/AddSparePartItemCost",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const list = await CostItemApi.postSparePartItemCost({
        token,
        data: data,
      });
      console.log(list);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const GetListByDifSparePartAndInforId = createAsyncThunk(
  "sparepartitemCost/GetListByDifSparePartAndInforId",
  async ({ token, centerId, inforId }, { rejectWithValue }) => {
    try {
      console.log("centerId", centerId );
      console.log("inforId", inforId );

      const list = await CostItemApi.GetListByDifSparePartAndInforId({
        token,
        centerId,
        inforId,
      });
      console.log(
        "sparepartitemCost/GetListByDifSparePartAndInforId",
        list.data
      );
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
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
        state.sparepartitem = null;
        state.sparepartitems = [];
        state.sparepartitemscost = null;
        state.sparepartitemscosts = [];
      })
      .addCase(SparePartItemsAll.fulfilled, (state, action) => {
        state.statussparepartitem = "succeeded";
        state.sparepartitems = action.payload;
      })
      .addCase(SparePartItemsAll.rejected, (state, action) => {
        state.statussparepartitem = "failed";
        state.errorsparepartitem = action.payload;
      })
      .addCase(SparePartItemsByCenterId.pending, (state) => {
        state.statussparepartitem = "loading";
        state.sparepartitem = null;
        state.sparepartitems = [];
        state.sparepartitemscost = null;
        state.sparepartitemscosts = [];
        state.errorsparepartitem = null;
      })
      .addCase(SparePartItemsByCenterId.fulfilled, (state, action) => {
        state.statussparepartitem = "succeeded";
        state.sparepartitems = action.payload;
        console.log("payload", state.sparepartitems);
      })
      .addCase(SparePartItemsByCenterId.rejected, (state, action) => {
        state.statussparepartitem = "failed";
        state.errorsparepartitem = action.payload;
      })

      .addCase(AddSparePartItemsByCenter.pending, (state) => {
        state.statussparepartitem = "loading";
        state.sparepartitem = null;
        state.sparepartitems = [];
        state.sparepartitemscost = null;
        state.sparepartitemscosts = [];
        state.errorsparepartitem = null;
      })
      .addCase(AddSparePartItemsByCenter.fulfilled, (state, action) => {
        state.statussparepartitem = "succeeded";
        state.sparepartitems = action.payload;
        console.log("payload", state.sparepartitems);
      })
      .addCase(AddSparePartItemsByCenter.rejected, (state, action) => {
        state.statussparepartitem = "failed";
        state.errorsparepartitem = action.payload;
      })
      .addCase(UpdateSparePartItemByCenter.pending, (state) => {
        state.statussparepartitem = "loading";
        state.sparepartitem = null;
        state.sparepartitems = [];
        state.sparepartitemscost = null;
        state.sparepartitemscosts = [];
        state.errorsparepartitem = null;
      })
      .addCase(UpdateSparePartItemByCenter.fulfilled, (state, action) => {
        state.statussparepartitem = "succeeded";
        state.sparepartitem = action.payload;
        console.log("payload", state.sparepartitem);
      })
      .addCase(UpdateSparePartItemByCenter.rejected, (state, action) => {
        state.statussparepartitem = "failed";
        state.errorsparepartitem = action.payload;
      })
      .addCase(GetByIdSparePartActiveCost.pending, (state) => {
        state.statussparepartitem = "loading";
        state.sparepartitem = null;
        state.sparepartitems = [];
        state.sparepartitemscost = null;
        state.sparepartitemscosts = [];
        state.errorsparepartitem = null;
      })
      .addCase(GetByIdSparePartActiveCost.fulfilled, (state, action) => {
        state.statussparepartitem = "succeeded";
        state.sparepartitemscost = action.payload;
        console.log("payload", state.sparepartitemscost);
      })
      .addCase(GetByIdSparePartActiveCost.rejected, (state, action) => {
        state.statussparepartitem = "failed";
        state.errorsparepartitem = action.payload;
      })
      .addCase(SparePartItemById.pending, (state) => {
        state.statussparepartitem = "loading";
        state.sparepartitem = null;
        state.sparepartitems = [];
        state.sparepartitemscost = null;
        state.sparepartitemscosts = [];
        state.errorsparepartitem = null;
      })
      .addCase(SparePartItemById.fulfilled, (state, action) => {
        state.statussparepartitem = "succeeded";
        state.sparepartitem = action.payload;
        // console.log("payload", state.sparepartitem);
      })
      .addCase(SparePartItemById.rejected, (state, action) => {
        state.statussparepartitem = "failed";
        state.errorsparepartitem = action.payload;
      })
      .addCase(GetListByDifSparePartAndInforId.pending, (state) => {
        state.statussparepartitem = "loading";
        state.sparepartitem = null;
        state.sparepartitems = [];
        state.sparepartitemscost = null;
        state.sparepartitemscosts = [];
        state.errorsparepartitem = null;
      })
      .addCase(GetListByDifSparePartAndInforId.fulfilled, (state, action) => {
        state.statussparepartitem = "succeeded";
        state.sparepartitemscosts = action.payload;
        // console.log("payload", state.sparepartitem);
      })
      .addCase(GetListByDifSparePartAndInforId.rejected, (state, action) => {
        state.statussparepartitem = "failed";
        state.errorsparepartitem = action.payload;
      });
  },
});
export const { GetAll, GetListByCenter } = sparepartitemsSlice.actions;

export default sparepartitemsSlice.reducer;
