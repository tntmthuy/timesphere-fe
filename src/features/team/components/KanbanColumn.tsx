//src\features\team\components\KanbanColumn.tsx
import { useSortable } from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { AddTaskInlineInput } from "./AddTaskInlineInput";
import { TaskCard } from "./TaskCard";
import { EditableText } from "./EditableText";
import type { TaskDto } from "../task";
import { useAppSelector } from "../../../state/hooks";
import axios from "axios";
import toast from "react-hot-toast";
import { ReorderableList } from "./reorder/ReorderableList";
import type { KanbanColumnDto } from "../kanban";
import { useAppDispatch } from "../../../state/hooks";
import { addTaskLocal } from "../kanbanSlice";


type KanbanColumnProps = {
  column: KanbanColumnDto;
  isDragging?: boolean;
  onClickTask?: (task: TaskDto) => void;
};

export const KanbanColumn = ({
  column,
  isDragging,
  onClickTask,
}: KanbanColumnProps) => {
  const token = useAppSelector((state) => state.auth.token);
  const [title, setTitle] = useState(column.title);

  const {
    setNodeRef,
    attributes,
    listeners,
    isDragging: isColumnDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column" },
  });

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

const dispatch = useAppDispatch();

const handleAddTask = (newTask: TaskDto) => {
  dispatch(addTaskLocal({ columnId: column.id, task: newTask }));
};


  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`w-[230px] flex-shrink-0 rounded-xl bg-white p-4 shadow-lg transition ${
        isColumnDragging ? "ring-2 ring-yellow-400 border-yellow-400" : "border border-gray-200"
      }`}
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
            key={task.id}
            task={task}
            dragData={{ type: "Task", columnId: column.id }}
            onClick={onClickTask}
          />
        )}
      />
    </div>
  );
};

////src\features\team\components\KanbanColumn.tsx

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
//   onUpdateTask?: (task: TaskDto) => void;
//   onClickTask?: (task: TaskDto) => void; //vvvvvvvvvv

// };

// export const KanbanColumn = ({
//   column,
//   onUpdateTask,
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
//     onUpdateTask?.( newTask);
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
//             key={task.id}
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
