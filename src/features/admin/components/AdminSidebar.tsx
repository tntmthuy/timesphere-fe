import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../state/hooks";
import { logoutThunk } from "../../auth/logoutThunks";
import { AdminProfile } from "./AdminProfile";
import { ProfileDetailModal } from "../../sidebar/components/ProfileDetailModal";
 // dùng lại Modal

export const AdminSidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-slate-800 text-white p-6 flex flex-col justify-between h-screen">
      <div className="space-y-4">
        <div
          className="cursor-pointer rounded-md p-2 hover:bg-slate-700 transition"
          onClick={() => setShowProfileModal(true)}
        >
          <AdminProfile />
        </div>

        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="relative w-[600px] rounded-md bg-white shadow-lg">
              <ProfileDetailModal />
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-3 right-3 text-lg font-black text-gray-800 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-4">
          <NavLink to="/admin" className="hover:text-green-400">Dashboard</NavLink>
          <NavLink to="/admin/users" className="hover:text-green-400">Users</NavLink>
          <NavLink to="/admin/teams" className="hover:text-green-400">Teams</NavLink>
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-600">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white transition"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15m-3 0-3-3m0 0l3-3m-3 3H15"
            />
          </svg>
          <span className="pl-1">Log out</span>
        </button>
      </div>
    </aside>
  );
};