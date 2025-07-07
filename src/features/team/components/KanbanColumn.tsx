import { useState, useEffect } from "react";
import { AddTaskInlineInput } from "./AddTaskInlineInput";
import { TaskCard } from "./TaskCard";
import { EditableText } from "./EditableText";
import { TaskDetailModal } from "./TaskDetailModal";
import type { TaskDto } from "../task";
import { useAppSelector } from "../../../state/hooks";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

type KanbanColumnProps = {
  column: {
    id: string;
    title: string;
    position: number;
    tasks: TaskDto[];
  };
};

export const KanbanColumn = ({ column }: KanbanColumnProps) => {
  const token = useAppSelector((state) => state.auth.token);
  const [title, setTitle] = useState(column.title);
  const [tasks, setTasks] = useState(column.tasks);
  const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);

  useEffect(() => {
    setTitle(column.title); // ✅ sync từ props nếu redux reload
  }, [column.title]);

  const updateColumnTitle = async (newTitle: string) => {
    const prevTitle = title;
    const cleanTitle = newTitle.trim();

    if (!cleanTitle) {
      toast.error("❌ Tên cột không được để trống");
      return;
    }

    if (cleanTitle === prevTitle.trim()) return;

    setTitle(cleanTitle);

    try {
      const res = await axios.patch(
        `/api/kanban/column/${column.id}`,
        { title: cleanTitle },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const updatedTitle = res.data.data?.title ?? cleanTitle;
      setTitle(updatedTitle);
      toast.success("Column title updated successfully!");
    } catch (err: unknown) {
      const axiosErr = err as AxiosError;
      console.error("❌ Lỗi:", axiosErr);

      if (axiosErr.response) {
        const status = axiosErr.response.status;
        if (status === 403) {
          toast.error("You don’t have permission to rename this column");
        } else if (status === 400) {
          toast.error("Invalid column title");
        } else {
          toast.error("Failed to update column title");
        }
      } else {
        toast.error("Network error. Please try again");
      }

      setTitle(prevTitle);
    }
  };

  const handleAddTask = (newTask: TaskDto) => {
    setTasks((prev) => [...prev, newTask]);
  };

  return (
    <>
      <div className="w-[230px] flex-shrink-0 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
        <div className="mb-2 flex items-center justify-between">
          <EditableText
            text={title}
            as="h2"
            tagClassName="text-sm font-bold text-black"
            inputClassName="text-sm font-bold text-black"
            onSubmit={updateColumnTitle}
            placeholder="Tên cột"
          />
          <p className="text-xs font-semibold text-gray-700">{tasks.length}</p>
        </div>

        <div className="mb-2 pt-2 pb-2">
          <AddTaskInlineInput columnId={column.id} onAddTask={handleAddTask} />
        </div>

        <div className="space-y-3 text-sm text-gray-800 cursor-pointer">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => setSelectedTask(task)} // 🪄 mở modal
            />
          ))}
        </div>
      </div>

      {/* 🪄 Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal onClose={() => setSelectedTask(null)} />
      )}
    </>
  );
};
