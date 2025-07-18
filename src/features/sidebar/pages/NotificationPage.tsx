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
  const [activeTab, setActiveTab] = useState<"all" | "read">("all");

  // 🧪 Mock dữ liệu
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
      {
        id: "3",
        title: "Bạn được gán vào task",
        message: "Thùy đã gán bạn vào task 'Triển khai backend'",
        createdAt: "2025-07-18T08:15:00Z",
        isRead: false,
      },
      {
        id: "4",
        title: "Task đã hoàn thành",
        message: "Task 'Thiết kế UI' đã được đánh dấu hoàn thành",
        createdAt: "2025-07-16T14:00:00Z",
        isRead: true,
      },
    ]);
  }, []);

  // 🔹 Nhóm thông báo theo ngày
  const groupByDate = (list: Notification[]) => {
    const groups: Record<string, Notification[]> = {};
    list.forEach((n) => {
      const date = new Date(n.createdAt).toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(n);
    });
    return groups;
  };

  const filtered = notifications.filter((n) =>
    activeTab === "all" ? !n.isRead : n.isRead
  );
  const grouped = groupByDate(filtered);

  return (
    <div className="p-6 bg-white h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">🔔 Thông báo</h2>

      {/* 🔸 Tabs */}
      <div className="mb-4 flex gap-4">
        <button
          className={`text-sm font-medium px-3 py-1 rounded ${
            activeTab === "all"
              ? "bg-yellow-100 text-yellow-800"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("all")}
        >
          📨 All
        </button>
        <button
          className={`text-sm font-medium px-3 py-1 rounded ${
            activeTab === "read"
              ? "bg-gray-100 text-gray-800"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("read")}
        >
          ✅ Read
        </button>
      </div>

      {/* 🔹 Nội dung */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">Không có thông báo nào.</p>
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            {/* 🔸 Tiêu đề ngày + nút ✕ */}
            <div className="flex justify-between items-center mb-2 mt-6">
              <h4 className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded">
                📅 {date}
              </h4>
              <span className="text-gray-400 text-xs cursor-default">✕</span>
            </div>

            {/* 🔹 Danh sách thông báo */}
            <ul className="space-y-3">
              {items.map((noti) => (
                <li
                  key={noti.id}
                  className={`rounded-md border px-4 py-3 shadow-sm transition ${
                    noti.isRead
                      ? "bg-gray-50 border-gray-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">
                      {noti.title}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {new Date(noti.createdAt).toLocaleTimeString("vi-VN")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{noti.message}</p>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};