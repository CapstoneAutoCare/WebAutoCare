import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AccountApi from "../components/Axios/AccountApi";

const initialState = {
  profile: null,
  status: "idle",
  error: null,
};
export const Profile = createAsyncThunk(
  "account/profile",
  async (token, role) => {
    try {
      const profile = await AccountApi.getProfile(token);
      return profile;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);

const profileSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Profile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(Profile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
      })
      .addCase(Profile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const {} = profileSlice.actions;

export default profileSlice.reducer;
