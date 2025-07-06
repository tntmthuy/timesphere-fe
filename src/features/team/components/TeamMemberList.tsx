import { TeamMemberCard } from "./TeamMemberCard";

type Member = {
  userId: string;
  fullName: string;
  email: string;
  teamRole: "OWNER" | "MEMBER";
};

type Props = {
  members: Member[];
};

export const TeamMemberList = ({ members }: Props) => {
  return (
    <>
      <h2 className="mb-3 text-lg font-semibold">Thành viên</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {members.map((m) => (
          <TeamMemberCard
            key={m.userId}
            fullName={m.fullName}
            email={m.email}
            teamRole={m.teamRole}
          />
        ))}
      </div>
    </>
  );
};