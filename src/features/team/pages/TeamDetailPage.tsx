// //src\features\team\pages\TeamDetailPage.tsx

//src\features\team\pages\TeamDetailPage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { KanbanBoard } from "../components/KanbanBoard";
import { TeamHeader } from "../components/TeamHeader";
import { MemberList } from "../components/MemberList";
import { TeamFileList } from "../components/TeamFileList";
import { fetchTeamAttachments } from "../commentSlice";

type Member = {
  userId: string;
  fullName: string;
  email: string;
  teamRole: "OWNER" | "MEMBER";
};

type Team = {
  id: string;
  teamName: string;
  description?: string;
  members: Member[];
  createdById: string;
};

export const TeamDetailPage = () => {
  const { id } = useParams();
  const token = useAppSelector((state) => state.auth.token);

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"Board" | "Member" | "File">(
    "Board",
  );

  useEffect(() => {
    if (!id || !token) return;

    axios
      .get(`/api/teams/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTeam(res.data.data);
      })
      .catch((err) => console.error("Lỗi fetch:", err))
      .finally(() => setLoading(false));
  }, [id, token]);

  //file
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!id || !token) return;

    dispatch(fetchTeamAttachments({ teamId: id, token }));
  }, [id, token, dispatch]);

  if (loading) return <div className="p-6 text-white">Đang tải dữ liệu...</div>;
  if (!team)
    return <div className="p-6 text-red-400">Không tìm thấy nhóm!</div>;

  return (
    <div className="flex h-full w-full flex-col bg-white p-8 shadow-xl">
      {" "}
      <TeamHeader
        teamName={team.teamName}
        description={team.description}
        teamId={team.id}
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
          <KanbanBoard workspaceId={team.id} activeTab={"Board"} />
        )}
        {activeTab === "Member" && <MemberList />}
        {activeTab === "File" && <TeamFileList />}
      </div>
    </div>
  );
};
