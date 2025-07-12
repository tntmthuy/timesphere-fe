import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateSubtaskThunk = createAsyncThunk(
  "subtask/update",
  async ({ id, title }: { id: string; title: string }, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:8081/api/kanban/task/subtask/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const data = await res.json();
      return data;
    } catch  {
      return thunkAPI.rejectWithValue("Error updating subtask");
    }
  }
);