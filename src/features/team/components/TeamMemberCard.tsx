// components/TeamMemberCard.tsx
type Props = {
  fullName: string;
  email: string;
  teamRole: "OWNER" | "MEMBER";
};

export const TeamMemberCard = ({ fullName, email, teamRole }: Props) => {
  return (
    <div className="flex items-center gap-3 border border-gray-200 px-4 py-3 rounded-lg shadow-sm bg-white">
      <div className="w-10 h-10 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center font-semibold uppercase">
        {fullName.charAt(0)}
      </div>

      <div className="flex-1">
        <p className="font-medium text-gray-800">{fullName}</p>
        <p className="text-xs text-gray-500">{email}</p>
      </div>

      <span
        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          teamRole === "OWNER"
            ? "bg-yellow-200 text-yellow-800"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {teamRole}
      </span>
    </div>
  );
};