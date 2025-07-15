//src\features\team\components\CommentSection.tsx
import { useState } from "react";
import { CommentItem } from "./CommentItem";
// import { CommentInput } from "./CommentInput";
import type { TaskCommentDTO } from "../comment"; // ✅ import đúng kiểu từ BE

type CommentSectionProps = {
  isCollapsed?: boolean;
  hideInput?: boolean;
  comments: TaskCommentDTO[]; // ✅ chuẩn kiểu từ BE
  input?: string;
  onChangeInput?: (text: string) => void;
  onSubmit?: () => void;
};

export const CommentSection = ({
  isCollapsed = false,
  // hideInput = false,
  comments,
  // input = "",
  // onChangeInput,
  // onSubmit,
}: CommentSectionProps) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {/* 📋 Comment list — ẩn khi collapsed */}
      {!isCollapsed && (
        <div className="space-y-2 pr-1">
          {comments.length === 0 ? (
            <p className="text-[12px] text-gray-500 italic">No comment yet.</p>
          ) : (
            comments.map((c) => {
              // console.log("📎 Comment files:", c.attachedFiles); // ⬅️ thêm dòng này

              return (
                <CommentItem
                  key={c.id}
                  content={c.content}
                  authorName={c.createdByName}
                  avatarUrl={c.createdByAvatar}
                  activeMenuId={activeMenuId}
                  setActiveMenuId={setActiveMenuId}
                  commentId={c.id}
                  visibility={c.visibility}
                  createdAt={c.createdAt}
                  attachments={c.attachments}
                />
              );
            })
          )}
        </div>
      )}

      {/* ✍️ Input bình luận — render khi không bị ẩn */}
      {/* {!hideInput && (
        <div className="sticky bottom-0 bg-white pt-2">
          <CommentInput
            avatarUrl="/images/trash.jpg"
            value={input}
            onChange={onChangeInput ?? (() => {})}
            onSubmit={onSubmit ?? (() => {})}
          />
        </div>
      )} */}
    </div>
  );
};
