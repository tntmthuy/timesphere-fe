//src\features\team\kanbanSlice.ts

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../api/axios";
import axios from "axios";
import type { TaskDto } from "./task";
import type { KanbanColumnDto } from "./kanban";
import type { RootState } from "../../state/store";

export interface KanbanColumn {
  id: string;
  title: string;
  position: number;
  tasks: TaskDto[];
}

interface KanbanState {
  columns: KanbanColumnDto[]; 
  tasks: TaskDto[];               // ✅ thêm mảng task
  isLoading: boolean;
  error: string | null;
}

const initialState: KanbanState = {
  columns: [],
  tasks: [],
  isLoading: false,
  error: null,
};

export const fetchBoardThunk = createAsyncThunk(
  "kanban/fetchBoard",
  async (workspaceId: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    try {
      const res = await api.get(`/api/kanban/${workspaceId}/kanban-board`, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ thêm header
      });
      return res.data.data.columns as KanbanColumnDto[];
    } catch {
      return rejectWithValue("Không thể tải bảng Kanban");
    }
  }
);

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
  reducers: {
    updateTaskLocal: (state, action: PayloadAction<TaskDto>) => {
  const updated = action.payload;

  // ✅ cập nhật mảng tasks riêng nếu bạn dùng nó
  state.tasks = state.tasks.map((t) =>
    t.id === updated.id ? { ...t, ...updated } : t,
  );

  // ✅ cập nhật luôn trong columns để TaskCard ngoài re-render
  for (const col of state.columns) {
    const index = col.tasks.findIndex((t) => t.id === updated.id);
    if (index !== -1) {
      col.tasks[index] = updated;
      break;
    }
  }
},
addTaskLocal: (
  state,
  action: PayloadAction<{ columnId: string; task: TaskDto }>
) => {
  const { columnId, task } = action.payload;
  const column = state.columns.find((c) => c.id === columnId);
  if (column) {
    column.tasks.push(task);
    state.tasks.push(task); // nếu bạn dùng `state.tasks` toàn cục
  }
},
moveColumnLocal: (
  state,
  action: PayloadAction<{ columnId: string; toIndex: number }>
) => {
  const { columnId, toIndex } = action.payload;

  const fromIndex = state.columns.findIndex((c) => c.id === columnId);
  if (fromIndex === -1 || fromIndex === toIndex) return;

  const columnsCopy = [...state.columns];
  const [moved] = columnsCopy.splice(fromIndex, 1);
  columnsCopy.splice(toIndex, 0, moved);

  state.columns = columnsCopy;
},
moveTaskLocal: (
  state,
  action: PayloadAction<{
    taskId: string;
    fromColumnId: string;
    toColumnId: string;
    targetPosition: number;
  }>
) => {
  const { taskId, fromColumnId, toColumnId, targetPosition } = action.payload;

  const fromCol = state.columns.find((c) => c.id === fromColumnId);
  const toCol = state.columns.find((c) => c.id === toColumnId);
  if (!fromCol || !toCol) return;

  const index = fromCol.tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return;

  const [task] = fromCol.tasks.splice(index, 1);

  const safePos = Math.min(toCol.tasks.length, targetPosition);
  toCol.tasks.splice(safePos, 0, task);
if (toCol.tasks.length === 0) {
  console.log("📭 Cột target đang rỗng, thêm task đầu tiên");
}
  // ✅ Nếu bạn đang dùng state.tasks toàn cục thì cập nhật thêm:
  const globalIndex = state.tasks.findIndex((t) => t.id === taskId);
  if (globalIndex !== -1) {
    state.tasks[globalIndex] = task;
  }
}
  },
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
      })
      .addCase(fetchBoardThunk.pending, (state) => {
  state.isLoading = true;
  state.error = null;
})
.addCase(fetchBoardThunk.fulfilled, (state, action) => {
  state.columns = action.payload; // ✅ gán vào Redux
  state.isLoading = false;
})
.addCase(fetchBoardThunk.rejected, (state, action) => {
  state.error = action.payload as string;
  state.isLoading = false;
});
  },
});

export const {
  updateTaskLocal,
  moveColumnLocal,
  addTaskLocal,
  moveTaskLocal,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;

// 

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { api } from "../../api/axios";
// import axios from "axios";

// export interface KanbanColumn {
//   id: string;
//   title: string;
//   position: number;
// }

// interface KanbanState {
//   columns: KanbanColumn[];
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: KanbanState = {
//   columns: [],
//   isLoading: false,
//   error: null,
// };

// export const createColumnThunk = createAsyncThunk(
//   "kanban/createColumn",
//   async (payload: { workspaceId: string; title: string }, { rejectWithValue }) => {
//     try {
//       const res = await api.post("/api/kanban/column", payload);
//       return res.data.data; // data từ `KanbanColumnMapper.toDto`
//     } catch (err: unknown) {
//     if (axios.isAxiosError(err)) {
//         const message = err.response?.data?.message || "Tạo cột thất bại";
//         return rejectWithValue(message);
//     }
//     return rejectWithValue("Tạo cột thất bại");
//     }

//   }
// );

// const kanbanSlice = createSlice({
//   name: "kanban",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(createColumnThunk.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(createColumnThunk.fulfilled, (state, action) => {
//         state.columns.push(action.payload);
//         state.isLoading = false;
//       })
//       .addCase(createColumnThunk.rejected, (state, action) => {
//         state.error = action.payload as string;
//         state.isLoading = false;
//       });
//   },
// });

// export default kanbanSlice.reducer;