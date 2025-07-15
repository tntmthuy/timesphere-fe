import { useState, useEffect, useRef } from "react";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const CommentItem = ({
  content,
  authorName,
  avatarUrl = "/avatar-thuy.png",
  commentId,
  activeMenuId,
  setActiveMenuId,
  visibility,
  createdAt,
}: {
  content: string;
  authorName?: string;
  avatarUrl?: string;
  commentId: string;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  visibility?: "PUBLIC" | "PRIVATE"; // ⬅️ thêm dòng này
  createdAt?: string;
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
    <div className="relative space-y-1 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-[12px] text-gray-800">
      {/* 🧑👤 Hàng đầu: avatar + tên + icon ba chấm */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="h-5 w-5 rounded-full object-cover"
          />
          <span className="text-[11px] font-semibold text-gray-600">
            {authorName}
          </span>
          {visibility === "PRIVATE" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-3 text-gray-400"
            >
              <path
                fill-rule="evenodd"
                d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                clip-rule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* 📍 Icon ba chấm */}
        <div className="flex items-center">
          {createdAt && (
            <p className="text-[10px] text-gray-500 italic">
              {formatDate(createdAt)}
            </p>
          )}
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
        </div>

        {/* 🧩 Popup menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute top-7 right-2 z-10 max-w-[70px] rounded border border-gray-200 bg-white text-[12px] text-gray-700 shadow"
          >
            <button className="w-full px-3 py-1 text-left hover:bg-gray-100">
              Edit
            </button>
            <button className="w-full px-3 py-1 text-left hover:bg-gray-100">
              Update
            </button>
            <button className="w-full px-3 py-1 text-left hover:bg-gray-100">
              Move
            </button>
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
