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
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

  // Trong component
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: column.id,
      data: { type: "Column" },
    });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className="w-[230px] flex-shrink-0 rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
      >
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
    </>
  );
};

// import { useState, useEffect } from "react";
// import { AddTaskInlineInput } from "./AddTaskInlineInput";
// import { TaskCard } from "./TaskCard";
// import { EditableText } from "./EditableText";
// // import { TaskDetailModal } from "./TaskDetailModal";
// import type { TaskDto } from "../task";
// import { useAppSelector } from "../../../state/hooks";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { ReorderableList } from "./reorder/ReorderableList";
// import type { KanbanColumnDto } from "../kanban";

// type KanbanColumnProps = {
//   column: KanbanColumnDto;
//   isDragging?: boolean;
//   onUpdateTasks?: (tasks: TaskDto[]) => void;
//   onClickTask?: (task: TaskDto) => void; //vvvvvvvvvv

// };

// export const KanbanColumn = ({
//   column,
//   onUpdateTasks,
//   isDragging,
//   onClickTask,
// }: KanbanColumnProps) => {
//   const token = useAppSelector((state) => state.auth.token);
//   const [title, setTitle] = useState(column.title);
//   // const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);

//   useEffect(() => {
//     setTitle(column.title);
//   }, [column.title]);

//   const updateColumnTitle = async (newTitle: string) => {
//     const cleanTitle = newTitle.trim();
//     if (!cleanTitle) return toast.error("❌ Tên cột không được để trống");
//     if (cleanTitle === title.trim()) return;

//     setTitle(cleanTitle);
//     try {
//       const res = await axios.patch(
//         `/api/kanban/column/${column.id}`,
//         { title: cleanTitle },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       setTitle(res.data.data?.title ?? cleanTitle);
//       toast.success("Cập nhật tên cột thành công!");
//     } catch {
//       toast.error("Cập nhật tên cột thất bại");
//     }
//   };

//   const handleAddTask = (newTask: TaskDto) => {
//     onUpdateTasks?.([...column.tasks, newTask]);
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
//           <p className="text-xs font-semibold text-gray-700">
//             {column.tasks.length}
//           </p>
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
//           isDragging={isDragging}
//           renderItem={(task) => (
//             <TaskCard
//               task={task}
//               dragData={{ type: "Task", columnId: column.id }}
//               // onClick={() => onClickTask?.(task)} // ✅ gọi khi người dùng nhấn
//               onClick={onClickTask} // ✅ truyền callback mở modal

//             />
//           )}
//         />
//       </div>
//     </>
//   );
// };
