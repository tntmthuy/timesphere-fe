type Props = {
  fullName: string;
  email: string;
  avatarUrl: string | null;
  teamRole: "OWNER" | "MEMBER";
};

export const TeamMemberCard = ({ fullName, email, avatarUrl, teamRole }: Props) => {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      {/* 🖼 Avatar hoặc chữ cái đầu */}
      <div className="h-10 w-10 overflow-hidden rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-semibold uppercase">
        {avatarUrl ? (
          <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
        ) : (
          fullName.charAt(0)
        )}
      </div>

      {/* 👤 Họ tên & email */}
      <div className="flex-1">
        <p className="font-medium text-gray-800">{fullName}</p>
        <p className="text-xs text-gray-500">{email}</p>
      </div>

      {/* 🎖️ Vai trò trong nhóm */}
      <span
        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          teamRole === "OWNER"
            ? "bg-yellow-200 text-yellow-800"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {teamRole === "OWNER" ? "OWNER" : "MEMBER"}
      </span>
    </div>
  );
};