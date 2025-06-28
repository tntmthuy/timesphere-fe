import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../state/hooks";
import { logoutThunk } from "../../features/auth/logoutThunks";
import { SidebarItem } from "./SidebarItem";
import { SidebarTeamList } from "./SidebarTeamList";

type SidebarProps = {
  onNewTeam: () => void;
};

export const Sidebar = ({ onNewTeam }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const teamSlugs = ["frontend-squad", "ux-warriors"];
  const pathname = location.pathname;

  const isTeamPath = pathname.startsWith("/mainpage/team/");
  const isTeamDetail = teamSlugs.some((slug) => pathname === `/mainpage/team/${slug}`);

  const active =
    pathname === "/mainpage/focus"
      ? "Focus"
      : pathname === "/mainpage/dashboard"
      ? "Dashboard"
      : isTeamPath && !isTeamDetail
      ? "My Teams"
      : null;

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  return (
    <aside className="flex h-screen w-64 flex-col justify-between bg-black px-4 py-6 text-white">
      <div>

        {/* nữa tách ra thành component profile */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#B3B1B0]" />
            <span className="text-sm font-medium">Profile</span>
          </div>
        </div>

        <nav className="space-y-1">
          <SidebarItem
            label="Focus"
            path="/mainpage/focus"
            isActive={active === "Focus"}
            icon={
              <svg className="w-5 h-5" stroke="currentColor" fill="none" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
              </svg>
            }
          />

          <SidebarItem
            label="Dashboard"
            path="/mainpage/dashboard"
            isActive={active === "Dashboard"}
            icon={
              <svg className="w-5 h-5" stroke="currentColor" fill="none" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25Z" />
              </svg>
            }
          />

          <SidebarTeamList isActive={active === "My Teams"} onNewTeam={onNewTeam} />
        </nav>
      </div>

      <div className="border-t border-[#444] pt-4 space-y-1">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-gray-400 hover:text-white uppercase transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15m-3 0-3-3m0 0l3-3m-3 3H15" />
          </svg>
          <span className="pl-1">Log out</span>
        </button>
      </div>
    </aside>
  );
};