import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CustomerCareApi from "../components/Axios/CustomerCareApi";

const initialState = {
  customercares: [],
  status: "idle",
  errorcustomercare: null,
  customercare: null,
};
export const CustomerCareAll = createAsyncThunk(
  "customercare/GetAll",
  async (token) => {
    try {
      const list = await CustomerCareApi.getAll(token);
      return list.data;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);
export const CustomerCareByCenterId = createAsyncThunk(
  "customercare/GetListByCenter",
  async (centerId, token) => {
    try {
      const list = await CustomerCareApi.getListByCenter(centerId, token);
      console.log(list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
export const CreateCustomerCarePost = createAsyncThunk(
  "centers/CreateCustomerCarePost",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const list = await CustomerCareApi.CreateCustomerCare({ token, data });
      console.log("centers/CreateCustomerCarePost", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
const customercareSlice = createSlice({
  name: "customercare",
  initialState,
  reducers: {
    GetAll: (state, action) => {
      state.customercares = action.payload;
      state.error = null;
    },
    // GetListByCenter: (state, { action }) => {
    //   state.customercares = action.payload;
    //   state.error = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CustomerCareAll.pending, (state) => {
        state.status = "loading";
        state.customercares = [];
        state.errorcustomercare = null;
        state.customercare = null;
      })
      .addCase(CustomerCareAll.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customercares = action.payload;
      })
      .addCase(CustomerCareAll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(CustomerCareByCenterId.pending, (state) => {
        state.status = "loading";
        state.customercares = [];
        state.errorcustomercare = null;
        state.customercare = null;
      })
      .addCase(CustomerCareByCenterId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customercares = action.payload;
        console.log("payload", state.customercares);
      })
      .addCase(CustomerCareByCenterId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(CreateCustomerCarePost.pending, (state) => {
        state.status = "loading";
        state.customercares = [];
        state.errorcustomercare = null;
        state.customercare = null;
      })
      .addCase(CreateCustomerCarePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customercare = action.payload;
        console.log("payload", state.customercares);
      })
      .addCase(CreateCustomerCarePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        alert(action.payload);
      });
  },
});
export const { GetAll } = customercareSlice.actions;

export default customercareSlice.reducer;
