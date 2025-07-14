//src\features\team\member.ts
export type TeamMemberDTO = {
  memberId: number;
  userId: string;
  teamId: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
};