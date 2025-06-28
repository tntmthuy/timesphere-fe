import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAppSelector } from "../../../state/hooks";

type UserSuggestion = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
};

export const SearchMemberInput = () => {
  const token = useAppSelector((state) => state.auth.token);
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [invited, setInvited] = useState<UserSuggestion[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch gợi ý
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!keyword.trim() || !token) return;
      try {
        const res = await axios.get(
          "http://localhost:8081/api/user/search-new-team",
          {
            params: { keyword },
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSuggestions(res.data.data);
      } catch (err) {
        console.error("Lỗi khi gợi ý thành viên:", err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [keyword, token]);

  // Đóng gợi ý khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAdd = (user: UserSuggestion) => {
    if (invited.some((u) => u.id === user.id)) return;
    setInvited((prev) => [...prev, user]);
    setKeyword("");
    setSuggestions([]);
  };

  const handleRemove = (id: string) => {
    setInvited((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div ref={containerRef} className="relative space-y-2">
      {/* 🔍 Thanh tìm */}
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Tìm theo tên hoặc email..."
        className="w-full rounded border px-3 py-2 text-sm"
      />

      {/* 📍 Gợi ý người dùng */}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border bg-white text-sm text-black shadow">
          {suggestions.map((user) => (
            <li
              key={user.id}
              onClick={() => handleAdd(user)}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100"
            >
              <span className="font-medium">{user.fullName}</span> –{" "}
              {user.email}
            </li>
          ))}
        </ul>
      )}

      {/* 👥 Danh sách thành viên được mời */}
      {invited.length > 0 && (
        <div className="mt-4">
          <ul className="space-y-1">
            <div className="mt-4">
              <p className="mb-1 text-sm font-semibold text-gray-700">
                💡 Thành viên được mời:
              </p>
              <div className="flex flex-wrap gap-2">
                {invited.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      {/* Avatar hoặc fallback icon */}
                      {u.avatarUrl ? (
                        <img
                          src={u.avatarUrl}
                          alt={u.fullName}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs font-medium">
                          {u.fullName?.charAt(0) || "?"}
                        </div>
                      )}
                      <span className="max-w-[120px] truncate font-medium">
                        {u.fullName}
                      </span>
                    </div>
                    {/* Nút xoá */}
                    <button
                      onClick={() => handleRemove(u.id)}
                      className="text-gray-400 transition hover:text-red-600"
                      title="Gỡ khỏi danh sách"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
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
                ))}
              </div>
            </div>
          </ul>
        </div>
      )}
    </div>
  );
};
