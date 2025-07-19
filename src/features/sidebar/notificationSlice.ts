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

//mark 1 
export const markNotificationAsRead = createAsyncThunk<
  string, // trả về ID sau khi xử lý
  string, // đầu vào là notificationId
  { state: RootState }
>("notification/markAsRead", async (notificationId, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  try {
    await axios.post(`/api/notifications/${notificationId}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return notificationId;
  } catch {
    return rejectWithValue("FAILED_TO_MARK_AS_READ");
  }
});

//delete
export const deleteNotificationThunk = createAsyncThunk<
  string, // trả về notificationId
  string, // đầu vào là notificationId
  { state: RootState }
>("notification/delete", async (notificationId, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  try {
    await axios.delete(`/api/notifications/${notificationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return notificationId;
  } catch {
    return rejectWithValue("FAILED_TO_DELETE_NOTIFICATION");
  }
});

//Slice
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
    builder.addCase(markNotificationAsRead.fulfilled, (state, action) => {
      const id = action.payload;
      const noti = state.list.find((n) => n.id === id);
      if (noti) {
        noti.read = true;
      }
    });
    builder.addCase(deleteNotificationThunk.fulfilled, (state, action) => {
      const id = action.payload;
      state.list = state.list.filter((n) => n.id !== id);
    });
  },
});

export default notificationSlice.reducer;