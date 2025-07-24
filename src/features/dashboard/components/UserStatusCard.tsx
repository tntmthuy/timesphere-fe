import { Link } from "react-router-dom";
import type { User } from "../../auth/authSlice";
import { useAppSelector } from "../../../state/hooks";

export const UserStatusCard = ({ user }: { user: User }) => {
  const subscription = useAppSelector((state) => state.subscription.info);

  const endDate = subscription?.endDate
    ? new Date(subscription.endDate)
    : null;

  const formattedExpire = endDate
    ? endDate.toLocaleDateString("vi-VN")
    : null;

  const daysLeft = endDate
    ? Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const isExpiringSoon = daysLeft !== null && daysLeft <= 7;

  return (
    <div className="mb-6 rounded-md bg-yellow-100 p-4 text-sm text-yellow-900 shadow-sm">
      <p className="font-semibold">
        🎖 Role:{" "}
        <span className="text-yellow-800">{user.role}</span>
        {user.isAdmin && (
          <span className="ml-2 text-red-500 font-medium">• Admin Access</span>
        )}
      </p>

      {user.role === "PREMIUM" && formattedExpire && (
        <>
          <p className="mt-1 italic text-green-700">
            Premium access active until <strong>{formattedExpire}</strong>
          </p>
          {isExpiringSoon && (
            <p className="mt-1 text-red-600 font-medium">
              ⚠️ Your subscription expires in {daysLeft} day{daysLeft > 1 ? "s" : ""}.
            </p>
          )}
        </>
      )}

      {user.role === "FREE" && (
        <p className="mt-1">
          You’re currently on a Free plan.{" "}
          <Link
            to="/mainpage/upgrade"
            className="underline text-yellow-800 font-medium hover:text-yellow-900"
          >
            Upgrade now →
          </Link>
        </p>
      )}
    </div>
  );
};