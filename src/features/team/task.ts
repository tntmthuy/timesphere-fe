import axios from "axios";

export const createTask = async (
  columnId: string,
  title: string,
  token: string
) => {
  const res = await axios.post(
    "/api/kanban/task",
    { columnId, title },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data.data as TaskDto;
};

// ✅ Thêm kiểu task backend trả về
export type TaskDto = {
  id: string;
  taskTitle: string;
  priority: string;
  progressDisplay: string;
  progress: number;
  dateDue: string;
  assignees: {
    fullName: string;
  }[];
};
