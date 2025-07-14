//src\features\team\components\CommentInput.tsx
import { useRef, useEffect } from "react";

export const CommentInput = ({
  avatarUrl,
  value,
  onChange,
  onSubmit,
}: {
  avatarUrl?: string;
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 🎯 Auto resize height theo nội dung, max 4 dòng
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto"; // reset trước
      const maxLines = 4;
      const lineHeight = 24; // 1.5rem = 24px
      const maxHeight = maxLines * lineHeight;

      el.style.height = Math.min(el.scrollHeight, maxHeight) + "px"; // tăng dần → max, sau đó scroll
    }
  }, [value]);

  return (
    <div className="flex items-start gap-3">
      {/* 🧑 Avatar ngoài khung */}
      {/* <img
        src={avatarUrl ?? "/placeholder-avatar.png"}
        alt="Avatar"
        className="mt-[6px] h-6 w-6 rounded-full object-cover"
      /> */}

      {/* 💬 Khung input đầy đủ */}
      <div className="flex flex-grow flex-col items-start rounded border border-gray-300 bg-white px-3 py-2 focus-within:ring-1 focus-within:ring-black">
        {/* 🔔 Vùng Notify nằm riêng một dòng */}
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-700">
          <button
            className="rounded border border-gray-300 px-2 py-1 hover:bg-gray-50"
            onClick={() => {
              /* mở modal chọn người hoặc dropdown */
            }}
          >
            Notify
          </button>
          <span className="text-gray-500">Nobody</span>
        </div>

        {/* ✏️ Khung nhập + icon gửi nằm cùng dòng */}
        <div className="flex w-full items-start gap-2">
          <img
            src={avatarUrl ?? "/placeholder-avatar.png"}
            alt="Avatar"
            className=" h-6 w-6 rounded-full object-cover"
          />
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder="Write a comment..."
            rows={1}
            className="flex-grow resize-none overflow-y-auto border-none text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
            style={{
              lineHeight: "1.5rem", // 24px
              maxHeight: "6rem", // 4 dòng
            }}
          />

          {/* 📎 Icon tệp */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5 text-gray-700 hover:text-gray-500"
          >
            <path
              fill-rule="evenodd"
              d="M18.97 3.659a2.25 2.25 0 0 0-3.182 0l-10.94 10.94a3.75 3.75 0 1 0 5.304 5.303l7.693-7.693a.75.75 0 0 1 1.06 1.06l-7.693 7.693a5.25 5.25 0 1 1-7.424-7.424l10.939-10.94a3.75 3.75 0 1 1 5.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 0 1 5.91 15.66l7.81-7.81a.75.75 0 0 1 1.061 1.06l-7.81 7.81a.75.75 0 0 0 1.054 1.068L18.97 6.84a2.25 2.25 0 0 0 0-3.182Z"
              clip-rule="evenodd"
            />
          </svg>

          {/* 🟡 Nút gửi */}
          <button
            onClick={onSubmit}
            className="text-yellow-500 transition hover:text-yellow-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94c6.734-2.476 12.957-5.766 18.445-8.986a.75.75 0 0 0 0-1.218C16.435 7.882 10.212 4.592 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
