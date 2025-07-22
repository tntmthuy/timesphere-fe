// ./features/dashboard/pages/DashboardPage.tsx

import { useAppSelector } from "../../../state/hooks";
import { Link } from "react-router-dom";
import { UserStatusCard } from "../components/UserStatusCard";

export const DashboardPage = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 px-20 py-14">
      {/* 🎯 Greeting */}
      <h1 className="mb-2 text-3xl font-bold text-slate-800">
        Welcome back, {user.firstname}
      </h1>
      <UserStatusCard user={user} />


      {/* 👥 Premium & FREE view */}
      {!user.isAdmin && (
        <>
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            Your Teams
          </h2>

          {user.role !== "PREMIUM" && (
            <Link
              to="/mainpage/upgrade"
              className="rounded bg-slate-100 px-4 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200"
            >
              Upgrade to unlock team creation
            </Link>
          )}
        </>
      )}

      {/* 🔐 Admin View */}
      {user.isAdmin && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            🔐 Admin Panel
          </h2>
          <Link
            to="/admin/users"
            className="mr-4 rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/teams"
            className="rounded bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-800"
          >
            View All Teams
          </Link>
        </div>
      )}
    </div>
  );
};
