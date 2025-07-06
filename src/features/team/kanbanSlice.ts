import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";
import axios from "axios";

export interface KanbanColumn {
  id: string;
  title: string;
  position: number;
}

interface KanbanState {
  columns: KanbanColumn[];
  isLoading: boolean;
  error: string | null;
}

const initialState: KanbanState = {
  columns: [],
  isLoading: false,
  error: null,
};

export const createColumnThunk = createAsyncThunk(
  "kanban/createColumn",
  async (payload: { workspaceId: string; title: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/kanban/column", payload);
      return res.data.data; // data từ `KanbanColumnMapper.toDto`
    } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || "Tạo cột thất bại";
        return rejectWithValue(message);
    }
    return rejectWithValue("Tạo cột thất bại");
    }

  }
);

const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createColumnThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createColumnThunk.fulfilled, (state, action) => {
        state.columns.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createColumnThunk.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      });
  },
});

export default kanbanSlice.reducer;