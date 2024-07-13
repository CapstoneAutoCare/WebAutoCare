import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TaskApi from "../components/Axios/TaskApi";

const initialState = {
  tasks: [],
  statustasks: "idle",
  errortasks: null,
  task: null,
};

export const TasksAll = createAsyncThunk(
  "tasks/GetAll",
  async () => {
    try {
      const list = await TaskApi.getAll();
      console.log("sparepart/GetAll", list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);
export const TasksByCenter = createAsyncThunk(
    "tasks/TasksByCenter",
    async (token) => {
      try {
        const list = await TaskApi.GetListByCenter(token);
        console.log("tasks/GetListByCenter", list);
        return list;
      } catch (error) {
        throw new Error(error.Messages);
      }
    }
  );
//   "sparepartitem/GetListByCenter",
//   async (centerId, token) => {
//     try {
//       const list = await SparePartItemsApi.getListByCenter(centerId, token);
//       console.log(list.data);
//       return list.data;
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   }
// );
// export const AddSparePartItemsByCenter = createAsyncThunk(
//   "sparepartitem/AddSparePartItemsByCenter",
//   async ({token, data}) => {
//     try {
//       const list = await SparePartItemsApi.addSpartPartItem(token, data);
//       console.log(list);
//       return list;
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   }
// );
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(TasksAll.pending, (state) => {
        state.statustasks = "loading";
      })
      .addCase(TasksAll.fulfilled, (state, action) => {
        state.statustasks = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(TasksAll.rejected, (state, action) => {
        state.statustasks = "failed";
        state.error = action.error.message;
      })
      .addCase(TasksByCenter.pending, (state) => {
        state.statustasks = "loading";
      })
      .addCase(TasksByCenter.fulfilled, (state, action) => {
        state.statustasks = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(TasksByCenter.rejected, (state, action) => {
        state.statustasks = "failed";
        state.error = action.error.message;
      })
      ;
    //   .addCase(SparePartItemsByCenterId.pending, (state) => {
    //     state.status = "loading";
    //   })
    //   .addCase(SparePartItemsByCenterId.fulfilled, (state, action) => {
    //     state.status = "succeeded";
    //     state.sparepartitems = action.payload;
    //     console.log("payload", state.sparepartitems);
    //   })
    //   .addCase(SparePartItemsByCenterId.rejected, (state, action) => {
    //     state.status = "failed";
    //     state.error = action.error.message;
    //   })

    //   .addCase(AddSparePartItemsByCenter.pending, (state) => {
    //     state.status = "loading";
    //   })
    //   .addCase(AddSparePartItemsByCenter.fulfilled, (state, action) => {
    //     state.status = "succeeded";
    //     state.sparepartitems = action.payload;
    //     console.log("payload", state.sparepartitems);
    //   })
    //   .addCase(AddSparePartItemsByCenter.rejected, (state, action) => {
    //     state.status = "failed";
    //     state.error = action.error.message;
    //   })
  },
});
export const {} = tasksSlice.actions;

export default tasksSlice.reducer;
