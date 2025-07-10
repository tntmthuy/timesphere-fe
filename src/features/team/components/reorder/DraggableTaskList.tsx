
// src/features/team/components/reorder/DraggableTaskList.tsx
import { ReorderableList } from "./ReorderableList";
import { TaskCard } from "../TaskCard";
import type { TaskDto } from "../../task";

type Props = {
  columnId: string;
  tasks: TaskDto[];
};

export function DraggableTaskList({ columnId, tasks }: Props) {
  return (
    <ReorderableList<TaskDto>
      items={tasks}
      getId={(task) => String(task.id)}
      strategy="vertical"
      renderItem={(task) => (
        <TaskCard
          task={task}
          dragData={{ type: "Task", columnId }} // ✅ Gắn đúng dữ liệu drag
        />
      )}
      columnId={columnId}
      className="space-y-3"
    />
  );
}

// import { ReorderableList } from "./ReorderableList";
// import { TaskCard } from "../TaskCard";
// import type { TaskDto } from "../../task";
// import axios from "axios";
// import type { UniqueIdentifier } from "@dnd-kit/core";

// type Props = {
//   columnId: string;
//   tasks: TaskDto[];
//   token: string;
//   onReordered?: (tasks: TaskDto[]) => void;
// };

// export function DraggableTaskList({
//   columnId,
//   tasks,
//   token,
//   onReordered,
// }: Props) {
//   const handleReorder = async (
//     itemId: UniqueIdentifier,
//     targetIndex: number,
//   ) => {
//     const taskId = String(itemId);
//     try {
//       await axios.patch(
//         `/api/kanban/task/${taskId}/move-column`,
//         {
//           targetColumnId: columnId,
//           targetPosition: targetIndex,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );

//       const newOrder = [...tasks];
//       const oldIndex = newOrder.findIndex((t) => t.id === taskId);
//       const [moved] = newOrder.splice(oldIndex, 1);
//       newOrder.splice(targetIndex, 0, moved);

//       onReordered?.(newOrder);
//     } catch (err) {
//       console.error("❌ Lỗi reorder task:", err);
//     }
//   };

//   return (
//     <ReorderableList<TaskDto>
//       items={tasks}
//       getId={(task) => task.id}
//       strategy="vertical"
//       onReorder={handleReorder}
//       renderItem={(task) => (
//         <TaskCard
//           task={task}
//           dragData={{ type: "Task", columnId }} // 👈 THÊM DỮ LIỆU DRAG NÀY
//         />
//       )}
//       columnId={columnId}
//       className="space-y-3"
//     />
//   );
// }
