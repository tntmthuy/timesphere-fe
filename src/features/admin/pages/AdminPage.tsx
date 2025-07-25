import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/AdminSidebar";

export const AdminPage = () => {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
};