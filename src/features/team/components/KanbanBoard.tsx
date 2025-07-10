// src/features/team/components/KanbanBoard.tsx

import { useEffect, useState } from "react";
import { BtnAddColumn } from "./BtnAddColumn";
import { AddColumnCard } from "./AddColumnCard";
import { KanbanColumn } from "./KanbanColumn";
import {
  DragOverlay,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { TaskDetailModal } from "./TaskDetailModal";
import { useAppSelector, useAppDispatch } from "../../../state/hooks";
import {
  createColumnThunk,
  fetchBoardThunk,
  moveColumnLocal,
  moveTaskLocal,
} from "../kanbanSlice";
import { toast } from "react-hot-toast";
import { api } from "../../../api/axios";
import type { AxiosError } from "axios";
import type { TaskDto } from "../task";

type Props = {
  workspaceId: string;
};

type SortableData = {
  sortable: {
    containerId: string;
    index: number;
    items: string[];
  };
};

export const KanbanBoard = ({ workspaceId }: Props) => {
  const dispatch = useAppDispatch();
  const [adding, setAdding] = useState(false);
  const [draggingTask, setDraggingTask] = useState<TaskDto | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);

  const token = useAppSelector((state) => state.auth.token);
  const columns = useAppSelector((state) => state.kanban.columns);

  useEffect(() => {
    if (!workspaceId || !token) return;
    dispatch(fetchBoardThunk(workspaceId));
  }, [workspaceId, token, dispatch]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    const taskId = String(event.active.id);
    const fromColumnId = (event.active.data?.current as { columnId?: string })
      ?.columnId;
    const col = columns.find((c) => c.id === fromColumnId);
    const task = col?.tasks.find((t) => t.id === taskId);
    setDraggingTask(task ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setIsDragging(false);

    const { active, over } = event;
    if (!active || !over) return;

    const activeType = (active.data?.current as { type?: string })?.type;
    console.log("🎯 Drag type:", activeType);
    console.log("🔎 Active ID:", active.id);
    if (activeType === "Column") {
      const fromIndex = columns.findIndex((c) => c.id === String(active.id));
      const toIndex = columns.findIndex((c) => c.id === String(over?.id));

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

      try {
        await api.put(
          `/api/kanban/column/${active.id}/move`,
          { targetPosition: toIndex },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        dispatch(moveColumnLocal({ columnId: String(active.id), toIndex }));
        toast.success("Moved column!");
      } catch {
        toast.error("❌ Không thể chuyển cột");
      }

      return;
    }

    // 👉 Nếu là task
    const taskId = String(active.id);
    const fromColumnId = (active.data?.current as { columnId?: string })
      ?.columnId;
    const sortableInfo = (over.data?.current as SortableData)?.sortable;
    const targetPosition = sortableInfo?.index ?? 0;
    const toColumnId = sortableInfo?.containerId ?? String(over.id);
    if (!fromColumnId || !toColumnId) return;
    console.log("🐣 Task drag from column:", fromColumnId);
    console.log("🧲 Drop target info:", sortableInfo);
    console.log("📦 Drop to column:", toColumnId, "→ index:", targetPosition);
    const toCol = columns.find((c) => c.id === toColumnId);
    if (!toCol) return;
    const taskCount = toCol.tasks.length;
    const safeTargetPosition = Math.min(taskCount, targetPosition);

    try {
      await api.put(
        `/api/kanban/task/${taskId}/move-column`,
        {
          targetColumnId: toColumnId,
          targetPosition: safeTargetPosition,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      dispatch(
        moveTaskLocal({
          taskId,
          fromColumnId,
          toColumnId,
          targetPosition: safeTargetPosition,
        }),
      );

      toast.success("✅ Task đã chuyển cột!");
    } catch (err) {
      console.error("❌ Không thể cập nhật task:", err);
      toast.error("❌ Không thể chuyển task");
    }
  };

  const createColumn = async (title: string) => {
    const clean = title.trim();
    if (!clean) return toast.error("❌ Tên danh sách không được để trống");

    try {
      await dispatch(createColumnThunk({ workspaceId, title: clean })).unwrap();
      toast.success("✅ Thêm danh sách thành công!");
      setAdding(false);
    } catch (err: unknown) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === 403) {
        toast.error("❌ Không có quyền tạo danh sách");
      } else {
        toast.error("❌ Lỗi khi tạo danh sách");
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={columns.map((c) => c.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex h-full min-w-full items-start gap-4 overflow-x-auto pb-6">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              isDragging={isDragging}
              onClickTask={(task) => {
                setSelectedTask(task);
                setIsDragging(false);
              }}
            />
          ))}
          {adding ? (
            <AddColumnCard
              onAdd={createColumn}
              onCancel={() => setAdding(false)}
            />
          ) : (
            <BtnAddColumn onClick={() => setAdding(true)} />
          )}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {draggingTask ? (
          <div className="pointer-events-none scale-[0.97] opacity-80">
            <TaskCard task={draggingTask} />
          </div>
        ) : null}
      </DragOverlay>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          token={token}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </DndContext>
  );
};

// import { useEffect, useState } from "react";
// import { BtnAddColumn } from "./BtnAddColumn";
// import { AddColumnCard } from "./AddColumnCard";
// import { KanbanColumn } from "./KanbanColumn";
// import { api } from "../../../api/axios";
// import toast from "react-hot-toast";
// import { useAppSelector } from "../../../state/hooks";
// import type { AxiosError } from "axios";
// import type { KanbanColumnDto } from "../kanban";
// import {
//   DndContext,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   type DragEndEvent,
// } from "@dnd-kit/core";
// import type { TaskDto } from "../task";

// import { DragOverlay, type DragStartEvent } from "@dnd-kit/core";
// import { TaskCard } from "./TaskCard"; // dùng lại component bạn đang có
// import { TaskDetailModal } from "./TaskDetailModal";
// import {
//   horizontalListSortingStrategy,
//   SortableContext,
// } from "@dnd-kit/sortable";

// type Props = {
//   workspaceId: string;
// };
// type SortableData = {
//   sortable: {
//     containerId: string;
//     index: number;
//     items: string[];
//   };
// };
// export const KanbanBoard = ({ workspaceId }: Props) => {
//   const [adding, setAdding] = useState(false);

//   const [columns, setColumns] = useState<KanbanColumnDto[]>([]);

//   const [draggingTask, setDraggingTask] = useState<TaskDto | null>(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);
//   const token = useAppSelector((state) => state.auth.token);

//   useEffect(() => {
//     if (!workspaceId || !token) return;

//     api
//       .get(`/api/kanban/${workspaceId}/kanban-board`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setColumns(res.data.data.columns))
//       .catch(() => {
//         toast.error("Không thể truy cập bảng Kanban");
//       });
//   }, [workspaceId, token]);

//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: {
//         distance: 5, // ✅ yêu cầu di chuột 5px trước khi drag khởi động
//       },
//     }),
//   );

//   const handleDragEnd = async (event: DragEndEvent) => {
//     console.log("Handle dragEnd: ", event);

//     //column
//     const { active, over } = event;
//     const activeType = (active.data?.current as { type?: string })?.type;

//     if (activeType === "Column") {
//       const fromIndex = columns.findIndex((c) => c.id === String(active.id));
//       const toIndex = columns.findIndex((c) => c.id === String(over?.id));
//       if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

//       try {
//         await api.put(
//           `/api/kanban/column/${active.id}/move`,
//           { targetPosition: toIndex },
//           { headers: { Authorization: `Bearer ${token}` } },
//         );

//         const updated = [...columns];
//         const [moved] = updated.splice(fromIndex, 1);
//         updated.splice(toIndex, 0, moved);
//         setColumns(updated);
//       } catch {
//         toast.error("❌ Không thể chuyển cột");
//       }

//       return; // ⛔ dừng tại đây nếu là column
//     }

//     //task
//     setIsDragging(false);
//     // const { active, over } = event;
//     if (!active || !over) return;
//     const sortableInfo = (over.data?.current as SortableData)?.sortable;
//     const targetPosition = sortableInfo?.index ?? 0;
//     const toColumnId = sortableInfo?.containerId ?? String(over.id);
//     const taskId = String(active.id);
//     const fromColumnId = (active.data?.current as { columnId?: string })
//       ?.columnId;
//     if (!active) return;

//     if (!over) {
//       console.log("❌ Không có phần tử nào nhận task khi thả!");
//       return;
//     }
//     if (!fromColumnId || !toColumnId) return;

//     try {
//       await api.put(
//         `/api/kanban/task/${taskId}/move-column`,
//         {
//           targetColumnId: toColumnId,
//           targetPosition: targetPosition,
//         },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );

//       setColumns((prev) => {
//         const fromCol = prev.find((c) => c.id === fromColumnId);
//         const toCol = prev.find((c) => c.id === toColumnId);
//         if (!fromCol || !toCol) return prev;

//         const taskIndex = fromCol.tasks.findIndex((t) => t.id === taskId);
//         if (taskIndex === -1) return prev;

//         const [movedTask] = fromCol.tasks.splice(taskIndex, 1); // 👈 lấy từ state trước khi xóa
//         toCol.tasks.splice(targetPosition, 0, movedTask); // 👈 chèn đúng vị trí

//         return [...prev];
//       });
//     } catch (err) {
//       console.error("❌ Không thể cập nhật task:", err);
//       toast.error("Không thể chuyển task sang cột khác");
//     }
//   };

//   const handleDragStart = (event: DragStartEvent) => {
//     setIsDragging(true);
//     const taskId = String(event.active.id);
//     const fromColumnId = (event.active.data?.current as { columnId?: string })
//       ?.columnId;
//     const col = columns.find((c) => c.id === fromColumnId);
//     const task = col?.tasks.find((t) => t.id === taskId);
//     setDraggingTask(task ?? null);
//   };

//   const createColumn = async (title: string) => {
//     const clean = title.trim();
//     if (!clean) {
//       toast.error("❌ Tên danh sách không được để trống");
//       return;
//     }

//     try {
//       const res = await api.post(
//         "/api/kanban/column",
//         { workspaceId, title: clean },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );

//       const newCol = res.data.data;
//       setColumns((prev) => [...prev, newCol]);
//       toast.success("✅ Thêm danh sách thành công!");
//       setAdding(false);
//     } catch (err: unknown) {
//       const axiosErr = err as AxiosError;
//       console.error("❌ Error:", axiosErr);

//       if (axiosErr.response?.status === 403) {
//         toast.error("Không có quyền tạo danh sách");
//       } else {
//         toast.error("Lỗi tạo danh sách");
//       }
//     }
//   };

//   // cập nhật task
//   const updateTask = (updated: TaskDto) => {
//     setColumns((prev) =>
//       prev.map((col) =>
//         col.id === updated.columnId
//           ? {
//               ...col,
//               tasks: col.tasks.map((task) =>
//                 task.id === updated.id ? updated : task,
//               ),
//             }
//           : col,
//       ),
//     );
//   };

//   return (
//     <DndContext
//       sensors={sensors}
//       onDragStart={handleDragStart}
//       onDragEnd={handleDragEnd}
//     >
//       <SortableContext
//         items={columns.map((c) => c.id)}
//         strategy={horizontalListSortingStrategy}
//       >
//         <div className="flex h-full min-w-full items-start gap-4 overflow-x-auto pb-6">
//           {columns.map((col) => {
//             const handleUpdateTask = (updated: TaskDto) => {
//               setColumns((prev) =>
//                 prev.map((col) =>
//                   col.tasks.some((t) => t.id === updated.id)
//                     ? {
//                         ...col,
//                         tasks: col.tasks.map(
//                           (t) => (t.id === updated.id ? updated : t), // ✅ gán lại task
//                         ),
//                       }
//                     : col,
//                 ),
//               );
//             };

//             return (
//               <KanbanColumn
//                 key={col.id}
//                 column={col}
//                 isDragging={isDragging}
//                 onUpdateTask={handleUpdateTask}
//                 onClickTask={(task) => {
//                   setSelectedTask(task); // ✅ mở modal
//                   setIsDragging(false); // 👈 reset flag về lại
//                 }} //vvvvvvvvv
//               />
//             );
//           })}
//           {adding ? (
//             <AddColumnCard
//               onAdd={createColumn}
//               onCancel={() => setAdding(false)}
//             />
//           ) : (
//             <BtnAddColumn onClick={() => setAdding(true)} />
//           )}
//         </div>
//       </SortableContext>

//       {/* 👇 Thêm DragOverlay ngay đây */}
//       <DragOverlay dropAnimation={null}>
//         {draggingTask ? (
//           <div className="pointer-events-none scale-[0.97] opacity-80">
//             <TaskCard task={draggingTask} />
//           </div>
//         ) : null}
//       </DragOverlay>
//       {selectedTask && (
//         <TaskDetailModal
//           task={selectedTask}
//           token={token}
//           onUpdated={updateTask}
//           onClose={() => setSelectedTask(null)}
//         />
//       )}
//     </DndContext>
//   );
// };

// import { useEffect, useState } from "react";
// import { BtnAddColumn } from "./BtnAddColumn";
// import { AddColumnCard } from "./AddColumnCard";
// import { KanbanColumn } from "./KanbanColumn";
// import { api } from "../../../api/axios";
// import toast from "react-hot-toast";
// import { useAppSelector } from "../../../state/hooks";
// import type { AxiosError } from "axios";
// import type { KanbanColumnDto } from "../kanban";
// import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
// import type { TaskDto } from "../task";

// import { DragOverlay, type DragStartEvent } from "@dnd-kit/core";
// import { TaskCard } from "./TaskCard"; // dùng lại component bạn đang có
// import { TaskDetailModal } from "./TaskDetailModal";

// type Props = {
//   workspaceId: string;
// };
// type SortableData = {
//   sortable: {
//     containerId: string;
//     index: number;
//     items: string[];
//   };
// };
// export const KanbanBoard = ({ workspaceId }: Props) => {
//   const [adding, setAdding] = useState(false);
//   const [columns, setColumns] = useState<KanbanColumnDto[]>([]);

//   const [draggingTask, setDraggingTask] = useState<TaskDto | null>(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);
//   const token = useAppSelector((state) => state.auth.token);

//   useEffect(() => {
//     if (!workspaceId || !token) return;

//     api
//       .get(`/api/kanban/${workspaceId}/kanban-board`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setColumns(res.data.data.columns))
//       .catch(() => {
//         toast.error("Không thể truy cập bảng Kanban");
//       });
//   }, [workspaceId, token]);

// const sensors = useSensors(
//   useSensor(PointerSensor, {
//     activationConstraint: {
//       distance: 5, // ✅ yêu cầu di chuột 5px trước khi drag khởi động
//     },
//   })
// );

//   const handleDragEnd = async (event: DragEndEvent) => {
//     console.log("Handle dragEnd: ", event);
//     setIsDragging(false);
//     const { active, over } = event;
//     if (!active || !over) return;
//     const sortableInfo = (over.data?.current as SortableData)?.sortable;
//     const targetPosition = sortableInfo?.index ?? 0;
//     const toColumnId = sortableInfo?.containerId ?? String(over.id);
//     const taskId = String(active.id);
//     const fromColumnId = (active.data?.current as { columnId?: string })
//       ?.columnId;
//     if (!active) return;

//     if (!over) {
//       console.log("❌ Không có phần tử nào nhận task khi thả!");
//       return;
//     }
//     if (!fromColumnId || !toColumnId) return;

//     try {
//       await api.put(
//         `/api/kanban/task/${taskId}/move-column`,
//         {
//           targetColumnId: toColumnId,
//           targetPosition: targetPosition,
//         },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );

//       setColumns((prev) => {
//         const fromCol = prev.find((c) => c.id === fromColumnId);
//         const toCol = prev.find((c) => c.id === toColumnId);
//         if (!fromCol || !toCol) return prev;

//         const taskIndex = fromCol.tasks.findIndex((t) => t.id === taskId);
//         if (taskIndex === -1) return prev;

//         const [movedTask] = fromCol.tasks.splice(taskIndex, 1); // 👈 lấy từ state trước khi xóa
//         toCol.tasks.splice(targetPosition, 0, movedTask); // 👈 chèn đúng vị trí

//         return [...prev];
//       });
//     } catch (err) {
//       console.error("❌ Không thể cập nhật task:", err);
//       toast.error("Không thể chuyển task sang cột khác");
//     }
//   };

//   const handleDragStart = (event: DragStartEvent) => {
//     setIsDragging(true);
//     const taskId = String(event.active.id);
//     const fromColumnId = (event.active.data?.current as { columnId?: string })
//       ?.columnId;
//     const col = columns.find((c) => c.id === fromColumnId);
//     const task = col?.tasks.find((t) => t.id === taskId);
//     setDraggingTask(task ?? null);
//   };

//   const createColumn = async (title: string) => {
//     const clean = title.trim();
//     if (!clean) {
//       toast.error("❌ Tên danh sách không được để trống");
//       return;
//     }

//     try {
//       const res = await api.post(
//         "/api/kanban/column",
//         { workspaceId, title: clean },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );

//       const newCol = res.data.data;
//       setColumns((prev) => [...prev, newCol]);
//       toast.success("✅ Thêm danh sách thành công!");
//       setAdding(false);
//     } catch (err: unknown) {
//       const axiosErr = err as AxiosError;
//       console.error("❌ Error:", axiosErr);

//       if (axiosErr.response?.status === 403) {
//         toast.error("Không có quyền tạo danh sách");
//       } else {
//         toast.error("Lỗi tạo danh sách");
//       }
//     }
//   };

//   return (
//     <DndContext sensors={sensors}
//  onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
//       <div className="flex h-full min-w-full items-start gap-4 overflow-x-auto pb-6">
//         {columns.map((col) => {
//           const handleUpdateTasks = (updated: TaskDto[]) => {
//             setColumns((prev) =>
//               prev.map((c) => (c.id === col.id ? { ...c, tasks: updated } : c)),
//             );
//           };

//           return (
//             <KanbanColumn
//               key={col.id}
//               column={col}
//               isDragging={isDragging}
//               onUpdateTasks={handleUpdateTasks}
//               onClickTask={(task) => {
//                 setSelectedTask(task); // ✅ mở modal
//                 setIsDragging(false); // 👈 reset flag về lại
//               }} //vvvvvvvvv
//             />
//           );
//         })}
//         {adding ? (
//           <AddColumnCard
//             onAdd={createColumn}
//             onCancel={() => setAdding(false)}
//           />
//         ) : (
//           <BtnAddColumn onClick={() => setAdding(true)} />
//         )}
//       </div>
//       {/* 👇 Thêm DragOverlay ngay đây */}
//       <DragOverlay dropAnimation={null}>
//         {draggingTask ? (
//           <div className="pointer-events-none scale-[0.97] opacity-80">
//             <TaskCard task={draggingTask} />
//           </div>
//         ) : null}
//       </DragOverlay>
//       {selectedTask && (
//         <TaskDetailModal
//           task={selectedTask}
//           token={token}
//           onClose={() => setSelectedTask(null)}
//         />
//       )}
//     </DndContext>
//   );
// };
