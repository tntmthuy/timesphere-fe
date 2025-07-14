//src\features\team\kanbanSlice.ts

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../api/axios";
import axios from "axios";
import type { TaskDto } from "./task";
import type { KanbanColumnDto } from "./kanban";
import type { RootState } from "../../state/store";
import type { SubTask } from "./subtask";
import toast from "react-hot-toast";

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
  async (
    payload: { workspaceId: string; title: string },
    { getState, rejectWithValue }
  ) => {
    const token = (getState() as RootState).auth.token;

    try {
      const res = await api.post("/api/kanban/column", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const code = err.response?.status;
        if (code === 403) return rejectWithValue("NO_PERMISSION");
        if (code === 401) return rejectWithValue("UNAUTHORIZED");
        return rejectWithValue("FAILED_TO_CREATE");
      }
      return rejectWithValue("UNKNOWN_ERROR");
    }
  }
);

export const createSubtaskThunk = createAsyncThunk(
  "kanban/createSubtask",
  async (
    payload: { parentTaskId: string; title: string },
    { getState, rejectWithValue }
  ) => {
    const token = (getState() as RootState).auth.token;

    try {
      const res = await axios.post("/api/kanban/task/subtask", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        parentTaskId: payload.parentTaskId,
        subtask: res.data.data as SubTask,
      };
    } catch {
      toast.dismiss();
      toast.error("You don’t have permission to add subtasks.");
      return rejectWithValue("Không thể tạo subtask");
    }
  }
);

export const updateSubtaskTitleThunk = createAsyncThunk(
  "kanban/updateSubtaskTitle",
  async (
    payload: { subtaskId: string; title: string },
    { getState, rejectWithValue }
  ) => {
    const token = (getState() as RootState).auth.token;

    try {
      const res = await axios.patch(
        `/api/kanban/task/subtask/${payload.subtaskId}`,
        { title: payload.title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("📥 Subtask update response:", res.data);
      return {
        id: payload.subtaskId,
        title: payload.title,
      } as SubTask;
    } catch {
      return rejectWithValue("Failed to rename subtask.");
    }
  }
);

export const deleteSubtaskThunk = createAsyncThunk(
  "kanban/deleteSubtask",
  async (subtaskId: string, { getState }) => {
    const token = (getState() as RootState).auth.token;
    await api.delete(`/api/kanban/task/subtask/${subtaskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return subtaskId;
  },
);

//
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
      })
      .addCase(createSubtaskThunk.fulfilled, (state, action) => {
        const { parentTaskId, subtask } = action.payload;

        // ✅ Cập nhật trong columns
        for (const col of state.columns) {
          const task = col.tasks.find((t) => t.id === parentTaskId);
          if (task) {
            task.subTasks = [...(task.subTasks || []), subtask];
            task.subTasks.sort((a, b) => a.subtaskPosition - b.subtaskPosition); // ✅ sort
            break;
          }
        }

        // ✅ Cập nhật trong tasks toàn cục
        const globalTask = state.tasks.find((t) => t.id === parentTaskId);
        if (globalTask) {
          globalTask.subTasks = [...(globalTask.subTasks || []), subtask];
          globalTask.subTasks.sort((a, b) => a.subtaskPosition - b.subtaskPosition); // ✅ sort
        }
      })
      .addCase(updateSubtaskTitleThunk.fulfilled, (state, action) => {
        const updated = action.payload;
if (!updated || !updated.id) {
    console.error("💥 Subtask update payload bị undefined hoặc thiếu id:", updated);
    return;
  }

        // ✅ Cập nhật subtask trong mọi task chứa nó
        for (const col of state.columns) {
          for (const task of col.tasks) {
            if (task.subTasks) {
              const idx = task.subTasks.findIndex((s) => s.id === updated.id);
              if (idx !== -1) {
                task.subTasks[idx] = updated;
              }
            }
          }
        }

        // ✅ Nếu đang dùng state.tasks toàn cục
        for (const t of state.tasks) {
          if (t.subTasks) {
            const idx = t.subTasks.findIndex((s) => s.id === updated.id);
            if (idx !== -1) {
              t.subTasks[idx] = updated;
            }
          }
        }
      })
      .addCase(deleteSubtaskThunk.fulfilled, (state, action) => {
        const subtaskId = action.payload;

        // ✅ Xóa khỏi columns
        for (const col of state.columns) {
          for (const task of col.tasks) {
            task.subTasks = task.subTasks?.filter((s) => s.id !== subtaskId);
          }
        }

        // ✅ Xóa khỏi tasks toàn cục nếu bạn dùng state.tasks
        for (const task of state.tasks) {
          task.subTasks = task.subTasks?.filter((s) => s.id !== subtaskId);
        }
      })
      
      ;
  },
});

export const {
  updateTaskLocal,
  moveColumnLocal,
  addTaskLocal,
  moveTaskLocal,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;
