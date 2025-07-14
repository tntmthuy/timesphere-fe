// src\features\team\commentSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { TaskCommentDTO } from "./comment";

export const fetchTaskComments = createAsyncThunk(
  "comments/fetchTaskComments",
  async ({ taskId, token }: { taskId: string; token: string }) => {
    const res = await axios.get(`/api/comment/task/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data as TaskCommentDTO[];
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    byTask: {} as Record<string, TaskCommentDTO[]>,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTaskComments.fulfilled, (state, action) => {
      const taskId = action.meta.arg.taskId;
      state.byTask[taskId] = action.payload;
    });
  },
});

export default commentSlice.reducer;