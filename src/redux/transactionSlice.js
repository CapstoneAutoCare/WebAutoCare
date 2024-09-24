import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ScheduleApi from "../components/Axios/ScheduleApi";
import PlanApi from "../components/Axios/PlanApi";
import TransactionsApi from "../components/Axios/TransactionsApi";

const initialState = {
    transactions: [],
    statustransactions: "idle",
    errortransactions: null,
    transaction: null,
};

export const TransactionListGetall = createAsyncThunk(
    "transactions/PlanListGetall",
    async (token, { rejectWithValue }) => {
        try {
            const list = await TransactionsApi.getAll(token);
            console.log("plans/PlanListGetall", list.data);
            return list.data;
        } catch (error) {
            return rejectWithValue(error.response.data.Exception);
        }
    }
);
export const TransactionGetListByClientRECEIVED = createAsyncThunk(
    "transactions/TransactionGetListByClientRECEIVED",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const list = await TransactionsApi.getListByClientRECEIVED({ token, id });
            console.log("transactions/TransactionGetListByClientRECEIVED", list.data);
            return list.data;
        } catch (error) {
            return rejectWithValue(error.response.data.Exception);
        }
    }
);
export const TransactionGetListByCenterAndStatusTransferred = createAsyncThunk(
    "transactions/TransactionGetListByCenterAndStatusTransferred",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const list = await TransactionsApi.getListByCenterAndStatusTransferred({ token, id });
            console.log("transactions/TransactionGetListByCenterAndStatusTransferred", list.data);
            return list.data;
        } catch (error) {
            return rejectWithValue(error.response.data.Exception);
        }
    }
);

export const TransactionGetListByCenteId = createAsyncThunk(
    "transactions/TransactionGetListByCenteId",
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const list = await TransactionsApi.getListByCenteId({ token, id });
            console.log("transactions/TransactionGetListByCenteId", list.data);
            return list.data;
        } catch (error) {
            return rejectWithValue(error.response.data.Exception);
        }
    }
);

// export const CreatePlanPost = createAsyncThunk(
//   "transactions/CreatePlanPost",
//   async ({ token, data }, { rejectWithValue }) => {
//     try {
//       const list = await PlanApi.createpost({ token, data });
//       console.log("plans/CreatePlanPost", list.data);
//       return list.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data.Exception);
//     }
//   }
// );
const transactionSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(TransactionListGetall.pending, (state) => {
                state.statustransactions = "loading";
                state.transaction = null;
                state.errortransactions = null;
                state.transactions = [];
            })
            .addCase(TransactionListGetall.fulfilled, (state, action) => {
                state.statustransactions = "succeeded";
                state.transactions = action.payload;
            })
            .addCase(TransactionListGetall.rejected, (state, action) => {
                state.statustransactions = "failed";
                state.errortransactions = action.payload;
            })


            .addCase(TransactionGetListByClientRECEIVED.pending, (state) => {
                state.statustransactions = "loading";
                state.transaction = null;
                state.errortransactions = null;
                state.transactions = [];
            })
            .addCase(TransactionGetListByClientRECEIVED.fulfilled, (state, action) => {
                state.statustransactions = "succeeded";
                state.transactions = action.payload;
            })
            .addCase(TransactionGetListByClientRECEIVED.rejected, (state, action) => {
                state.statustransactions = "failed";
                state.errortransactions = action.payload;
            })
            
            
            .addCase(TransactionGetListByCenterAndStatusTransferred.pending, (state) => {
                state.statustransactions = "loading";
                state.transaction = null;
                state.errortransactions = null;
                state.transactions = [];
            })
            .addCase(TransactionGetListByCenterAndStatusTransferred.fulfilled, (state, action) => {
                state.statustransactions = "succeeded";
                state.transactions = action.payload;
            })
            .addCase(TransactionGetListByCenterAndStatusTransferred.rejected, (state, action) => {
                state.statustransactions = "failed";
                state.errortransactions = action.payload;
            })

            .addCase(TransactionGetListByCenteId.pending, (state) => {
                state.statustransactions = "loading";
                state.transaction = null;
                state.errortransactions = null;
                state.transactions = [];
            })
            .addCase(TransactionGetListByCenteId.fulfilled, (state, action) => {
                state.statustransactions = "succeeded";
                state.transactions = action.payload;
            })
            .addCase(TransactionGetListByCenteId.rejected, (state, action) => {
                state.statustransactions = "failed";
                state.errortransactions = action.payload;
            })
            ;
    },
});
export const { } = transactionSlice.actions;

export default transactionSlice.reducer;
