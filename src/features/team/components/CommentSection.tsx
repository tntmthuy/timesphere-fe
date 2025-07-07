import { useState } from "react";
import { CommentItem } from "./CommentItem";
import { CommentInput } from "./CommentInput";

type Comment = {
  id: number;
  content: string;
};

export const CommentSection = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed) {
      const newComment: Comment = {
        id: Date.now(),
        content: trimmed,
      };
      setComments((prev) => [...prev, newComment]);
      setInput("");
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-semibold text-gray-600 uppercase">
        Comment
      </label>

      {/* 📋 Danh sách comment có toggle */}
      <div className="max-h-[200px] space-y-2 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-[12px] text-gray-500 italic">No comment yet.</p>
        ) : (
          comments.map((c) => (
            <CommentItem
              key={c.id}
              content={c.content}
              authorName="Thùy"
              avatarUrl="/avatar-thuy.png"
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
              commentId={c.id}
            />
          ))
        )}
      </div>

      {/* ✍️ Input bình luận */}
      <CommentInput
        avatarUrl="/avatar-thuy.png"
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
