//src\features\team\components\AssigneePicker.tsx
import { useState, type ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import {
  assignMemberToTaskThunk,
  searchMembersInTeamThunk,
} from "../../team/teamSlice";
import toast from "react-hot-toast";
import { updateTaskLocal } from "../kanbanSlice";
import type { TaskDto } from "../task";

type Props = {
  teamId: string;
  task: TaskDto;
};
export const AssigneePicker = ({ teamId, task }: Props) => {
  const dispatch = useAppDispatch();
  const { searchResults, searchError } = useAppSelector((state) => state.team);
  const [keyword, setKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  console.log("🧾 Assignees:", task.assignees);
  console.log("🔍 Search results:", searchResults);
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("teamId used for search:", teamId);
    setKeyword(value);
    dispatch(searchMembersInTeamThunk({ teamId, keyword: value }));
  };

  return (
    <div className="space-y-1">
      <label className="block text-[10px] font-semibold text-gray-600 uppercase">
        Assign a person
      </label>
      <div className="relative">
        <input
          type="text"
          value={keyword}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setKeyword(""); // 👈 reset luôn input khi blur
          }}
          placeholder="Type an assignee..."
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400"
        />

        {searchError === "UNAUTHORIZED" && keyword.trim() !== "" && (
          <p className="mt-1 text-sm text-red-500">
            Permission denied to search members.
          </p>
        )}

        <ul className="absolute z-50 mt-2 max-h-60 w-full rounded-md bg-white shadow-md">
          {isFocused &&
            keyword.trim() !== "" &&
            searchResults
              .filter(
                (member) =>
                  !task.assignees?.some((a) => a.userId === member.userId),
              )
              .slice(0, 3)
              .map((member) => (
                <li
                  key={member.memberId}
                  onMouseDown={() => {
                    dispatch(
                      assignMemberToTaskThunk({
                        taskId: task.id,
                        memberId: String(member.memberId),
                      }),
                    )
                      .unwrap()
                      .then((updatedTask) => {
                        dispatch(updateTaskLocal(updatedTask)); // ⬅️ cập nhật lại task vào kanbanSlice
                        toast.success("Đã gán thành viên!");
                      })
                      .catch(() => toast.error("Gán thất bại"));

                    setKeyword("");
                  }}
                  className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-50"
                >
                  <img
                    src={member.avatarUrl ?? "/images/avatar-default.png"}
                    alt="Avatar"
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{member.fullName}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </li>
              ))}
        </ul>
      </div>
      {task?.assignees && task.assignees.length > 0 && (
        <div className="mt-3 space-y-1">
          <label className="block text-[10px] font-semibold text-gray-600 uppercase">
            Assigned Members
          </label>

          <div className="flex max-h-40 flex-col gap-2 overflow-y-auto rounded bg-white p-1">
            {task.assignees.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between gap-2 rounded bg-gray-100 px-2 py-1 hover:bg-gray-200"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={member.avatarUrl ?? "/images/avatar-default.png"}
                    alt={member.fullName}
                    className="h-6 w-6 rounded-full border border-gray-300 object-cover"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {member.fullName}
                  </span>
                </div>

                {/* ❌ Nút chỉ để hiển thị */}
                <button
                  disabled
                  className="cursor-default rounded px-2 py-1 text-xs text-gray-300 hover:text-red-400"
                  title="Unassign (UI-only)"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
