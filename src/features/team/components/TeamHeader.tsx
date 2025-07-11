import { EditableText } from "./EditableText";
import { useAppSelector } from "../../../state/hooks";
import { useDispatch } from "react-redux";
import { updateTeamName } from "../teamSlice";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  teamName: string;
  description?: string;
  teamId: string;
};

export const TeamHeader = ({ teamName, description, teamId }: Props) => {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  // ✅ dùng state nội bộ để UI cập nhật đúng sau khi sửa
  const [title, setTitle] = useState(teamName);
  const [desc, setDesc] = useState(description || "");

  useEffect(() => {
    setTitle(teamName);
  }, [teamName]);

  useEffect(() => {
    setDesc(description || "");
  }, [description]);

  const updateTeamInfo = async (payload: {
    newName?: string;
    description?: string;
  }) => {
    try {
      const res = await fetch(`/api/teams/${teamId}/name`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newName: payload.newName ?? title,
          description: payload.description ?? desc,
        }),
      });

      const data = await res.json();
      console.log("Team updated:", data);

      // ✅ cập nhật state sau khi sửa
      if (payload.newName) {
        dispatch(updateTeamName({ id: teamId, newName: payload.newName }));
        setTitle(payload.newName);
      }

      if (payload.description !== undefined) {
        setDesc(payload.description);
      }
    } catch (err) {
      toast.error("You don't have permission to update this group.");
      console.error("Lỗi cập nhật:", err);
    }
  };

  return (
    <div className="mb-6 space-y-2">
      {/* 🔹 Tiêu đề nhóm + nút */}
      <div className="flex items-center justify-between">
        <EditableText
          text={title}
          as="h2"
          tagClassName="text-2xl font-bold text-gray-900"
          inputClassName="text-2xl font-bold text-gray-900"
          onSubmit={(val) => updateTeamInfo({ newName: val })}
          placeholder="Team name"
        />
        <div className="flex items-center gap-3">
          <button className="rounded-md bg-yellow-200 px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-[#fbe89e]">
            +Invite
          </button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </div>
      </div>

      {/* 🔸 Mô tả nhóm */}

      <EditableText
        text={desc}
        as="p"
        tagClassName="text-sm text-gray-600" // 🔽 dùng text-sm thay vì text-base
        inputClassName="text-sm text-gray-600"
        onSubmit={(val) => updateTeamInfo({ description: val })}
        placeholder="Add a description..."
      />
    </div>
  );
};
