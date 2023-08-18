import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthenApi from "../components/Axios/AuthenApi";

// Tạo action bất đồng bộ để xử lý đăng nhập
export const loginAsync = createAsyncThunk("auth/login", async (formData) => {
  try {
    const response = await AuthenApi.Login(formData);
    return response.data; // Assuming the token is in response.data.token
  } catch (error) {
    throw new Error(error.payload);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.token = action.payload;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.token = null;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
