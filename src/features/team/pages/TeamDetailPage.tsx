import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { KanbanBoard } from "../components/KanbanBoard";
import { TeamHeader } from "../components/TeamHeader";
import { TeamFileList } from "../components/TeamFileList";
import { fetchTeamAttachments } from "../commentSlice";
import { TeamMemberList } from "../components/TeamMemberList";
import { fetchTeamDetailThunk } from "../teamSlice"; // 👈 nhớ import nè

export const TeamDetailPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const teamDetail = useAppSelector((state) => state.team.teamDetail); // 👈 lấy từ Redux

  const [activeTab, setActiveTab] = useState<"Board" | "Member" | "File">("Board");

  useEffect(() => {
    if (!id || !token) return;
    dispatch(fetchTeamDetailThunk(id)); // 👈 lấy thông tin nhóm
    dispatch(fetchTeamAttachments({ teamId: id, token })); // 👈 lấy file
  }, [id, token, dispatch]);

  if (!teamDetail)
    return <div className="p-6 text-white">Đang tải thông tin nhóm...</div>;

  return (
    <div className="flex h-full w-full flex-col bg-white p-8 shadow-xl">
      <TeamHeader
        teamName={teamDetail.teamName}
        description={teamDetail.description}
        teamId={teamDetail.id}
      />
      {/* Tabs */}
      <div className="mt-4 flex gap-2">
        {["Board", "Member", "File"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "Board" | "Member" | "File")}
            className={`rounded-t-md rounded-b-none px-3 py-1 text-sm font-semibold transition-colors duration-200 ${
              activeTab === tab
                ? "bg-yellow-200 text-yellow-800"
                : "text-gray-400 hover:bg-yellow-100 hover:text-yellow-700"
            }`}
          >
            {tab === "Board" ? "Board" : tab === "Member" ? "Team" : "Files"}
          </button>
        ))}
      </div>
      {/* Tab content */}
      <div className="mt-[-1px] h-full w-full rounded-tr-md rounded-b-md bg-gray-50 p-4">
        {activeTab === "Board" && (
          <KanbanBoard workspaceId={teamDetail.id} activeTab={"Board"} />
        )}
        {activeTab === "Member" && <TeamMemberList />}
        {activeTab === "File" && <TeamFileList />}
      </div>
    </div>
  );
};