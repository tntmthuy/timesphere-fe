// src/pages/FocusPage.tsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FocusSessionForm } from "../components/FocusSessionForm";
import { FocusHistoryCard } from "../components/FocusHistoryCard";
import { FocusTimerModal } from "../components/FocusTimerModal";
import {
  fetchCompletedSessionsThunk,
  fetchWeeklyMinutesThunk,
  startSessionThunk,
  endSessionThunk,
} from "../focusSlice";
import type { RootState } from "../../../state/store";
import { useAppDispatch } from "../../../state/hooks";

const formatMinutes = (total: number): string => {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours > 0 && minutes > 0) return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes > 1 ? "s" : ""}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${minutes} minute${minutes > 1 ? "s" : ""}`;
};

export const FocusPage = () => {
  const [focusTime, setFocusTime] = useState("25 min");
  const [breakTime, setBreakTime] = useState("5 min");
  const [description, setDescription] = useState("");
  const [showTimer, setShowTimer] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  const { sessions, loading, weeklyMinutes } = useSelector((state: RootState) => state.focus);

  useEffect(() => {
    dispatch(fetchCompletedSessionsThunk());
    dispatch(fetchWeeklyMinutesThunk());
  }, [dispatch]);

  const handleStartFocus = async () => {
    try {
      const target = parseInt(focusTime);
      const res = await dispatch(startSessionThunk({ targetMinutes: target, description })).unwrap();
      setActiveSessionId(res.id);
      setShowTimer(true);
    } catch {
      // handle error if needed
    }
  };

  const handleEndSession = async () => {
    if (!activeSessionId) return;
    try {
      await dispatch(endSessionThunk({
        sessionId: activeSessionId,
        actualMinutes: parseInt(focusTime),
      })).unwrap();

      dispatch(fetchCompletedSessionsThunk());
      dispatch(fetchWeeklyMinutesThunk());
      setShowTimer(false);
      setActiveSessionId(null);
    } catch {
      // handle error if needed
    }
  };

  return (
    <div className="relative min-h-screen bg-yellow-50 px-12 py-16">
      {/* 🔝 Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-yellow-900">Focus Mode</h2>
        <p className="mt-2 text-sm text-yellow-700">
          Set up a session & review your flow
        </p>
        <div className="mt-2 flex gap-2">
          {[...Array(3)].map((_, idx) => (
            <span key={idx} className="h-2 w-2 rounded-full bg-yellow-400" />
          ))}
        </div>
        <p className="mt-6 rounded-md bg-amber-200 p-3 text-sm font-semibold text-yellow-900">
          You've stayed focused for <strong>{formatMinutes(weeklyMinutes)}</strong> this week.
        </p>
      </div>

      {/* 🧱 Layout: Left ➜ Form + Timer | Right ➜ History */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-stretch">
        {/* ⬅️ Left */}
        <div className="flex flex-col gap-4 h-full">
          <FocusSessionForm
            focusTime={focusTime}
            breakTime={breakTime}
            description={description}
            onChangeFocus={setFocusTime}
            onChangeBreak={setBreakTime}
            onChangeDescription={setDescription}
            onStart={handleStartFocus}
          />
          {showTimer && activeSessionId && (
            <FocusTimerModal
              targetLabel={`Focus (${focusTime})`}
              targetMinutes={parseInt(focusTime)}
              onEnd={handleEndSession}
              onClose={() => setShowTimer(false)}
            />
          )}
        </div>

        {/* ➡️ Right */}
        <FocusHistoryCard sessions={sessions} loading={loading} />
      </div>
    </div>
  );
};