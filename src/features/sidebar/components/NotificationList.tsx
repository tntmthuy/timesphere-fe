import { useAppDispatch } from "../../../state/hooks";
import { markNotificationAsRead, type Notification } from "../notificationSlice";

type Props = {
  items: Notification[];
  filter: "unread" | "read";
  onAccept: (teamId: string) => void;
  onDecline: (teamId: string) => void;
};

export const NotificationList = ({
  items,
  filter,
  onAccept,
  onDecline,
}: Props) => {
  const dispatch = useAppDispatch();

  const filtered = items
    .filter((n) => (filter === "unread" ? !n.read : n.read))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const groupByDate = (list: Notification[]) => {
    const groups: Record<string, Notification[]> = {};

    list.forEach((n) => {
      const created = new Date(n.createdAt);
      const now = new Date();

      const isSameDay = created.toDateString() === now.toDateString();
      const isYesterday =
        new Date(now.getTime() - 86400000).toDateString() ===
        created.toDateString();

      const monday = new Date(now);
      monday.setDate(now.getDate() - now.getDay() + 1); // thứ Hai trong tuần

      const isThisWeek =
        created >= monday && !isSameDay && !isYesterday && created < now;

      let label = "";

      if (isSameDay) label = "Today";
      else if (isYesterday) label = "Yesterday";
      else if (isThisWeek) label = "This week";
      else {
        label =
          "📅 " +
          created.toLocaleDateString("en-US", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(n);
    });

    return groups;
  };

  const grouped = groupByDate(filtered);

  if (filtered.length === 0)
    return <p className="text-gray-500">Không có thông báo nào.</p>;

  return (
    <>
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <div className="mt-6 mb-2 flex items-center justify-between">
            <h4 className="rounded bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
              {date}
            </h4>
          </div>
          <ul className="space-y-3">
            {items.map((noti) => (
              <li
                key={noti.id}
                className={`flex items-center justify-between gap-3 rounded-md border p-4 shadow-sm transition ${
                  noti.read
                    ? "border-gray-200 bg-gray-50"
                    : "border-yellow-200 bg-yellow-50"
                }`}
              >
                {/* 🖼 Bên trái: Avatar + nội dung */}
                <div className="flex flex-1 gap-3">
                  <img
                    src={noti.senderAvatar}
                    alt={noti.senderName}
                    className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-semibold text-gray-800">
                        {noti.title}
                        {noti.read && noti.type === "INVITE" && (
                          <span className="text-sm text-gray-500 italic">
                            {noti.inviteStatus === "ACCEPTED"
                              ? "— Bạn đã tham gia nhóm"
                              : noti.inviteStatus === "DECLINED"
                                ? "— Bạn đã từ chối lời mời"
                                : ""}
                          </span>
                        )}
                      </h3>

                      {filter === "unread" && (
                        <span className="text-xs text-gray-400 italic">
                          &nbsp;- {noti.timeAgo}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600">{noti.content}</p>

                    {noti.type === "INVITE" && !noti.read && (
                      <div className="flex gap-2 pt-1">
                        <button
                          className="rounded bg-gray-400 px-3 py-1 text-sm text-white hover:bg-gray-300"
                          onClick={() => onAccept(noti.referenceId)}
                        >
                          Đồng ý
                        </button>
                        <button
                          className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                          onClick={() => onDecline(noti.referenceId)}
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ✅ Bên phải: biểu tượng trạng thái */}
                <div className="flex items-center justify-center">
                  {filter === "unread" ? (
                    <button
                      onClick={() => dispatch(markNotificationAsRead(noti.id))}
                      className="transition hover:text-green-600"
                      title="Đánh dấu đã đọc"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </button>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};
