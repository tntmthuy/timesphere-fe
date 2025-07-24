import { useAppSelector } from "../../../state/hooks";

export const FocusLeaderboard = () => {
  const userStats = useAppSelector((state) => state.focus.userStats);

  const sortedStats = [...userStats].sort((a, b) =>
    b.totalMinutes !== a.totalMinutes
      ? b.totalMinutes - a.totalMinutes
      : a.name.localeCompare(b.name),
  );

  const toHourMinute = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    return (
      <>
        {h > 0 && (
          <>
            <span className="font-bold text-yellow-600">{h}</span>
            <span className="text-yellow-600 font-bold">
              {h === 1 ? " hour " : " hours "}
            </span>
          </>
        )}
        <span className="font-bold text-yellow-600">{m}</span>
        <span className="text-yellow-600 font-bold">
          {m === 1 ? " minute" : " minutes"}
        </span>
      </>
    );
  };

  const getInitialAvatar = (name: string) => {
    const firstChar = name?.trim()?.charAt(0)?.toUpperCase() ?? "?";
    const bgColors = [
      "bg-yellow-400",
      "bg-orange-400",
      "bg-pink-400",
      "bg-green-400",
    ];
    const color = bgColors[firstChar.charCodeAt(0) % bgColors.length];

    return (
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${color}`}
      >
        {firstChar}
      </div>
    );
  };

  return (
    <section className="mt-16 w-full px-4">
      <h2 className="mb-6 text-center text-3xl font-extrabold tracking-tight text-yellow-900">
        🏆 Focus Leaderboard
      </h2>

      <div className="overflow-auto rounded-xl border border-yellow-400 bg-white shadow-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-yellow-400 text-sm tracking-wide text-yellow-800 uppercase">
            <tr>
              <th className="px-6 py-4 text-left">Rank</th>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-right">Focus Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((user, idx) => {
              const isTop1 = idx === 0;
              const isTop2 = idx === 1;

              const rowStyle = isTop1
                ? "bg-yellow-100 text-yellow-900 text-xl font-extrabold shadow-sm ring-2 ring-yellow-300"
                : isTop2
                  ? "bg-yellow-50 text-yellow-800 text-lg font-semibold"
                  : "text-slate-700";

              return (
                <tr
                  key={idx}
                  className={`border-t border-slate-200 ${rowStyle}`}
                >
                  <td className="px-6 py-3">#{idx + 1}</td>
                  <td className="flex items-center gap-3 px-6 py-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      getInitialAvatar(user.name)
                    )}
                    <span className="text-base font-medium">{user.name}</span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {user.totalMinutes > 0 ? (
                      toHourMinute(user.totalMinutes)
                    ) : (
                      <>
                        <span className="font-bold text-yellow-600">0</span>
                        <span className="text-yellow-600"> minutes</span>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
