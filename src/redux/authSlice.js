import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthenApi from "../components/Axios/AuthenApi";
import AccountApi from "../components/Axios/AccountApi";

export const loginAsync = createAsyncThunk("auth/login", async (formData) => {
  try {
    const response = await AuthenApi.Login(formData);
    return response;
  } catch (error) {
    throw new Error(error.Messages);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.login = null;
      state.error = null;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.login = action.payload;
        state.error = null;
        state.status = "succeeded";
        localStorage.setItem("localtoken", state.login.token);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.login = null;
        state.error = action;
        state.status = "failed";

      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

export const CheckRole = async (token, role) => {
  // console.log("Checking role", token, role);
  var account = await AccountApi.getProfile(token);
  console.log(account.data);
  if (role === "CENTER") {
    localStorage.setItem("CenterId", account.data.MaintenanceCenterId);
  }
  if (role === "ADMIN") {
    localStorage.setItem("ADMINID", account.data.adminId);
  }
};
