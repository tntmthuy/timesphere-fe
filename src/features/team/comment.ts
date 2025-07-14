//src\features\team\comment.ts
export type Comment = {
  id: number;
  content: string;
  isCollapsed: boolean;
};

export type TaskCommentDTO = {
  id: string;
  content: string;
  createdById: string;
  createdByName: string;
  createdByAvatar: string;
  createdAt: string;
  updatedAt: string;
  visibility: "PUBLIC" | "PRIVATE";
  visibleToUserIds: string[];
  attachments: string[];
};