// //src\features\team\pages\TeamDetailPage.tsx

//src\features\team\pages\TeamDetailPage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "../../../state/hooks";
import { KanbanBoard } from "../components/KanbanBoard";
import { TeamHeader } from "../components/TeamHeader";
import { MemberList } from "../components/MemberList";
import { FileList } from "../components/FileList";

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
                ? " bg-yellow-200 text-yellow-800"
                : "text-gray-400 hover:bg-yellow-100 hover:text-yellow-700"
            }`}
          >
            {tab === "Board" ? "Board" : tab === "Member" ? "Team" : "Files"}
          </button>
        ))}
      </div>
      {/* Tab content */}
      <div className="mt-[-1px] h-full w-full rounded-tr-md rounded-b-md bg-gray-50 p-4">
        {activeTab === "Board" && <KanbanBoard workspaceId={team.id} activeTab={"Board"} />}
        {activeTab === "Member" && <MemberList />}
        {activeTab === "File" && <FileList />}
      </div>
    </div>
  );
};

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAppSelector } from "../../../state/hooks";
// import { KanbanBoard } from "../components/KanbanBoard";
// import { TeamHeader } from "../components/TeamHeader";

// type Member = {
//   userId: string;
//   fullName: string;
//   email: string;
//   teamRole: "OWNER" | "MEMBER";
// };

// type Team = {
//   id: string;
//   teamName: string;
//   description?: string;
//   members: Member[];
//   createdById: string;
// };

// export const TeamDetailPage = () => {
//   const { id } = useParams();
//   const token = useAppSelector((state) => state.auth.token);

//   const [team, setTeam] = useState<Team | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id || !token) return;

//     axios
//       .get(`/api/teams/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         setTeam(res.data.data);
//       })
//       .catch((err) => console.error("Lỗi fetch:", err))
//       .finally(() => setLoading(false));
//   }, [id, token]);

//   if (loading) return <div className="p-6 text-white">Đang tải dữ liệu...</div>;
//   if (!team)
//     return <div className="p-6 text-red-400">Không tìm thấy nhóm!</div>;

//   return (
//     <div className="flex h-full w-full flex-col bg-white p-8 shadow-xl">
//       {" "}
//       <TeamHeader
//         teamName={team.teamName}
//         description={team.description}
//         teamId={team.id}
//       />
//       <div className="flex flex-1 flex-col overflow-hidden">
//         <div className="flex max-w-[300px] items-center gap-2 pb-4">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="1.5"
//             stroke="currentColor"
//             className="h-4 w-4"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
//             />
//           </svg>
//           <h2 className="leading-none font-bold text-gray-800">
//             Bảng công việc
//           </h2>
//         </div>

//         <div className="flex flex-1 items-start gap-4 overflow-hidden">
//           <KanbanBoard workspaceId={team.id} />
//         </div>
//       </div>
//     </div>
//   );
// };
