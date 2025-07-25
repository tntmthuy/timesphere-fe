import { Link } from "react-router-dom";
import type { User } from "../../auth/authSlice";
import { useAppSelector } from "../../../state/hooks";

export const UserStatusCard = ({ user }: { user: User }) => {
  const subscription = useAppSelector((state) => state.subscription.info);

  const endDate = subscription?.endDate ? new Date(subscription.endDate) : null;
  const formattedExpire = endDate ? endDate.toLocaleDateString("vi-VN") : null;
  const daysLeft = endDate
    ? Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 7;

  return (
    <div className="mb-6 rounded-lg bg-yellow-200 p-5 text-[14px] text-gray-800 shadow-md border border-yellow-100">
      {/* 👤 Access level */}
      <div className="mb-3">
        <span className="font-semibold text-yellow-900">
          Access Level:{" "}
          <span className="text-yellow-700">{user.role}</span>
        </span>
        {user.isAdmin && (
          <span className="ml-2 inline-block rounded bg-red-100 px-2 py-[2px] text-[12px] font-medium text-red-600">
            Administrator Privileges
          </span>
        )}
      </div>

      {/* 💎 Premium info */}
      {user.role === "PREMIUM" && formattedExpire && (
        <>
          <div className="mb-2 text-green-700 italic">
            Your Premium membership is valid until <strong>{formattedExpire}</strong>.
          </div>
          {isExpiringSoon && (
            <div className="text-red-600 font-medium">
              ⚠️ Your subscription will expire in {daysLeft} day{daysLeft > 1 ? "s" : ""}. Please renew to maintain uninterrupted access.
            </div>
          )}
        </>
      )}

      {/* 🆓 Free plan info */}
      {user.role === "FREE" && (
        <p className="text-[13px]">
          You are currently subscribed to the <span className="font-semibold text-gray-700">Free plan</span>.{" "}
          <Link
            to="/mainpage/upgrade"
            className="ml-1 text-yellow-700 font-semibold underline hover:text-yellow-900"
          >
            Explore upgrade options →
          </Link>
        </p>
      )}
    </div>
  );
};