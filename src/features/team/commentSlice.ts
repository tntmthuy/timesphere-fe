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

//gửi comment
export const createCommentThunk = createAsyncThunk(
  "comments/createComment",
  async (
    {
      taskId,
      content,
      visibility = "PUBLIC", // 👈 mặc định PUBLIC
      visibleToUserIds = [],
      attachments = [],
      token,
    }: {
      taskId: string;
      content: string;
      visibility?: "PUBLIC" | "PRIVATE";
      visibleToUserIds?: string[];
      attachments?: []; // nếu bạn có AttachmentDTO thì dùng type rõ hơn
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        "/api/comment/task",
        {
          taskId,
          content,
          visibility,
          visibleToUserIds,
          attachments,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data as TaskCommentDTO;
    } catch {
      return rejectWithValue("Không thể gửi bình luận");
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

      state.byTask[taskId].unshift(newComment); // ✅ thêm vào đầu mảng
    });
  },
});

export default commentSlice.reducer;