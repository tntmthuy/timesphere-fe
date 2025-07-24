// src/components/FocusHistoryCard.tsx
import type { FocusSessionResponse } from "../focusSlice";

type Props = {
  sessions: FocusSessionResponse[];
  loading?: boolean;
};

const formatMinutes = (total: number): string => {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  const hrLabel = hours === 1 ? "hr" : "hrs";
  const minLabel = minutes === 1 ? "min" : "mins";

  const hrsText = hours > 0 ? `${hours} ${hrLabel}` : "";
  const minText = minutes > 0 ? `${minutes} ${minLabel}` : "";

  return [hrsText, minText].filter(Boolean).join(" ");
};

export const FocusHistoryCard = ({ sessions, loading = false }: Props) => {
  return (
    <div className="flex h-full flex-col rounded-lg bg-yellow-500 p-4 shadow-md">
      <h2 className="mb-4 text-lg font-semibold text-white">Focus History</h2>
      <div className="mb-4 h-px w-full bg-yellow-200" />

      <div className="flex h-[300px] flex-col gap-3 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-sm text-white">⏳ Đang tải phiên...</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-white">
            No focus sessions recorded yet. Start your first session!
          </p>
        ) : (
          sessions
            .filter((session) => session.status !== "CANCELLED")
            .map((session) => {
              const isCancelled = session.status === "CANCELLED";
              const date = session.startedAt
                ? new Date(session.startedAt)
                : null;

              const timestamp = date
                ? `${date.toLocaleDateString("en-GB")} • ${date.toLocaleTimeString(
                    "en-GB",
                    { hour: "2-digit", minute: "2-digit" },
                  )}`
                : "Chưa rõ thời gian";

              return (
                <div
                  key={session.id}
                  className={`rounded-md border p-4 shadow-sm transition ${
                    isCancelled
                      ? "border-red-400 bg-red-100 hover:bg-red-200"
                      : "border-amber-300 bg-amber-100 hover:bg-amber-200"
                  }`}
                >
                  <div className="mb-2 text-xs text-amber-800">{timestamp}</div>

                  {session.description && (
                    <div
                      className={`mb-2 text-sm ${
                        isCancelled ? "text-red-700" : "text-slate-800"
                      }`}
                    >
                      {isCancelled ? "⚠️ Interrupted:" : ""}{" "}
                      {session.description}
                    </div>
                  )}

                  <div
                    className={`text-lg font-bold ${
                      isCancelled ? "text-red-700" : "text-amber-900"
                    }`}
                  >
                    {formatMinutes(session.actualMinutes)}
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};
