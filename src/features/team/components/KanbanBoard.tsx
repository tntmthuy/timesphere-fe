import { useEffect, useState } from "react";
import { BtnAddColumn } from "./BtnAddColumn";
import { AddColumnCard } from "./AddColumnCard";
import { KanbanColumn } from "./KanbanColumn";
import { api } from "../../../api/axios";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../state/hooks";

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

  return (
    <div className="flex h-full min-w-full items-start gap-4 overflow-x-auto pb-6">
      {" "}
      {columns.map((col) => (
        <KanbanColumn key={col.id} column={col} />
      ))}
      {adding ? (
        <AddColumnCard
          onAdd={() => {}} // bạn sẽ thêm createColumn sau
          onCancel={() => setAdding(false)}
        />
      ) : (
        <BtnAddColumn onClick={() => setAdding(true)} />
      )}
    </div>
  );
};
