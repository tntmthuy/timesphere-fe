import { useEffect, useState } from "react";
import { BtnAddColumn } from "./BtnAddColumn";
import { AddColumnCard } from "./AddColumnCard";
import { KanbanColumn } from "./KanbanColumn";
import { api } from "../../../api/axios";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../state/hooks";
import type { AxiosError } from "axios";

type KanbanColumnDto = {
  id: string;
  title: string;
  position: number;
  tasks: TaskDto[];
};

type TaskDto = {
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

type Props = {
  workspaceId: string;
};

export const KanbanBoard = ({ workspaceId }: Props) => {
  const [adding, setAdding] = useState(false);
  const [columns, setColumns] = useState<KanbanColumnDto[]>([]);

  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (!workspaceId || !token) return;

    api
      .get(`/api/kanban/${workspaceId}/kanban-board`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setColumns(res.data.data.columns))
      .catch((err) => {
        console.error("❌ API lỗi:", err);
        toast.error("Không thể truy cập bảng Kanban (403)");
      });
  }, [workspaceId, token]);

  const createColumn = async (title: string) => {
    const clean = title.trim();
    if (!clean) {
      toast.error("❌ Tên danh sách không được để trống");
      return;
    }

    try {
      const res = await api.post(
        "/api/kanban/column",
        {
          workspaceId,
          title: clean,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newCol = res.data.data;
      setColumns((prev) => [...prev, newCol]);
      toast.success("✅ Thêm danh sách thành công!");
      setAdding(false); // đóng form
    } catch (err: unknown) {
      const axiosErr = err as AxiosError;
      console.error("❌ Error:", axiosErr);

      if (axiosErr.response) {
        const status = axiosErr.response.status;

        if (status === 403) {
          toast.error("You don’t have permission to create this column");
        } else {
          toast.error("Failed to create column");
        }
      } else {
        toast.error("Network error. Please try again");
      }
    }
  };

  return (
    <div className="flex h-full min-w-full items-start gap-4 overflow-x-auto pb-6">
      {" "}
      {columns.map((col) => (
        <KanbanColumn key={col.id} column={col} />
      ))}
      {adding ? (
        <AddColumnCard onAdd={createColumn} onCancel={() => setAdding(false)} />
      ) : (
        <BtnAddColumn onClick={() => setAdding(true)} />
      )}
    </div>
  );
};

// import { useEffect, useState } from "react";
// import { BtnAddColumn } from "./BtnAddColumn";
// import { AddColumnCard } from "./AddColumnCard";
// import { KanbanColumn } from "./KanbanColumn";
// import { api } from "../../../api/axios";
// import toast from "react-hot-toast";
// import { useAppSelector } from "../../../state/hooks";

// type KanbanColumnDto = {
//   id: string;
//   title: string;
//   position: number;
//   tasks: TaskDto[];
// };

// type TaskDto = {
//   id: string;
//   taskTitle: string;
//   priority: string;
//   progressDisplay: string;
//   progress: number;
//   dateDue: string;
//   assignees: {
//     fullName: string;
//   }[];
// };

// type Props = {
//   workspaceId: string;
// };

// export const KanbanBoard = ({ workspaceId }: Props) => {

//   const [adding, setAdding] = useState(false);
//   const [columns, setColumns] = useState<KanbanColumnDto[]>([]);

//   const token = useAppSelector((state) => state.auth.token);

//   useEffect(() => {
//     if (!workspaceId || !token) return;

//     api
//       .get(`/api/kanban/${workspaceId}/kanban-board`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setColumns(res.data.data.columns))
//       .catch((err) => {
//         console.error("❌ API lỗi:", err);
//         toast.error("Không thể truy cập bảng Kanban (403)");
//       });
//   }, [workspaceId, token]);

//   return (
//     <div className="flex h-full min-w-full items-start gap-4 overflow-x-auto pb-6">
//       {" "}
//       {columns.map((col) => (
//         <KanbanColumn key={col.id} column={col} />
//       ))}
//       {adding ? (
//         <AddColumnCard
//           onAdd={() => {}} // bạn sẽ thêm createColumn sau
//           onCancel={() => setAdding(false)}
//         />
//       ) : (
//         <BtnAddColumn onClick={() => setAdding(true)} />
//       )}
//     </div>
//   );
// };
