import { useEffect, useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

export const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 🧪 Tạm mock dữ liệu
  useEffect(() => {
    setNotifications([
      {
        id: "1",
        title: "Bạn được thêm vào nhóm",
        message: "Thùy đã thêm bạn vào nhóm Timesphere",
        createdAt: "2025-07-18T03:30:00Z",
        isRead: false,
      },
      {
        id: "2",
        title: "Có bình luận mới",
        message: "Minh vừa bình luận vào task 'Thiết kế UI'",
        createdAt: "2025-07-17T22:10:00Z",
        isRead: true,
      },
    ]);
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">🔔 Thông báo</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">Không có thông báo nào.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((noti) => (
            <li
              key={noti.id}
              className={`rounded-md border px-4 py-3 shadow-sm transition ${
                noti.isRead
                  ? "bg-gray-50 border-gray-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">{noti.title}</h3>
                <span className="text-xs text-gray-400">
                  {new Date(noti.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{noti.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};