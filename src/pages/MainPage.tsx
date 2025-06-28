import { useState } from "react";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { CreateTeamModal } from "../features/team/components/CreateTeamModal";

export const MainPage = () => {
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);

  return (
    <div className="relative flex h-screen bg-black">
      {/* Sidebar trái */}
      <Sidebar onNewTeam={() => setShowCreateTeamModal(true)} />

      {/* Nội dung bên phải */}
      <div className="flex-1 overflow-y-auto bg-black p-6 text-gray-900">
        <Outlet />
      </div>

      {showCreateTeamModal && (
        <CreateTeamModal onClose={() => setShowCreateTeamModal(false)} />
      )}
    </div>
  );
};
