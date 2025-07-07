import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

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
};

const initialState: TeamState = {
  teams: [],
  teamRole: null,
};

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
});

export const { setTeams, updateTeamName, setTeamRole } = teamSlice.actions;
export default teamSlice.reducer;