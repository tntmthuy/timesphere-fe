import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../state/store";

export const acceptInvitationThunk = createAsyncThunk<
  string, // response message
  string, // teamId
  { state: RootState }
>("invitation/accept", async (teamId, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  try {
    const res = await axios.post(`/api/invitations/${teamId}/accept`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.message;
  } catch {
    return rejectWithValue("FAILED_ACCEPT_INVITE");
  }
});

export const declineInvitationThunk = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("invitation/decline", async (teamId, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  try {
    const res = await axios.post(`/api/invitations/${teamId}/decline`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.message;
  } catch {
    return rejectWithValue("FAILED_DECLINE_INVITE");
  }
});