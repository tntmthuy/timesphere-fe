import { useState, useEffect, useRef } from "react";

export const CommentItem = ({
  content,
  authorName = "Thùy",
  avatarUrl = "/avatar-thuy.png",
  commentId,
  activeMenuId,
  setActiveMenuId,
}: {
  content: string;
  authorName?: string;
  avatarUrl?: string;
  commentId: number;
  activeMenuId: number | null;
  setActiveMenuId: (id: number | null) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 💡 Đóng menu khi click ra ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setActiveMenuId]);

  const isLong = content.length > 200;
  const displayText =
    expanded || !isLong ? content : content.slice(0, 200) + "...";

  const isMenuOpen = activeMenuId === commentId;

  return (
    <div className="relative rounded border border-gray-200 bg-gray-50 px-3 py-2 text-[12px] text-gray-800 space-y-1">
      {/* 🧑👤 Hàng đầu: avatar + tên + icon ba chấm */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="h-5 w-5 rounded-full object-cover"
          />
          <span className="text-[11px] font-semibold text-gray-600">{authorName}</span>
        </div>

        {/* 📍 Icon ba chấm */}
        <button onClick={() => setActiveMenuId(commentId)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 text-gray-400"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 
              1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 
              3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 
              1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
            />
          </svg>
        </button>

        {/* 🧩 Popup menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-2 top-7 z-10 max-w-[70px] rounded bg-white shadow border border-gray-200 text-[12px] text-gray-700"
          >
            <button className="w-full px-3 py-1 hover:bg-gray-100 text-left">Edit</button>
            <button className="w-full px-3 py-1 hover:bg-gray-100 text-left">Update</button>
            <button className="w-full px-3 py-1 hover:bg-gray-100 text-left">Move</button>

          </div>
        )}
      </div>

      {/* 💬 Nội dung bình luận */}
      <div
        className={`break-words whitespace-pre-wrap ${
          expanded ? "max-h-[10rem] overflow-y-auto" : ""
        }`}
      >
        {displayText}
      </div>

      {/* 🔁 Nút toggle nếu dài */}
      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="text-[11px] text-blue-500 hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};
