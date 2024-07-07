import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import BookingApi from "../components/Axios/BookingApi";

const initialState = {
  bookings: [],
  status: "idle",
  error: null,
  booking: null,
};
export const BookingAll = createAsyncThunk("booking/GetAll", async (token) => {
  try {
    const list = await BookingApi.getAll(token);
    return list;
  } catch (error) {
    throw new Error(error.Messages);
  }
});
export const BookingById = createAsyncThunk(
  "booking/GetById",
  async ({ token, id }) => {
    try {
      const list = await BookingApi.getById(token, id);
      return list.data;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);
export const BookingByCenter = createAsyncThunk(
  "booking/GetListByCenter",
  async (token) => {
    try {
      const list = await BookingApi.getListByCenter(token);
      console.log(list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
const bookingSlice = createSlice({
  name: "booking",
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
      .addCase(BookingAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(BookingAll.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings = action.payload;
      })
      .addCase(BookingAll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(BookingById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.booking = action.payload;
      })
      .addCase(BookingById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(BookingByCenter.pending, (state) => {
        state.status = "loading";
      })
      .addCase(BookingByCenter.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings = action.payload;
        console.log("payload", state.bookings);
      })
      .addCase(BookingByCenter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const { GetAll } = bookingSlice.actions;

export default bookingSlice.reducer;
