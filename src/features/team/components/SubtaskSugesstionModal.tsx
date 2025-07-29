import type { FC } from "react";

type SuggestedSubtask = {
  id: string;
  title: string;
  isSelected: boolean;
};

type Props = {
  isOpen: boolean;
  suggestions: SuggestedSubtask[];
  onToggleSelect: (id: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export const SubtaskSuggestionModal: FC<Props> = ({
  isOpen,
  suggestions,
  onToggleSelect,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-[320px] max-w-sm rounded-xl bg-white px-5 py-5 text-left shadow-xl">
        {/* ❌ Nút Close */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 transition hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ✨ Tiêu đề modal */}
        <h2 className="mb-2 text-sm font-semibold text-gray-800">Gợi ý sub-task từ AI</h2>

        {/* 📦 Danh sách gợi ý */}
        {isLoading ? (
          <div className="text-sm text-gray-500">Đang tải gợi ý...</div>
        ) : suggestions.length === 0 ? (
          <div className="text-sm text-gray-400">Không có gợi ý nào</div>
        ) : (
          <ul className="mb-4 space-y-2 max-h-56 overflow-auto pr-1">
            {suggestions.map((item) => (
              <li key={item.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.isSelected}
                  onChange={() => onToggleSelect(item.id)}
                  className="h-4 w-4 accent-yellow-500"
                />
                <span
                  className={`text-sm ${
                    item.isSelected ? "line-through text-gray-400" : "text-gray-700"
                  }`}
                >
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* ✅ Hai nút xác nhận */}
        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={onConfirm}
            disabled={!suggestions.some((s) => s.isSelected)}
            className="w-28 rounded-3xl border border-b-4 border-yellow-500 px-4 py-1.5 text-sm font-bold text-yellow-800 transition hover:bg-yellow-300 disabled:opacity-40"
          >
            Thêm
          </button>
          <button
            onClick={onCancel}
            className="w-28 rounded-3xl px-4 py-1.5 text-xs text-yellow-700 transition hover:text-yellow-500"
          >
            Huỷ
          </button>
        </div>
      </div>
    </div>
  );
};