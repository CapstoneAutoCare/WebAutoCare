import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TechinicanApi from "../components/Axios/TechnicianApi";
import PaymentApi from "../components/Axios/PaymentApi";

const initialState = {
  payment:null,
  statuspayments: "idle",
  errorpayments: null,
};
export const PaymentCreateVnPayPaymentUrl = createAsyncThunk(
  "payments/CreateVnPayPaymentUrl",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const list = await PaymentApi.CreateVnPayPaymentUrl({
        token,
        data,
      });
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    ClearPaymentData: (state) => {
      state.payment = null;
      state.statuspayments = null;
      state.errorpayments = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(PaymentCreateVnPayPaymentUrl.pending, (state) => {
        state.statuspayments = "loading";
        state.payment = null;
        state.errorpayments = "";
      })
      .addCase(PaymentCreateVnPayPaymentUrl.fulfilled, (state, action) => {
        state.statuspayments = "succeeded";
        state.payment = action.payload;
      })
      .addCase(PaymentCreateVnPayPaymentUrl.rejected, (state, action) => {
        state.statuspayments = "failed";
        state.errorpayments = action.payload;
        alert(action.payload);
      });
  },
});
export const {ClearPaymentData} = paymentSlice.actions;

export default paymentSlice.reducer;
