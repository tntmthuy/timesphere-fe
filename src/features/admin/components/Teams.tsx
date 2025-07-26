import { useState } from "react";

type TeamItem = {
  id: number;
  name: string;
  members: number;
  tasks: number;
  files: number;
};

const mockTeams: TeamItem[] = [
  { id: 1, name: "Design Squad", members: 5, tasks: 12, files: 8 },
  { id: 2, name: "Backend Ops", members: 4, tasks: 19, files: 14 },
  { id: 3, name: "Frontend Crew", members: 6, tasks: 15, files: 10 }
];

export const Teams = () => {
  const [teams, setTeams] = useState<TeamItem[]>(mockTeams);

  const handleDelete = (id: number) => {
    const confirmed = confirm("Xác nhận xóa nhóm này?");
    if (confirmed) {
      setTeams((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-8 text-yellow-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">👥 Quản lý nhóm</h1>
        <p className="mt-2 text-sm text-yellow-700">
          Danh sách các nhóm đã tạo và thông tin tổng quát.
        </p>
        <div className="mt-2 flex gap-2">
          {[...Array(3)].map((_, idx) => (
            <span key={idx} className="h-2 w-2 rounded-full bg-yellow-400" />
          ))}
        </div>
        <p className="mt-6 rounded-md bg-amber-200 p-3 font-semibold">
          Có tổng <strong>{teams.length}</strong> nhóm đang hoạt động.
        </p>
      </div>

      {/* Bảng nhóm */}
      <div className="overflow-x-auto rounded-md shadow-md bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-yellow-200 text-yellow-900 font-semibold">
            <tr>
              <th className="px-4 py-2">📁 Tên nhóm</th>
              <th className="px-4 py-2">👤 Thành viên</th>
              <th className="px-4 py-2">📋 Task</th>
              <th className="px-4 py-2">🗂 File</th>
              <th className="px-4 py-2 text-center">⚙️ Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500 italic">
                  Không có nhóm nào.
                </td>
              </tr>
            ) : (
              teams.map((team) => (
                <tr key={team.id} className="border-b hover:bg-yellow-50 transition">
                  <td className="px-4 py-2">{team.name}</td>
                  <td className="px-4 py-2">{team.members}</td>
                  <td className="px-4 py-2">{team.tasks}</td>
                  <td className="px-4 py-2">{team.files}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(team.id)}
                      className="text-red-600 hover:text-red-700 hover:underline transition text-sm"
                    >
                      🗑 Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};