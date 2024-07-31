import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ReceiptApi from "../components/Axios/ReceiptApi";

const initialState = {
  receipts: [],
  statusreceipt: "idle",
  errorreceipt: null,
  receipt: null,
};

export const ReceiptById = createAsyncThunk(
  "receipt/ReceiptById",
  async ({ token, id }) => {
    try {
      const list = await ReceiptApi.getbyId({ token, id });
      console.log("receipt/ReceiptById", list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const ReceiptByInforId = createAsyncThunk(
  "receipt/ReceiptByInforId",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const list = await ReceiptApi.getbyInforId({ token, id });
      console.log("receipt/ReceiptByInforId", list.data);
      return list.data;
    } catch (error) {
      console.log("error2", error.response.data.Exception);
      return rejectWithValue(error.response.data.Exception);
    }
  }
);

export const CreateReceipt = createAsyncThunk(
  "receipt/CreateReceipt",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const list = await ReceiptApi.CreateReceiptPost({
        token: token,
        data: data,
      });
      console.log("receipt/CreateReceipt", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const ReceiptRemove = createAsyncThunk(
  "receipt/ReceiptRemove",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const list = await ReceiptApi.ReceiptRemove({
        token: token,
        id: id,
      });
      console.log("receipt/ReceiptRemove", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const ReceiptChangeStatus = createAsyncThunk(
  "receipt/ReceiptChangeStatus",
  async ({ token, id, status }, { rejectWithValue }) => {
    try {
      const list = await ReceiptApi.ChangeStatusReceipt({
        token: token,
        id,
        status,
      });
      console.log("receipt/ReceiptChangeStatus", list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);

const receiptSlice = createSlice({
  name: "receipt",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ReceiptById.pending, (state) => {
        state.statusreceipt = "loading";
        state.errorreceipt = "";
        state.receipt = null;
        state.receipts = [];
      })
      .addCase(ReceiptById.fulfilled, (state, action) => {
        state.statusreceipt = "succeeded";
        state.receipt = action.payload;
      })
      .addCase(ReceiptById.rejected, (state, action) => {
        state.statusreceipt = "failed";
        state.errorreceipt = action.error.message;
      })
      .addCase(CreateReceipt.pending, (state) => {
        state.statusreceipt = "loading";
        state.errorreceipt = null;
        state.receipt = null;
        state.receipts = [];
      })
      .addCase(CreateReceipt.fulfilled, (state, action) => {
        state.statusreceipt = "succeeded";
        state.receipt = action.payload;
        console.log("payload", state.receipt);
      })
      .addCase(CreateReceipt.rejected, (state, action) => {
        state.statusreceipt = "failed";
        state.errorreceipt = action.error.message;
      })
      .addCase(ReceiptByInforId.pending, (state) => {
        state.statusreceipt = "loading";
        state.errorreceipt = null;
        state.receipt = null;
        state.receipts = [];
      })
      .addCase(ReceiptByInforId.fulfilled, (state, action) => {
        state.statusreceipt = "succeeded";
        state.receipt = action.payload;
        console.log("payload", state.receipt);
      })
      .addCase(ReceiptByInforId.rejected, (state, action) => {
        state.statusreceipt = "failed";
        state.errorreceipt = action.payload;
      })
      .addCase(ReceiptRemove.pending, (state) => {
        state.statusreceipt = "loading";
        state.errorreceipt = null;
        state.receipt = null;
        state.receipts = [];
      })
      .addCase(ReceiptRemove.fulfilled, (state, action) => {
        state.statusreceipt = "succeeded";
        state.receipt = action.payload;
        console.log("payload", state.receipt);
      })
      .addCase(ReceiptRemove.rejected, (state, action) => {
        state.statusreceipt = "failed";
        state.errorreceipt = action.payload;
      })
      .addCase(ReceiptChangeStatus.pending, (state) => {
        state.statusreceipt = "loading";
        state.errorreceipt = null;
        state.receipt = null;
        state.receipts = [];
      })
      .addCase(ReceiptChangeStatus.fulfilled, (state, action) => {
        state.statusreceipt = "succeeded";
        state.receipt = action.payload;
        console.log("payload", state.receipt);
      })
      .addCase(ReceiptChangeStatus.rejected, (state, action) => {
        state.statusreceipt = "failed";
        state.errorreceipt = action.payload;
      });
  },
});

export const {} = receiptSlice.actions;

export default receiptSlice.reducer;
