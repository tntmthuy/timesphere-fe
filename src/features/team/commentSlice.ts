//src\features\team\commentSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { AttachedFileDTO, TaskCommentDTO } from "./comment";

type CreateCommentPayload = {
  taskId: string;
  content: string;
  visibility?: "PUBLIC" | "PRIVATE";
  visibleToUserIds?: string[];
  attachments?: AttachedFileDTO[];
  token: string;
};

export const fetchTaskComments = createAsyncThunk(
  "comments/fetchTaskComments",
  async ({ taskId, token }: { taskId: string; token: string }) => {
    const res = await axios.get(`/api/comment/task/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data as TaskCommentDTO[];
  }
);

export const createCommentThunk = createAsyncThunk(
  "comments/createComment",
  async (
    payload: CreateCommentPayload,
    { rejectWithValue }
  ) => {
    const {
      taskId,
      content,
      visibility = "PUBLIC",
      visibleToUserIds = [],
      attachments = [],
      token,
    } = payload;

    try {
      const res = await axios.post(
        "/api/comment/task",
        { taskId, content, visibility, visibleToUserIds, attachments },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data.data as TaskCommentDTO;
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Không thể gửi bình luận";

      return rejectWithValue(message);
    }
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
    builder.addCase(createCommentThunk.fulfilled, (state, action) => {
      const newComment = action.payload;
      const taskId = action.meta.arg.taskId;

      if (!state.byTask[taskId]) {
        state.byTask[taskId] = [];
      }

      state.byTask[taskId].unshift(newComment);
    });
  },
});

export default commentSlice.reducer;