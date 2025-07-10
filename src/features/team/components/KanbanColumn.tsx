//src\features\team\components\KanbanColumn.tsx
import { useState, useEffect } from "react";
import { AddTaskInlineInput } from "./AddTaskInlineInput";
import { TaskCard } from "./TaskCard";
import { EditableText } from "./EditableText";
// import { TaskDetailModal } from "./TaskDetailModal";
import type { TaskDto } from "../task";
import { useAppSelector } from "../../../state/hooks";
import axios from "axios";
import toast from "react-hot-toast";
import { ReorderableList } from "./reorder/ReorderableList";
import type { KanbanColumnDto } from "../kanban";

type KanbanColumnProps = {
  column: KanbanColumnDto;
  isDragging?: boolean;
  onUpdateTasks?: (tasks: TaskDto[]) => void;
  onClickTask?: (task: TaskDto) => void; //vvvvvvvvvv

};

export const KanbanColumn = ({
  column,
  onUpdateTasks,
  isDragging,
  onClickTask,
}: KanbanColumnProps) => {
  const token = useAppSelector((state) => state.auth.token);
  const [title, setTitle] = useState(column.title);
  // const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);

  useEffect(() => {
    setTitle(column.title);
  }, [column.title]);

  const updateColumnTitle = async (newTitle: string) => {
    const cleanTitle = newTitle.trim();
    if (!cleanTitle) return toast.error("❌ Tên cột không được để trống");
    if (cleanTitle === title.trim()) return;

    setTitle(cleanTitle);
    try {
      const res = await axios.patch(
        `/api/kanban/column/${column.id}`,
        { title: cleanTitle },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTitle(res.data.data?.title ?? cleanTitle);
      toast.success("Cập nhật tên cột thành công!");
    } catch {
      toast.error("Cập nhật tên cột thất bại");
    }
  };

  const handleAddTask = (newTask: TaskDto) => {
    onUpdateTasks?.([...column.tasks, newTask]);
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
          <p className="text-xs font-semibold text-gray-700">
            {column.tasks.length}
          </p>
        </div>

        <div className="mb-2 pt-2 pb-2">
          <AddTaskInlineInput columnId={column.id} onAddTask={handleAddTask} />
        </div>

        <ReorderableList<TaskDto>
          items={column.tasks}
          getId={(task) => task.id}
          strategy="vertical"
          columnId={column.id}
          className="space-y-3"
          isDragging={isDragging}
          renderItem={(task) => (
            <TaskCard
              task={task}
              dragData={{ type: "Task", columnId: column.id }}
              // onClick={() => onClickTask?.(task)} // ✅ gọi khi người dùng nhấn
              onClick={onClickTask} // ✅ truyền callback mở modal

            />
          )}
        />
      </div>

      {/* {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          token={token}
          onClose={() => setSelectedTask(null)}
          onUpdated={(updated) => {
            onUpdateTasks?.(
              column.tasks.map((t) => (t.id === updated.id ? updated : t)),
            );
            setSelectedTask(updated);
          }}
        />
      )} */}
    </>
  );
};

// import { useState, useEffect } from "react";
// import { AddTaskInlineInput } from "./AddTaskInlineInput";
// import { TaskCard } from "./TaskCard";
// import { EditableText } from "./EditableText";
// import { TaskDetailModal } from "./TaskDetailModal";
// import type { TaskDto } from "../task";
// import { useAppSelector } from "../../../state/hooks";
// import axios, { AxiosError } from "axios";
// import toast from "react-hot-toast";
// import { ReorderableList } from "./reorder/ReorderableList";
// import type { KanbanColumnDto } from "../kanban";

// type KanbanColumnProps = {
//   column: KanbanColumnDto;
//   onUpdateTasks?: (tasks: TaskDto[]) => void;
// };

// export const KanbanColumn = ({ column, onUpdateTasks }: KanbanColumnProps) => {
//   const token = useAppSelector((state) => state.auth.token);
//   const [title, setTitle] = useState(column.title);
//   // const [tasks, setTasks] = useState(column.tasks);
//   const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);

//   useEffect(() => {
//     setTitle(column.title); // ✅ sync từ props nếu redux reload
//   }, [column.title]);

//   const updateColumnTitle = async (newTitle: string) => {
//     const prevTitle = title;
//     const cleanTitle = newTitle.trim();

//     if (!cleanTitle) {
//       toast.error("❌ Tên cột không được để trống");
//       return;
//     }

//     if (cleanTitle === prevTitle.trim()) return;

//     setTitle(cleanTitle);

//     try {
//       const res = await axios.patch(
//         `/api/kanban/column/${column.id}`,
//         { title: cleanTitle },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       const updatedTitle = res.data.data?.title ?? cleanTitle;
//       setTitle(updatedTitle);
//       toast.success("Column title updated successfully!");
//     } catch (err: unknown) {
//       const axiosErr = err as AxiosError;
//       console.error("❌ Lỗi:", axiosErr);

//       if (axiosErr.response) {
//         const status = axiosErr.response.status;
//         if (status === 403) {
//           toast.error("You don’t have permission to rename this column");
//         } else if (status === 400) {
//           toast.error("Invalid column title");
//         } else {
//           toast.error("Failed to update column title");
//         }
//       } else {
//         toast.error("Network error. Please try again");
//       }

//       setTitle(prevTitle);
//     }
//   };

//   const handleAddTask = (newTask: TaskDto) => {
//     onUpdateTasks?.([...column.tasks, newTask]); // ✅ báo lên để Board cập nhật
//   };

//   return (
//     <>
//       <div className="w-[230px] flex-shrink-0 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
//         <div className="mb-2 flex items-center justify-between">
//           <EditableText
//             text={title}
//             as="h2"
//             tagClassName="text-sm font-bold text-black"
//             inputClassName="text-sm font-bold text-black"
//             onSubmit={updateColumnTitle}
//             placeholder="Tên cột"
//           />
//           <p className="text-xs font-semibold text-gray-700">{column.tasks.length}</p>
//         </div>

//         <div className="mb-2 pt-2 pb-2">
//           <AddTaskInlineInput columnId={column.id} onAddTask={handleAddTask} />
//         </div>

//         <ReorderableList<TaskDto>
//           items={column.tasks}
//           getId={(task) => task.id}
//           strategy="vertical"
//           columnId={column.id}
//           className="space-y-3"
//           renderItem={(task) => (
//             <TaskCard
//   task={task}
//   dragData={{ type: "Task", columnId: column.id }}
// />
//           )}
//           onReorder={async (itemId, targetIndex) => {
//             const taskId = String(itemId);
//             try {
//               await axios.patch(
//                 `/api/kanban/task/${taskId}/move-column`,
//                 {
//                   targetColumnId: column.id,
//                   targetPosition: targetIndex,
//                 },
//                 { headers: { Authorization: `Bearer ${token}` } },
//               );

//               const oldIndex = column.tasks.findIndex((t) => t.id === taskId);
//               const newOrder = [...column.tasks];
//               const [moved] = newOrder.splice(oldIndex, 1);
//               newOrder.splice(targetIndex, 0, moved);

//               onUpdateTasks?.(newOrder); // ✅ Gọi lên cho KanbanBoard xử lý
//             } catch (err) {
//               console.error("❌ Lỗi chuyển task:", err);
//             }
//           }}
//         />
//       </div>

//       {/* 🪄 Task Detail Modal */}
//       {selectedTask && (
//         <TaskDetailModal
//           task={selectedTask}
//           token={token}
//           onClose={() => setSelectedTask(null)}
//           onUpdated={(updated) => {
//             onUpdateTasks?.(
//               column.tasks.map((t) => (t.id === updated.id ? updated : t)),
//             );
//             setSelectedTask(updated); // 🔄 nếu cần giữ modal mở với dữ liệu mới
//           }}
//         />
//       )}
//     </>
//   );
// };
