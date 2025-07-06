import { useState } from "react";

export const AddColumnCard = ({
  onAdd,
  onCancel,
}: {
  onAdd: (title: string) => void;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState("");

  return (
    <div className="w-[230px] flex-shrink-0 space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nhập tên danh sách..."
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
      <div className="flex items-center justify-between">
        <button
          className="mr-2 w-full rounded-md bg-yellow-200 px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-[#fbe89e]"
          onClick={() => onAdd(title)}
        >
          Thêm danh sách
        </button>
        <button
          className="px-2 text-base font-bold text-gray-400 hover:text-gray-600"
          onClick={onCancel}
        >
          ×
        </button>
      </div>
    </div>
  );
};
