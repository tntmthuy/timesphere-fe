// src/features/admin/adminSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../api/axios';
import type { TeamMemberDTO } from '../team/member';

// DTO
export type Role = 'FREE' | 'PREMIUM' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export type TeamSummaryDto = {
  teamId: string;
  teamName: string;
  description: string;
  createdBy: string | null;
  createdByAvatarUrl: string | null;     
  ownerFullName: string | null;          
  ownerAvatarUrl: string | null;         
  createdAt: string;                     
  members: TeamMemberDTO[];
  totalFiles: number;
  totalComments: number;
  totalTasks: number;
};

export type UserSummaryDto = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
};

// Lấy danh sách người dùng
export const fetchUserList = createAsyncThunk<
  UserSummaryDto[],
  void,
  { rejectValue: string }
>(
  'admin/fetchUserList',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/admin/users');
      return res.data.data;
    } catch {
      return rejectWithValue('Không thể lấy danh sách người dùng');
    }
  }
);

// Cập nhật role người dùng
export const updateUserRole = createAsyncThunk<
  { id: string; role: Role },
  { id: string; role: Role },
  { rejectValue: string }
>(
  'admin/updateUserRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      await api.put(`/api/admin/users/${id}/role`, { role });
      return { id, role };
    } catch {
      return rejectWithValue('Không thể cập nhật vai trò');
    }
  }
);

// Xoá người dùng
export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'admin/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/admin/users/${id}`);
      return id;
    } catch {
      return rejectWithValue('Không thể xoá người dùng');
    }
  }
);

//danh sách nhóm
export const fetchTeamSummaryList = createAsyncThunk<
  TeamSummaryDto[], // kiểu giá trị trả về
  void,             // kiểu arg
  { rejectValue: string } // 💥 thêm dòng này
>(
  'admin/fetchTeamSummaryList',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/admin/teams');
      return res.data;
    } catch {
      return rejectWithValue('Không thể lấy danh sách nhóm');
    }
  }
);

// 🧩 Slice state
type AdminState = {
  users: UserSummaryDto[];
  loadingUsers: boolean;
  errorUsers: string | null;
  deletingUserId: string | null;
  teams: TeamSummaryDto[];
  loadingTeams: boolean;
  errorTeams: string | null;
};

const initialState: AdminState = {
  users: [],
  loadingUsers: false,
  errorUsers: null,
  deletingUserId: null,
  teams: [],
  loadingTeams: false,
  errorTeams: null,
};

// 🍰 Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearErrorUsers(state) {
      state.errorUsers = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUserList.pending, (state) => {
        state.loadingUsers = true;
        state.errorUsers = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action: PayloadAction<UserSummaryDto[]>) => {
        state.loadingUsers = false;
        state.users = action.payload;
      })
      .addCase(fetchUserList.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loadingUsers = false;
        state.errorUsers = action.payload ?? 'Có lỗi xảy ra';
      })

      // Update role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { id, role } = action.payload;
        const user = state.users.find((u) => u.id === id);
        if (user) {
          user.role = role;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.errorUsers = action.payload ?? 'Có lỗi khi cập nhật vai trò';
      })

      // Delete user
      .addCase(deleteUser.pending, (state, action) => {
        state.deletingUserId = action.meta.arg;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.deletingUserId = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.errorUsers = action.payload ?? 'Có lỗi khi xoá người dùng';
        state.deletingUserId = null;
      })
      .addCase(fetchTeamSummaryList.pending, (state) => {
        state.loadingTeams = true;
        state.errorTeams = null;
      })
      .addCase(fetchTeamSummaryList.fulfilled, (state, action: PayloadAction<TeamSummaryDto[]>) => {
        state.loadingTeams = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeamSummaryList.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loadingTeams = false;
        state.errorTeams = action.payload ?? 'Có lỗi khi lấy danh sách nhóm';
      })
      ;
  }
});

export const { clearErrorUsers } = adminSlice.actions;
export default adminSlice.reducer;