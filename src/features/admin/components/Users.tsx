import { useState } from "react";

type RoleType = "FREE" | "PREMIUM" | "ADMIN";

type UserItem = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  role: RoleType;
};

const mockUsers: UserItem[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a@example.com",
    createdAt: "2025-07-20",
    role: "FREE",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "b@example.com",
    createdAt: "2025-07-21",
    role: "ADMIN",
  },
  {
    id: 3,
    name: "Phạm Văn C",
    email: "c@example.com",
    createdAt: "2025-07-22",
    role: "PREMIUM",
  },
];

export const Users = () => {
  const [users, setUsers] = useState<UserItem[]>(mockUsers);
  const [search, setSearch] = useState("");

  const handleDelete = (id: number) => {
    const confirmed = confirm("Bạn có chắc muốn xóa người dùng này?");
    if (confirmed) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleRoleChange = (id: number, newRole: RoleType) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, role: newRole } : user)),
    );
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-yellow-50 p-8 text-yellow-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">👥 Quản lý người dùng</h1>
        <p className="mt-2 text-sm text-yellow-700">
          A quick snapshot of all registered users in the system.
        </p>
        <div className="mt-2 flex gap-2">
          {[...Array(3)].map((_, idx) => (
            <span key={idx} className="h-2 w-2 rounded-full bg-yellow-400" />
          ))}
        </div>
        <p className="mt-6 rounded-md bg-amber-200 p-3 font-semibold">
          Đây là danh sách <strong>tất cả người dùng</strong> hiện có trong hệ
          thống.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Tìm theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none md:w-96"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-md bg-white shadow-md">
        <table className="w-full text-left text-sm">
          <thead className="bg-yellow-200 font-semibold text-yellow-900">
            <tr>
              <th className="px-4 py-2">🆔 ID</th>
              <th className="px-4 py-2">👤 Tên</th>
              <th className="px-4 py-2">📧 Email</th>
              <th className="px-4 py-2">📅 Ngày tạo</th>
              <th className="px-4 py-2">🔐 Vai trò</th>
              <th className="px-4 py-2 text-center">⚙️ Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-4 text-center text-gray-500 italic"
                >
                  Không tìm thấy người dùng.
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b transition hover:bg-yellow-50"
                >
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.createdAt}</td>
                  <td className="px-4 py-2">
                    {user.role === "ADMIN" ? (
                      <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                        ADMIN
                      </span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value as RoleType)
                        }
                        className={`rounded border px-2 py-1 text-xs font-semibold transition ${
                          user.role === "PREMIUM"
                            ? "border-yellow-300 bg-yellow-100 text-yellow-800"
                            : "border-green-300 bg-green-100 text-green-700"
                        }`}
                      >
                        <option
                          value="FREE"
                          style={{
                            backgroundColor: "#dcfce7", // xanh lá nhạt (bg-green-100)
                            color: "#15803d", // chữ xanh (text-green-700)
                          }}
                        >
                          FREE
                        </option>
                        <option
                          value="PREMIUM"
                          style={{
                            backgroundColor: "#fef9c3", // vàng nhạt (bg-yellow-100)
                            color: "#b45309", // chữ vàng đậm (text-yellow-800)
                          }}
                        >
                          PREMIUM
                        </option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {user.role === "ADMIN" ? (
                      <span className="text-xs text-gray-400 italic">
                        Không thể thao tác
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-sm text-red-600 transition hover:text-red-700 hover:underline"
                      >
                        🗑 Xóa
                      </button>
                    )}
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
