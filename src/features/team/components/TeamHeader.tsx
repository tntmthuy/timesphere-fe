import { EditableText } from "./EditableText";
import { useAppSelector } from "../../../state/hooks";
import { useDispatch } from "react-redux";
import { updateTeamName } from "../teamSlice";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import InvitePopup from "./InvitePopup";

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
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // const handleInvite = (email: string) => {
  //   console.log("📧 Invite sent to:", email);
  //   // TODO: call backend invite API
  // };

  //out
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

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
          <div className="relative flex items-center gap-3">
            <button
              className="rounded-md bg-yellow-200 px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-[#fbe89e]"
              onClick={() => setIsInviteOpen((prev) => !prev)}
            >
              +Invite
            </button>

            {isInviteOpen && (
              <InvitePopup
                onClose={() => setIsInviteOpen(false)}
                teamId={teamId}
              />
            )}
          </div>
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 cursor-pointer text-gray-500"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>

            {showMenu && (
              <div
                ref={menuRef}
                className="absolute top-8 right-0 z-50 w-fit rounded-md border border-gray-200 bg-white text-sm shadow-lg"
              >
                <button
                  className="block px-3 py-1.5 text-left text-gray-100 rounded-sm bg-red-600 font-extrabold transition hover:bg-red-800"
                  onClick={() => {
                    // TODO: handle leave team
                    setShowMenu(false);
                  }}
                >
                  Exit
                </button>
              </div>
            )}
          </div>
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
