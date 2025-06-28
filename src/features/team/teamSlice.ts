import { createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Team = {
  id: string;
  teamName: string;
};

type TeamState = {
  teams: Team[];
};

const initialState: TeamState = {
  teams: [],
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },
    updateTeamName: (
      state,
      action: PayloadAction<{ id: string; newName: string }>
    ) => {
      const team = state.teams.find((t) => t.id === action.payload.id);
      if (team) {
        team.teamName = action.payload.newName;
      }
    },
  },
});

export const { setTeams, updateTeamName } = teamSlice.actions;
export default teamSlice.reducer;