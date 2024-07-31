import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BookingApi from "../components/Axios/BookingApi";

const initialState = {
  bookings: [],
  statusbooking: "idle",
  errorbooking: null,
  booking: null,
};
export const BookingAll = createAsyncThunk(
  "booking/GetAll",
  async ({ token }, { rejectWithValue }) => {
    try {
      const list = await BookingApi.getAll({ token });
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const BookingById = createAsyncThunk(
  "booking/GetById",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const list = await BookingApi.getById({ token, id });
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const BookingByCenter = createAsyncThunk(
  "booking/GetListByCenter",
  async ({ token }, { rejectWithValue }) => {
    try {
      const list = await BookingApi.getListByCenter({ token });
      console.log(list.data);
      return list.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
export const PatchStatusBookingByCenter = createAsyncThunk(
  "booking/PatchStatusBookingCenter",
  async ({ bookingId, status, token }, { rejectWithValue }) => {
    try {
      const response = await BookingApi.patchStatus({
        bookingId: bookingId,
        status: status,
        token: token,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log("ERROr", error);
      return rejectWithValue(error.response.data.Exception);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    // GetAll: (state, action) => {
    //   state.maintenanceservices = action.payload;
    //   state.errorbooking = null;
    // },
    // GetListByCenter: (state, { action }) => {
    //   state.MaintenanceServices = action.payload;
    //   state.errorbooking = null;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(BookingAll.pending, (state) => {
        state.statusbooking = "loading";
        state.bookings = [];
        state.booking = null;
        state.errorbooking = null;
      })
      .addCase(BookingAll.fulfilled, (state, action) => {
        state.statusbooking = "succeeded";
        state.bookings = action.payload;
      })
      .addCase(BookingAll.rejected, (state, action) => {
        state.statusbooking = "failed";
        state.errorbooking = action.payload;
        alert(action.payload);

      })
      .addCase(BookingById.pending, (state) => {
        state.statusbooking = "loading";
        state.bookings = [];
        state.booking = null;
        state.errorbooking = null;
      })
      .addCase(BookingById.fulfilled, (state, action) => {
        state.statusbooking = "succeeded";
        state.booking = action.payload;
      })
      .addCase(BookingById.rejected, (state, action) => {
        state.statusbooking = "failed";
        state.errorbooking = action.payload;
        alert(action.payload);

      })
      .addCase(BookingByCenter.pending, (state) => {
        state.statusbooking = "loading";
        state.bookings = [];
        state.booking = null;
        state.errorbooking = null;
      })
      .addCase(BookingByCenter.fulfilled, (state, action) => {
        state.statusbooking = "succeeded";
        state.bookings = action.payload;
        console.log("payload", state.bookings);
      })
      .addCase(BookingByCenter.rejected, (state, action) => {
        state.statusbooking = "failed";
        state.errorbooking = action.payload;
        alert(action.payload);

      })
      .addCase(PatchStatusBookingByCenter.pending, (state) => {
        state.statusbooking = "loading";
        state.bookings = [];
        state.booking = null;
        state.errorbooking = null;
      })
      .addCase(PatchStatusBookingByCenter.fulfilled, (state, action) => {
        state.statusbooking = "succeeded";
        state.booking = action.payload;
        console.log("payload", state.booking);
      })
      .addCase(PatchStatusBookingByCenter.rejected, (state, action) => {
        state.statusbooking = "failed";
        state.errorbooking = action.payload;
        alert(action.payload);

      });
  },
});
export const { GetAll } = bookingSlice.actions;

export default bookingSlice.reducer;
