// task.ts
import axios from "axios";
import type { SubTask } from "./subtask";

export type Priority = "HIGH" | "MEDIUM" | "LOW" | null;

export type UpdateTaskRequest = {
  title?: string;
  description?: string;
  priority?: Priority;
  dateDue?: string | null;
  subTasks?: SubTask[];
};

export type TaskDto = {
  id: string;
  taskTitle: string;
  description?: string;
  priority: Priority;
  progressDisplay: string;
  progress: number;
  dateDue: string;
  assignees: {
    fullName: string;
  }[];
  subTasks?: SubTask[];
  columnId: string;
};

export const createTask = async (
  columnId: string,
  title: string,
  token: string
): Promise<TaskDto> => {
  const res = await axios.post(
    "/api/kanban/task",
    { columnId, title },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data.data as TaskDto;
};