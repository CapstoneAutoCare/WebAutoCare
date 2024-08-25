import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthenApi from "../components/Axios/AuthenApi";
import AccountApi from "../components/Axios/AccountApi";
import { useNavigate } from "react-router-dom";
import { VehiclesMaintenancesByCenter } from "./vehiclemainSlice";
import { useDispatch } from "react-redux";

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await AuthenApi.Authen(formData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.Exception);
    }
  }
);
const initialState = {
  status: "idle",
  login: null,
  error: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
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
        state.login = action.payload;
        state.error = action.payload;
        state.status = "failed";
        alert(action.payload);
      });
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
  if (role === "CUSTOMERCARE") {
    localStorage.setItem("CUSTOMERCAREID", account.data.CustomerCareId);
    localStorage.setItem("CenterId", account.data.CentreId);

  }
};
