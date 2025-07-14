//src\features\team\components\AssigneePicker.tsx
import { useState, type ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { searchMembersInTeamThunk } from "../../team/teamSlice";

type Props = {
  teamId: string;
};

export const AssigneePicker = ({ teamId }: Props) => {
  const dispatch = useAppDispatch();
  const { searchResults, searchError } = useAppSelector((state) => state.team);
  const [keyword, setKeyword] = useState("");

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

      <input
        type="text"
        value={keyword}
        onChange={handleSearch}
        placeholder="Type an assignee..."
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-black focus:outline-none"
      />

      {searchError === "UNAUTHORIZED" && keyword.trim() !== "" && (
        <p className="mt-1 text-sm text-red-500">
          Permission denied to search members.
        </p>
      )}

      {searchResults.length > 0 && (
        <ul className="mt-2 max-h-60 overflow-y-auto rounded-md border bg-white shadow-md">
          {searchResults.map((member) => (
            <li
              key={member.memberId}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
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
      )}
    </div>
  );
};
