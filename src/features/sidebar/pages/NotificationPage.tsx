import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { fetchNotificationsThunk } from "../notificationSlice";
import { NotificationList } from "../components/NotificationList";
import toast from "react-hot-toast";
import {
  acceptInvitationThunk,
  declineInvitationThunk,
} from "../invitetationSlice";

export const NotificationPage = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((s) => s.notification.list);
  const [activeTab, setActiveTab] = useState<"unread" | "read">("unread");

  // 🔍 Log trạng thái isRead
  useEffect(() => {
    console.log(
      "🔍 Updated list:",
      notifications.map((n) => ({ id: n.id, read: n.read }))
    );
  }, [notifications]);

  useEffect(() => {
    dispatch(fetchNotificationsThunk());
  }, [dispatch]);

  const handleAccept = async (teamId: string) => {
    try {
      const msg = await dispatch(acceptInvitationThunk(teamId)).unwrap();
      toast.success(msg);
      await dispatch(fetchNotificationsThunk());
      setActiveTab("read");
    } catch {
      toast.error("Không thể chấp nhận lời mời.");
    }
  };

  const handleDecline = async (teamId: string) => {
    try {
      const msg = await dispatch(declineInvitationThunk(teamId)).unwrap();
      toast.success(msg);
      await dispatch(fetchNotificationsThunk());
      setActiveTab("read");
    } catch {
      toast.error("Không thể từ chối lời mời.");
    }
  };

  return (
    <div className="h-full bg-white p-6">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">🔔 Thông báo</h2>

      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setActiveTab("unread")}
          className={`rounded px-3 py-1 text-sm font-medium ${
            activeTab === "unread"
              ? "bg-yellow-100 text-yellow-800"
              : "text-gray-500"
          }`}
        >
          📬 Unread
        </button>
        <button
          onClick={() => setActiveTab("read")}
          className={`rounded px-3 py-1 text-sm font-medium ${
            activeTab === "read"
              ? "bg-gray-100 text-gray-800"
              : "text-gray-500"
          }`}
        >
          ✅ Read
        </button>
      </div>

      <NotificationList
        key={activeTab + notifications.length} // ép re-render mượt
        items={notifications}
        filter={activeTab}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </div>
  );
};