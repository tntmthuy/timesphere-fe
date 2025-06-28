// import { CreateTeamForm } from "../components/CreateTeamForm";
import { TeamCard } from "../components/TeamCard";

export const TeamList = () => {
  return (
    <div className="flex justify-center items-start p-8 w-full bg-[#1E1E1E]">
      <div className="w-full max-w-xl">
        {/* <CreateTeamForm /> */}
        <TeamCard/>
      </div>
    </div>
  );
};