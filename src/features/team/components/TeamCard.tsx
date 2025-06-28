
export const TeamCard = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 w-full max-w-md space-y-4">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">🧑‍🤝‍🧑 Team Copilot</h2>
        <span className="text-sm text-gray-500">ID: #42</span>
      </div>

      {/* Mô tả */}
      <p className="text-sm text-gray-600">
        Một nhóm phát triển frontend hiện đại, tập trung vào TypeScript và UI sexy ✨
      </p>

      {/* Avatar thành viên (rỗng) */}
      <div className="flex -space-x-3 pt-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"
          />
        ))}
      </div>

      {/* Thông tin phụ */}
      <div className="flex justify-between text-sm text-gray-500 pt-4">
        <span>👥 4 members</span>
        <span>📅 Created: 27/06/2025</span>
      </div>
    </div>
  );
};