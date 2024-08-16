import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import OdoHistoryApi from "../components/Axios/OdoHistoryApi";

const initialState = {
    odohisotries: [],
    statusodohisotries: "idle",
    errorsodohisotries: null,
    odohistory: null,
};

export const OdoHistoriesById = createAsyncThunk(
    "odohistories/OdoHistoriesById",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const list = await OdoHistoryApi.getById({ token, id });
            console.log("odohistories/OdoHistoriesById", list.data);
            return list.data;
        } catch (error) {
            return rejectWithValue(error.response.data.Exception);
        }
    }
);
export const OdoHistoriesByInforId = createAsyncThunk(
    "odohistories/OdoHistoriesByInforId",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const list = await OdoHistoryApi.getByinforId({ token, id });
            console.log("odohistories/OdoHistoriesByInforId", list.data);
            return list.data;
        } catch (error) {
            return rejectWithValue(error.response.data.Exception);
        }
    }
);
export const CreateOdoHisotryPost = createAsyncThunk(
    "odohistories/CreateOdoHisotryPost",
    async ({ token, data }, { rejectWithValue }) => {
        try {
            const list = await OdoHistoryApi.post({ token, data });
            console.log("odohistories/CreateOdoHisotryPost", list.data);
            return list.data;
        } catch (error) {
            return rejectWithValue(error.response.data.Exception);
        }
    }
);
const scheduleSlice = createSlice({
    name: "odohistories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(CreateOdoHisotryPost.pending, (state) => {
                state.statusodohisotries = "loading";
                state.odohistory = null;
                state.errorsodohisotries = null;
                state.odohisotries = [];
            })
            .addCase(CreateOdoHisotryPost.fulfilled, (state, action) => {
                state.statusodohisotries = "succeeded";
                state.odohistory = action.payload;
            })
            .addCase(CreateOdoHisotryPost.rejected, (state, action) => {
                state.statusodohisotries = "failed";
                state.errorsodohisotries = action.payload;
            })
            .addCase(OdoHistoriesById.pending, (state) => {
                state.statusodohisotries = "loading";
                state.odohistory = null;
                state.errorsodohisotries = null;
                state.odohisotries = [];
            })
            .addCase(OdoHistoriesById.fulfilled, (state, action) => {
                state.statusodohisotries = "succeeded";
                state.odohistory = action.payload;
            })
            .addCase(OdoHistoriesById.rejected, (state, action) => {
                state.statusodohisotries = "failed";
                state.errorsodohisotries = action.payload;
            }).addCase(OdoHistoriesByInforId.pending, (state) => {
                state.statusodohisotries = "loading";
                state.odohistory = null;
                state.errorsodohisotries = null;
                state.odohisotries = [];
            })
            .addCase(OdoHistoriesByInforId.fulfilled, (state, action) => {
                state.statusodohisotries = "succeeded";
                state.odohistory = action.payload;
            })
            .addCase(OdoHistoriesByInforId.rejected, (state, action) => {
                state.statusodohisotries = "failed";
                state.errorsodohisotries = action.payload;
            });

    },
});
export const { } = scheduleSlice.actions;

export default scheduleSlice.reducer;
