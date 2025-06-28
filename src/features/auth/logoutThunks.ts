import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

export const logoutThunk = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  const token = localStorage.getItem("token");
if (!token) {
  console.warn("🚫 Không tìm thấy token trong localStorage, không logout được");
  return;
}

  if (token) {
    try {
      await api.post(
        "/api/auth/logout",
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("🚀 Gửi logout với token:", token);
      console.log("✅ Logout backend thành công");
    } catch (err) {
      console.warn("⚠️ Gọi logout không thành công:", err);
    }
  }

  localStorage.removeItem("token");
  dispatch({ type: "auth/logout" });
});