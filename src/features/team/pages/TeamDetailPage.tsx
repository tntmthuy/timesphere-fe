import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios, { AxiosError } from "axios";
import { useAppSelector } from "../../../state/hooks";
import { useDispatch } from "react-redux";
import { updateTeamName } from "../teamSlice";
import { TeamMemberCard } from "../components/TeamMemberCard";
import { KanbanColumn } from "../components/KanbanColumn";

type Member = {
  userId: string;
  fullName: string;
  email: string;
  teamRole: "OWNER" | "MEMBER";
};

type Team = {
  id: string;
  teamName: string;
  description?: string;
  members: Member[];
  createdById: string;
};

export const TeamDetailPage = () => {
  const { id } = useParams();
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!id || !token) return;

    axios
      .get(`/api/teams/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTeam(res.data.data);
        setNewName(res.data.data.teamName);
      })
      .catch((err) => console.error("Lỗi fetch:", err))
      .finally(() => setLoading(false));
  }, [id, token]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleRename = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !newName || newName === team?.teamName) return;

    try {
      const res = await axios.put(
        `/api/teams/${team!.id}/name`,
        { newName },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTeam(res.data.data);
      dispatch(updateTeamName({ id: team!.id, newName })); // 🧠 Update Redux
      setIsEditing(false);
    } catch (err) {
      const axiosErr = err as AxiosError;

      if (axiosErr.response?.status === 403) {
        alert(
          "Bạn không có quyền đổi tên nhóm. Chỉ trưởng nhóm mới được phép thực hiện thao tác này.",
        );
      } else {
        alert("Đổi tên thất bại. Vui lòng thử lại sau.");
      }

      console.error("Lỗi khi đổi tên:", axiosErr);
    }
  };

  if (loading) return <div className="p-6 text-white">Đang tải dữ liệu...</div>;
  if (!team)
    return <div className="p-6 text-red-400">Không tìm thấy nhóm!</div>;

  return (
    <div className="min-h-full rounded-2xl bg-white p-8 shadow-xl">
      {isEditing ? (
        <input
          ref={inputRef}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleRename}
          onBlur={() => setIsEditing(false)}
          className="mb-2 border-b border-gray-300 bg-transparent text-2xl font-bold text-gray-900 transition-colors outline-none focus:border-gray-500"
        />
      ) : (
        <div
          className="group mb-2 flex cursor-pointer items-center gap-2 select-none"
          onClick={() => setIsEditing(true)}
        >
          <h1 className="text-2xl font-bold text-gray-900">{team.teamName}</h1>
          <span className="text-gray-400 opacity-0 transition-opacity group-hover:opacity-100">
            🖊
          </span>
        </div>
      )}

      {team.description && (
        <p className="mb-6 text-sm text-gray-600">{team.description}</p>
      )}

      <h2 className="mb-3 text-lg font-semibold">Thành viên</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {team.members.map((m) => (
          <TeamMemberCard
            key={m.userId}
            fullName={m.fullName}
            email={m.email}
            teamRole={m.teamRole}
          />
        ))}
      </div>

      <h2 className="mt-8 mb-4 text-lg font-semibold text-gray-800">
        Bảng công việc
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        <KanbanColumn
          title="To Do"
          initialTasks={[{ id: "1", title: "Viết báo cáo" }]}
        />
        <KanbanColumn
          title="In Progress"
          initialTasks={[{ id: "2", title: "Tìm hiểu chủ đề" }]}
        />
      </div>
    </div>
  );
};
