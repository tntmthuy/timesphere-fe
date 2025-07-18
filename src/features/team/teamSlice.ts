//src\features\team\teamSlice.ts

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { TeamMemberDTO, TeamResponse } from "./member";
import type { RootState } from "../../state/store";

// 👥 Thành viên mỗi team
// type TeamMember = {
//   userId: string;
//   role: "OWNER" | "MEMBER";
// };

// 🏢 Cấu trúc team
export type Team = {
  id: string;
  teamName: string;
  members: TeamMemberDTO[];
};

type TeamState = {
  teamDetail: TeamResponse | null;
  teams: Team[];
  teamRole: "OWNER" | "MEMBER" | null;
  searchResults: TeamMemberDTO[]; // 👈 lưu thành viên từ BE
  assignees: TeamMemberDTO[];
  searchError: string | null;
  newTeamSuggestions: TeamMemberDTO[];
};

const initialState: TeamState = {
  teamDetail: null,
  teams: [],
  teamRole: null,
  searchResults: [], 
  assignees: [],
  searchError: null, 
  newTeamSuggestions: [],
};

//tạo nhóm
export const createTeamThunk = createAsyncThunk<
  TeamResponse,
  { teamName: string; description: string },
  { state: RootState }
>(
  "team/createTeam",
  async (payload, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    try {
      const res = await axios.post("/api/teams", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.message;
      if (msg === "TEAM_CREATE_LIMIT_FOR_FREE_USER") {
        return rejectWithValue("TEAM_LIMIT");
      }
      return rejectWithValue("CREATE_FAILED");
    }
  }
);

//kiếm toàn bộ
export const searchNewTeamMembersThunk = createAsyncThunk(
  "team/searchNewTeamMembers",
  async (keyword: string, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;

    try {
      const res = await axios.get(`/api/user/search-new-team`, {
        params: { keyword },
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data; // 👈 lấy toàn bộ
    } catch {
      return rejectWithValue("SEARCH_FAILED");
    }
  }
);

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

//tìm assignees
export const fetchAssigneesOfTaskThunk = createAsyncThunk(
  "team/fetchAssignees",
  async (taskId: string, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;

    try {
      const res = await axios.get(`/api/kanban/task/${taskId}/assignees`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data; // 👈 mảng assignee
    } catch {
      return rejectWithValue("FAILED_TO_FETCH_ASSIGNEES");
    }
  }
);

//gán task 
export const assignMemberToTaskThunk = createAsyncThunk(
  "task/assignMember",
  async (
    { taskId, memberId }: { taskId: string; memberId: string },
    { getState, rejectWithValue }
  ) => {
    const token = (getState() as RootState).auth.token;

    try {
      const res = await axios.put(
        `/api/kanban/task/${taskId}/assign`,
        { memberIds: [memberId] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data; // ✅ Task sau khi gán xong
    } catch {
      return rejectWithValue("ASSIGN_FAILED");
    }
  }
);

//hủy assign
export const unassignMemberFromTaskThunk = createAsyncThunk(
  "task/unassignMember",
  async (
    { taskId, memberId }: { taskId: string; memberId: string },
    { getState, rejectWithValue }
  ) => {
    const token = (getState() as RootState).auth.token;

    try {
      const res = await axios.put(
        `/api/kanban/task/${taskId}/unassign`,
        { memberIds: [memberId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data; // ✅ Updated Task
    } catch {
      return rejectWithValue("UNASSIGN_FAILED");
    }
  }
);

// danh sách member
export const fetchTeamDetailThunk = createAsyncThunk(
  "team/fetchTeamDetail",
  async (teamId: string, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    try {
      const res = await axios.get(`/api/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return res.data.data; // ✅ Trả về kiểu TeamResponse
    } catch {
      return rejectWithValue("FAILED_TO_FETCH_TEAM_DETAIL");
    }
  }
);

//gửi lời mời
export const inviteMemberToTeamThunk = createAsyncThunk<
  string,
  { teamId: string; email: string },
  { state: RootState }
>(
  "team/inviteMember",
  async ({ teamId, email }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    try {
      await axios.post(
        `/api/teams/${teamId}/members`,
        [{ email }],
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return "Invitation sent successfully. Awaiting confirmation.";
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        return rejectWithValue("FORBIDDEN_INVITE"); // ✅ báo lỗi quyền
      }
      return rejectWithValue("ALREADY_INVITED");
    }
  }
);

//nhượng quyền
export const transferOwnershipThunk = createAsyncThunk<
  string, // return message
  { teamId: string; userId: string },
  { state: RootState }
>(
  "team/transferOwnership",
  async ({ teamId, userId }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    try {
      const res = await fetch(
        `/api/teams/${teamId}/members/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newRole: "OWNER" }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        return rejectWithValue(error.message || "Permission denied.");
      }

      const data = await res.json();
      return data.message; // "Cập nhật vai trò thành công!"
    } catch {
      return rejectWithValue("Failed to transfer ownership.");
    }
  }
);

//xóa nhóm
export const deleteTeamThunk = createAsyncThunk<
  string, // trả về message
  string, // teamId
  { state: RootState }
>("team/deleteTeam", async (teamId, { getState, rejectWithValue }) => {
  const token = getState().auth.token;

  try {
    await axios.delete(`/api/teams/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return "Team deleted successfully."; 
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 403) {
      return rejectWithValue("FORBIDDEN_DELETE");
    }
    return rejectWithValue("FAILED_TO_DELETE_TEAM");
  }
});


//Slice
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
    })
    .addCase(fetchAssigneesOfTaskThunk.fulfilled, (state, action) => {
      state.assignees = action.payload;
    })
    .addCase(assignMemberToTaskThunk.fulfilled, (state, action) => {
      state.assignees = action.payload.assignees; // ✅ cập nhật danh sách người được giao
    });
    builder.addCase(fetchTeamDetailThunk.fulfilled, (state, action) => {
      state.teamDetail = action.payload;
    });
    builder.addCase(searchNewTeamMembersThunk.fulfilled, (state, action) => {
      state.newTeamSuggestions = action.payload;
    });
    builder.addCase(createTeamThunk.fulfilled, (state, action) => {
      state.teams.push(action.payload); // ✅ thêm team mới vào danh sách
    });
    builder.addCase(deleteTeamThunk.fulfilled, (state, action) => {
      // `action.meta.arg` chính là `teamId` mà bạn đã truyền khi dispatch
      state.teams = state.teams.filter((team) => team.id !== action.meta.arg);
    });
}
});

// Selector trả về mảng thành viên
export const selectTeamMembers = createSelector(
  (state: RootState) => state.team.teamDetail,
  (teamDetail) => teamDetail?.members || []
);

export const { setTeams, updateTeamName, setTeamRole } = teamSlice.actions;
export default teamSlice.reducer;