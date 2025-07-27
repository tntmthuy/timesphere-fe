import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { fetchTeamSummaryList } from "../adminSlice";
import { Pagination } from "../components/Pagination";

const ITEMS_PER_PAGE = 10;

function getColorFromName(name: string): string {
  const colors = [
    "bg-blue-400", "bg-green-400", "bg-yellow-400", "bg-pink-400",
    "bg-purple-400", "bg-indigo-400", "bg-red-400", "bg-teal-400",
  ];
  const index = name?.charCodeAt(0) % colors.length;
  return colors[index];
}

export const Teams = () => {
  const dispatch = useAppDispatch();
  const teams = useAppSelector((state) => state.admin.teams);
  const loading = useAppSelector((state) => state.admin.loadingTeams);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((teams?.length ?? 0) / ITEMS_PER_PAGE);
  const paginatedTeams = teams?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    dispatch(fetchTeamSummaryList());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-yellow-50 p-8 text-yellow-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">👥 Team Management</h1>
        <p className="mt-2 text-sm text-yellow-700">
          Overview of all created teams and their details.
        </p>
        <div className="mt-2 flex gap-2">
          {[...Array(3)].map((_, idx) => (
            <span key={idx} className="h-2 w-2 rounded-full bg-yellow-400" />
          ))}
        </div>
        <p className="mt-6 rounded-md bg-amber-200 p-3 font-semibold">
          A total of <strong>{teams?.length ?? 0}</strong> teams are currently active.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md bg-white shadow-md">
        <table className="w-full min-w-[1200px] text-sm text-center">
          <thead className="bg-yellow-200 font-semibold text-yellow-900">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Creator</th>
              <th className="px-4 py-2">Owner</th>
              <th className="px-4 py-2">Members</th>
              <th className="px-4 py-2">Tasks</th>
              <th className="px-4 py-2">Comments</th>
              <th className="px-4 py-2">Files</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="py-4 italic text-yellow-600">Loading data...</td>
              </tr>
            ) : paginatedTeams?.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-4 italic text-gray-500">No teams found.</td>
              </tr>
            ) : (
              paginatedTeams?.map((team, idx) => (
                <tr key={team.teamId ?? idx} className="border-b hover:bg-yellow-50 transition">
                  <td className="w-64 px-4 py-2 text-left text-xs text-gray-700 whitespace-nowrap">
                    {team.teamId}
                  </td>
                  <td className="px-4 py-2 text-left">
                    {team.teamName ?? "Untitled"}
                  </td>
                  <td className="px-4 py-2">
                    {team.createdAt
                      ? new Date(team.createdAt).toLocaleDateString("en-GB")
                      : "Unknown"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      {team.createdByAvatarUrl ? (
                        <img
                          src={team.createdByAvatarUrl}
                          alt="creator"
                          title={team.createdBy ?? ""}
                          className="h-5 w-5 rounded-full"
                        />
                      ) : (
                        <div
                          title={team.createdBy ?? ""}
                          className={`flex h-6 w-6 items-center justify-center rounded-full font-semibold text-white ${getColorFromName(team.createdBy ?? "")}`}
                        >
                          {team.createdBy
                            ? team.createdBy.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      {team.ownerAvatarUrl ? (
                        <img
                          src={team.ownerAvatarUrl}
                          alt="owner"
                          title={team.ownerFullName ?? ""}
                          className="h-5 w-5 rounded-full"
                        />
                      ) : (
                        <div
                          title={team.ownerFullName ?? ""}
                          className={`flex h-6 w-6 items-center justify-center rounded-full font-semibold text-white ${getColorFromName(team.ownerFullName ?? "")}`}
                        >
                          {team.ownerFullName
                            ? team.ownerFullName.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">{team.members?.length ?? 0}</td>
                  <td className="px-4 py-2">{team.totalTasks ?? 0}</td>
                  <td className="px-4 py-2">{team.totalComments ?? 0}</td>
                  <td className="px-4 py-2">{team.totalFiles ?? 0}</td>
                  <td className="px-4 py-2">
                    <button className="text-sm text-red-600 hover:text-red-700 hover:underline">
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};