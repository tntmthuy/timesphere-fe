import { useState } from "react";
import axios from "axios";
import { useAppSelector } from "../../../state/hooks";
import { SearchMemberInput } from "./SearchMemberInput";

type Props = {
  onClose: () => void;
};

export const CreateTeamModal = ({ onClose }: Props) => {
  const token = useAppSelector((state) => state.auth.token);
  const [form, setForm] = useState({ teamName: "", description: "" });
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8081/api/teams", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Tạo nhóm thành công!");
      setForm({ teamName: "", description: "" });
      // Tùy bạn: có thể gọi onClose() luôn ở đây để tự đóng modal
    } catch (error) {
      console.error(error);
      setMessage("❌ Tạo nhóm thất bại");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl bg-white text-black rounded-xl shadow-2xl border border-gray-200 overflow-auto max-h-[90vh] animate-fadeIn">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Tạo nhóm mới</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tên nhóm */}
          <div>
            <label className="block text-xs uppercase font-semibold text-gray-600 mb-1">
              Tên nhóm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="teamName"
              value={form.teamName}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFDE70]"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-xs uppercase font-semibold text-gray-600 mb-1">
              Mô tả nhóm
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFDE70]"
            />
          </div>

          {/* Mời thành viên */}
          <div>
            <label className="block text-xs uppercase font-semibold text-gray-600 mb-1">
              Mời thành viên
            </label>
            <SearchMemberInput />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-black text-white font-semibold text-sm px-4 py-2 rounded hover:bg-[#FFDE70] hover:text-black transition"
            >
              Tạo nhóm
            </button>
            {message && (
              <p className="mt-3 text-sm text-center">
                {message.startsWith("✅") ? (
                  <span className="text-green-600">{message}</span>
                ) : (
                  <span className="text-red-600">{message}</span>
                )}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};