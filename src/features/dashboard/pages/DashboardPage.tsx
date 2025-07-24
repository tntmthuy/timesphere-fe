import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { useEffect } from "react";
import { fetchAllUserFocusStatsThunk } from "../../focus/focusSlice";
import { fetchAssignedTasksThunk } from "../../team/kanbanSlice";
import { fetchUserSubscriptionThunk } from "../../subscription/subscriptionSlice";
import { UserStatusCard } from "../components/UserStatusCard";
import { FocusLeaderboard } from "../components/FocusLeaderboard";
import { AssignedTaskList } from "../components/AssignedTaskList";

export const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchAllUserFocusStatsThunk());
    dispatch(fetchAssignedTasksThunk());
    dispatch(fetchUserSubscriptionThunk());
  }, [dispatch]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-yellow-50 px-6 py-12 md:px-12 md:py-16">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-yellow-900">
          Have a nice day, {user.firstname}
        </h1>
        <p className="mt-2 text-sm text-yellow-700">
          Here's your personal productivity dashboard
        </p>
        <div className="mt-2 flex gap-2">
          {[...Array(3)].map((_, idx) => (
            <span key={idx} className="h-2 w-2 rounded-full bg-yellow-400" />
          ))}
        </div>
        <div className="mt-4">
          <UserStatusCard user={user} />
        </div>
      </header>

      {/* ✅ Giao diện full-width cho task list */}
      <section className="mt-10">
        <AssignedTaskList />
      </section>

      {/* Leaderboard */}
      <footer className="mt-20">
        <FocusLeaderboard />
      </footer>
    </div>
  );
};
