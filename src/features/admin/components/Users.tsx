import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import {
  deleteUser,
  fetchUserList,
  updateUserRole,
} from "../adminSlice";
import type { Role } from "../adminSlice";
import { ConfirmModal } from "../../team/components/ConfirmModal";
import { Pagination } from "./Pagination";
import { UserTable } from "./UserTable";

const ITEMS_PER_PAGE = 10;

export const Users = () => {
  const dispatch = useAppDispatch();
  const { users, loadingUsers, errorUsers } = useAppSelector(
    (state) => state.admin
  );
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Xác nhận đổi vai trò
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [pendingUserName, setPendingUserName] = useState<string | null>(null);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);

  // ✅ Xác nhận xoá người dùng
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
  const [userToDeleteName, setUserToDeleteName] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUserList());
  }, [dispatch]);

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleDeleteClick = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setUserToDeleteId(id);
      setUserToDeleteName(user.fullName);
    }
  };

  const confirmDeleteUser = () => {
    if (userToDeleteId) {
      dispatch(deleteUser(userToDeleteId));
    }
    setUserToDeleteId(null);
    setUserToDeleteName(null);
  };

  const cancelDeleteUser = () => {
    setUserToDeleteId(null);
    setUserToDeleteName(null);
  };

  const handleRoleChangeClick = (id: string, newRole: Role) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setPendingUserId(id);
      setPendingUserName(user.fullName);
      setPendingRole(newRole);
    }
  };

  const confirmChangeRole = () => {
    if (pendingUserId && pendingRole) {
      dispatch(updateUserRole({ id: pendingUserId, role: pendingRole }));
    }
    setPendingUserId(null);
    setPendingUserName(null);
    setPendingRole(null);
  };

  const cancelChangeRole = () => {
    setPendingUserId(null);
    setPendingUserName(null);
    setPendingRole(null);
  };

  if (loadingUsers)
    return <p className="p-8 text-gray-500 italic">Loading...</p>;
  if (errorUsers)
    return <p className="p-8 text-red-600">Error: {errorUsers}</p>;

  return (
    <div className="min-h-screen bg-yellow-50 p-8 text-yellow-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">👥 Manage Users</h1>
        <p className="mt-2 text-sm text-yellow-700">
          A quick snapshot of all registered users.
        </p>
        <div className="mt-2 flex gap-2">
          {[...Array(3)].map((_, idx) => (
            <span key={idx} className="h-2 w-2 rounded-full bg-yellow-400" />
          ))}
        </div>
        <p className="mt-6 rounded-md bg-amber-200 p-3 font-semibold">
  There are currently <strong>{users.length} users</strong> in the system.
</p>
      </div>

      {/* 🗂 Bảng người dùng */}
      <UserTable
        users={paginatedUsers}
        onDelete={handleDeleteClick}
        onRoleChangeClick={handleRoleChangeClick}
      />

      {/* 📄 Phân trang */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* 🔐 Modal xác nhận đổi vai trò */}
      {pendingUserId && pendingRole && (
        <ConfirmModal
          title="Change Role"
          message={`Are you sure you want to change role for "${pendingUserName}" to ${pendingRole}?`}
          onConfirm={confirmChangeRole}
          onCancel={cancelChangeRole}
        />
      )}

      {/* 🗑️ Modal xác nhận xoá */}
      {userToDeleteId && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to delete "${userToDeleteName}"? This action cannot be undone.`}
          onConfirm={confirmDeleteUser}
          onCancel={cancelDeleteUser}
        />
      )}
    </div>
  );
};