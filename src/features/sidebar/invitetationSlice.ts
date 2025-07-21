// src/features/sidebar/invitetationSlice.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios"; // ✅ dùng axios có interceptor
import type { RootState } from "../../state/store";

export const acceptInvitationThunk = createAsyncThunk<
  string, // response message
  string, // teamId
  { state: RootState }
>("invitation/accept", async (teamId, { rejectWithValue }) => {
  try {
    const res = await api.post(`/api/invitations/${teamId}/accept`);
    return res.data.message;
  } catch {
    return rejectWithValue("FAILED_ACCEPT_INVITE");
  }
});

export const declineInvitationThunk = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("invitation/decline", async (teamId, { rejectWithValue }) => {
  try {
    const res = await api.post(`/api/invitations/${teamId}/decline`);
    return res.data.message;
  } catch {
    return rejectWithValue("FAILED_DECLINE_INVITE");
  }
});