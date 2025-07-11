import { useState } from "react";
import axios from "axios";
import { useAppSelector } from "../../../state/hooks";
import { SearchMemberInput } from "./SearchMemberInput";
import toast from "react-hot-toast";

type Props = {
  onClose: () => void;
};

interface AxiosErrorWithMessage {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const CreateTeamModal = ({ onClose }: Props) => {
  const token = useAppSelector((state) => state.auth.token);
  const [form, setForm] = useState({ teamName: "", description: "" });
  // const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8081/api/teams", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Success! A new team is now ready.");
      setForm({ teamName: "", description: "" });
      onClose(); // Tùy bạn: đóng modal luôn nếu muốn
    } catch (error) {
      const apiMessage = (error as AxiosErrorWithMessage)?.response?.data
        ?.message;

      if (apiMessage === "TEAM_CREATE_LIMIT_FOR_FREE_USER") {
        toast.error(
          "🚫 Bạn đã đạt giới hạn nhóm ở gói FREE. Vui lòng nâng cấp tài khoản để tạo thêm nhóm.",
        );
      } else if (apiMessage === "TEAM_NAME_REQUIRED") {
        toast.error("⚠️ Vui lòng nhập tên nhóm.");
      } else {
        toast.error("You’ve reached your team limit on the free plan.");
      }

      console.error("Tạo nhóm thất bại:", apiMessage || error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="animate-fadeIn relative z-10 max-h-[90vh] w-full max-w-xl overflow-auto rounded-xl border border-gray-200 bg-white text-black shadow-2xl">
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Create New Team</h2>
            <button
              onClick={onClose}
              className="text-gray-400 transition hover:text-black"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-4 h-px w-full bg-gray-300" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left Column: Team name + description */}
            <div className="space-y-5">
              <div>
                <label className="mb-1 block text-[10px] font-semibold text-gray-600 uppercase">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="teamName"
                  placeholder="Team name"
                  value={form.teamName}
                  onChange={handleChange}
                  required
                  className="w-full rounded border px-3 py-2.5 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold text-gray-600 uppercase">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Add a description..."
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="min-h-[112px] w-full rounded border px-3 py-2.5 text-sm focus:ring-1 focus:ring-black focus:outline-none"
                />
              </div>
            </div>

            {/* Right Column: Invite members */}
            <div className="space-y-5">
              <div>
                <label className="mb-1 block text-[10px] font-semibold text-gray-600 uppercase">
                  Invite Members
                </label>
                <SearchMemberInput />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full rounded bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#FFDE70] hover:text-black"
            >
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
