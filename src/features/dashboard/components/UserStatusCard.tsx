// ./features/dashboard/components/UserStatusCard.tsx

import { Link } from "react-router-dom";
import type { User } from "../../auth/authSlice";

export const UserStatusCard = ({ user }: { user: User }) => {
  const expiryDate = "2025-08-22"; // 👈 bạn có thể lấy từ BE nếu có field

  return (
    <div className="mb-6 text-sm text-slate-600">
      <span className="font-medium">Role:</span>{" "}
      <span className="font-semibold text-yellow-700">{user.role}</span>
      {user.role === "PREMIUM" ? (
        <span className="text-green-600 italic">
          • Premium Enabled until {expiryDate}
        </span>
      ) : user.role === "FREE" ? (
        <span className="text-yellow-800">
          • You are on Free plan.{" "}
          <Link to="/mainpage/upgrade" className="underline">
            Upgrade now
          </Link>
        </span>
      ) : null}
      {user.isAdmin && (
        <span className="ml-2 text-red-500">• Admin Access</span>
      )}
    </div>
  );
};
