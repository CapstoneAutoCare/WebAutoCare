import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TaskApi from "../components/Axios/TaskApi";

const initialState = {
  tasks: [],
  statustasks: "idle",
  errortasks: null,
  task: null,
};

export const TasksAll = createAsyncThunk("tasks/GetAll", async () => {
  try {
    const list = await TaskApi.getAll();
    console.log("sparepart/GetAll", list.data);
    return list.data;
  } catch (error) {
    throw new Error(error.Messages);
  }
});
export const TasksByCenter = createAsyncThunk(
  "tasks/TasksByCenter",
  async (token) => {
    try {
      const list = await TaskApi.GetListByCenter(token);
      console.log("tasks/GetListByCenter", list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);
export const TaskGetById = createAsyncThunk(
  "tasks/TaskGetById",
  async ({ token, id }) => {
    try {
      const list = await TaskApi.GetById({ token, id });
      console.log("tasks/GetById", list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);
export const TaskListGetByInforId = createAsyncThunk(
  "tasks/TaskListGetByInforId",
  async ({ token, id }) => {
    try {
      const list = await TaskApi.GetListByInforId({ token, id });
      console.log("tasks/TaskListGetByInforId", list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);

export const TaskPatchStatus = createAsyncThunk(
  "tasks/TaskPatchStatus",
  async ({ token, id, status }) => {
    try {
      const list = await TaskApi.Patch({ token, id, status });
      console.log("tasks/TaskPatchStatus", list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.Messages);
    }
  }
);
export const AddTaskByCenter = createAsyncThunk(
  "tasks/AddTaskByCenter",
  async ({ token, data }) => {
    try {
      const list = await TaskApi.PostTask({ token, data });
      console.log("tasks/AddTaskByCenter", list.data);
      return list.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(TasksAll.pending, (state) => {
        state.statustasks = "loading";
        state.task=null;
        state.tasks=[];
        state.errortasks=null;
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
        state.task=null;
        state.tasks=[];
        state.errortasks=null;
      })
      .addCase(TasksByCenter.fulfilled, (state, action) => {
        state.statustasks = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(TasksByCenter.rejected, (state, action) => {
        state.statustasks = "failed";
        state.error = action.error.message;
      })
      .addCase(AddTaskByCenter.pending, (state) => {
        state.statustasks = "loading";
        state.task=null;
        state.tasks=[];
        state.errortasks=null;
      })
      .addCase(AddTaskByCenter.fulfilled, (state, action) => {
        state.statustasks = "succeeded";
        state.task = action.payload;
      })
      .addCase(AddTaskByCenter.rejected, (state, action) => {
        state.statustasks = "failed";
        state.error = action.error.message;
      })
      .addCase(TaskPatchStatus.pending, (state) => {
        state.statustasks = "loading";
        state.task=null;
        state.tasks=[];
        state.errortasks=null;
      })
      .addCase(TaskPatchStatus.fulfilled, (state, action) => {
        state.statustasks = "succeeded";
        state.task = action.payload;
      })
      .addCase(TaskPatchStatus.rejected, (state, action) => {
        state.statustasks = "failed";
        state.error = action.error.message;
      })
      .addCase(TaskGetById.pending, (state) => {
        state.statustasks = "loading";
        state.task=null;
        state.tasks=[];
        state.errortasks=null;
      })
      .addCase(TaskGetById.fulfilled, (state, action) => {
        state.statustasks = "succeeded";
        state.task = action.payload;
      })
      .addCase(TaskGetById.rejected, (state, action) => {
        state.statustasks = "failed";
        state.error = action.error.message;
      })
      .addCase(TaskListGetByInforId.pending, (state) => {
        state.statustasks = "loading";
        state.task=null;
        state.tasks=[];
        state.errortasks=null;
      })
      .addCase(TaskListGetByInforId.fulfilled, (state, action) => {
        state.statustasks = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(TaskListGetByInforId.rejected, (state, action) => {
        state.statustasks = "failed";
        state.error = action.error.message;
      });;
  },
});
export const {} = tasksSlice.actions;

export default tasksSlice.reducer;
