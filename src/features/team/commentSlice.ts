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

import { createSelector } from "@reduxjs/toolkit";

export const makeSelectCommentsByTask = (taskId: string) =>
  createSelector(
    [(state) => state.comments.byTask],
    (byTask) => byTask[taskId] ?? []
  );

//comment of task
export const fetchTaskComments = createAsyncThunk(
  "comments/fetchTaskComments",
  async ({ taskId, token }: { taskId: string; token: string }) => {
    const res = await axios.get(`/api/comment/task/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data as TaskCommentDTO[];
  }
);

//create comment
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

//xóa
export const deleteCommentThunk = createAsyncThunk(
  "comments/deleteComment",
  async (
    { commentId, taskId, token }: { commentId: string; taskId: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.delete(`/api/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        commentId,
        taskId,
        updatedAttachments: res.data.attachments, // 👈 nếu BE trả lại file mới
      };
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Không thể xoá bình luận";
      return rejectWithValue(message);
    }
  }
);

//lấy file nguyên team
export const fetchTeamAttachments = createAsyncThunk(
  "comments/fetchTeamAttachments",
  async ({ teamId, token }: { teamId: string; token: string }) => {
    const res = await axios.get(`/api/teams/${teamId}/attachments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as AttachedFileDTO[];
  }
);

//Slice
const commentSlice = createSlice({
  name: "comments",
  initialState: {
    byTask: {} as Record<string, TaskCommentDTO[]>,
    attachments: [] as AttachedFileDTO[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTaskComments.fulfilled, (state, action) => {
      // console.log("📦 Fetched comments:", action.payload);
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
    builder.addCase(deleteCommentThunk.fulfilled, (state, action) => {
      const { commentId, taskId, updatedAttachments } = action.payload;
      if (state.byTask[taskId]) {
        state.byTask[taskId] = state.byTask[taskId].filter((c) => c.id !== commentId);
      }
      state.attachments = updatedAttachments; // 👈 cập nhật file luôn
    });
    builder.addCase(fetchTeamAttachments.fulfilled, (state, action) => {
      // Gợi ý: lưu vào state mới tên là `attachments`
      state.attachments = action.payload;
    });
  },
});

export default commentSlice.reducer;