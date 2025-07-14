//src\features\team\teamSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { TeamMemberDTO } from "./member";
import type { RootState } from "../../state/store";

// 👥 Thành viên mỗi team
type TeamMember = {
  userId: string;
  role: "OWNER" | "MEMBER";
};

// 🏢 Cấu trúc team
export type Team = {
  id: string;
  teamName: string;
  members: TeamMember[];
};

type TeamState = {
  teams: Team[];
  teamRole: "OWNER" | "MEMBER" | null;
  searchResults: TeamMemberDTO[]; // 👈 lưu thành viên từ BE
searchError: string | null;
};

const initialState: TeamState = {
  teams: [],
  teamRole: null,
  searchResults: [], 
  searchError: null, 
};

export const searchMembersInTeamThunk = createAsyncThunk(
  "team/searchMembers",
  async (
    { teamId, keyword }: { teamId: string; keyword: string },
    { getState, rejectWithValue }
  ) => {
    const token = (getState() as RootState).auth.token;

    try {
      const res = await axios.get(`/api/teams/${teamId}/members/search`, {
        params: { keyword },
        headers: { Authorization: `Bearer ${token}` }, // 👈 chuẩn gu
      });
      return res.data.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        return rejectWithValue("UNAUTHORIZED");
      }
      return rejectWithValue("SEARCH_FAILED");
    }
  }
);

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    // 👨‍👩‍👧‍👦 Set danh sách team
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },

    // ✏️ Cập nhật tên team
    updateTeamName: (
      state,
      action: PayloadAction<{ id: string; newName: string }>
    ) => {
      const team = state.teams.find((t) => t.id === action.payload.id);
      if (team) {
        team.teamName = action.payload.newName;
      }
    },

    // 👑 Set quyền hiện tại (OWNER | MEMBER)
    setTeamRole: (state, action: PayloadAction<"OWNER" | "MEMBER">) => {
      state.teamRole = action.payload;
    },
  },
  extraReducers: (builder) => {
  builder
    .addCase(searchMembersInTeamThunk.fulfilled, (state, action) => {
      state.searchResults = action.payload;
      state.searchError = null;
    })
    .addCase(searchMembersInTeamThunk.rejected, (state, action) => {
      state.searchResults = [];
      state.searchError = action.payload as string;
    });
}
});

export const { setTeams, updateTeamName, setTeamRole } = teamSlice.actions;
export default teamSlice.reducer;