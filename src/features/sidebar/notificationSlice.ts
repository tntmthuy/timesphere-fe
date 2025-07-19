import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../state/store";

export type Notification = {
  id: string;
  title: string;
  content: string;
  targetUrl: string;
  type: string;
  senderName: string;
  senderAvatar: string;
  timeAgo: string;
  createdAt: string; // ISO date string
  read: boolean;
  referenceId: string; // ID của team hoặc task liên quan
  inviteStatus?: "PENDING" | "ACCEPTED" | "DECLINED";
};

type NotificationState = {
  list: Notification[];
  loading: boolean;
};

const initialState: NotificationState = {
  list: [],
  loading: false,
};

export const fetchNotificationsThunk = createAsyncThunk<
  Notification[],
  void,
  { state: RootState }
>("notification/fetch", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  try {
    const res = await axios.get("/api/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = Array.isArray(res.data.data) ? res.data.data : [];
    return data;
  } catch {
    return rejectWithValue("FAILED_TO_FETCH_NOTIFICATIONS");
  }
});

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNotificationsThunk.rejected, (state) => {
        state.loading = false;
        state.list = [];
      });
  },
});

export default notificationSlice.reducer;