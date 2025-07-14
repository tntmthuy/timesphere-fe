//src\features\auth\authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🧾 Kiểu user
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  gender: "male" | "female" | "unsure";
  avatarUrl: string | null;
}

// 💾 Kiểu state auth
interface AuthState {
  token: string | null;
  user: User | null;
  status: "idle" | "loading" | "succeeded" | "failed" | "mfa_required" | "verified";
  error: string | null;
  mfaEnabled: boolean;
  secretImageUri: string;
  email: string;
}

// 🧱 State khởi tạo
const initialState: AuthState = {
  token: null,
  user: null,
  status: "idle",
  error: null,
  mfaEnabled: false,
  secretImageUri: "",
  email: "",
};

// 🚀 Thunk: login
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/authenticate", payload);
      const token = res.data.access_token;
      const user = res.data.user;
      localStorage.setItem("token", token);
      return { token, user: user ?? null };
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "Đăng nhập thất bại"
        : "Lỗi không xác định";
      if (message === "MFA_REQUIRED") return rejectWithValue("MFA_REQUIRED");
      return rejectWithValue(message);
    }
  }
);

// 🚀 Thunk: register
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (
    form: { firstname: string; lastname: string; email: string; password: string; mfaEnabled: boolean },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post("/api/auth/register", form);
      return {
        secretImageUri: res.data.secretImageUri,
        mfaEnabled: res.data.mfaEnabled,
        email: form.email,
      };
    } catch {
      return rejectWithValue("Đăng ký thất bại");
    }
  }
);

// 🚀 Thunk: verify OTP
export const verifyCodeThunk = createAsyncThunk(
  "auth/verifyCode",
  async (payload: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/verify", payload);
      const token = res.data.access_token;
      const user = res.data.user; // ✅ Nếu server trả user sau xác thực
      localStorage.setItem("token", token);
      return { token, user: user ?? null }; // trả về object
    } catch {
      return rejectWithValue("Mã xác thực không hợp lệ");
    }
  }
);


//Profile
export const fetchUserProfileThunk = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    } catch {
      return rejectWithValue("Không lấy được thông tin người dùng");
    }
  }
);
// up lên cloud + patch avatar
export const updateAvatarThunk = createAsyncThunk(
  "auth/updateAvatar",
  async (file: File, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", file);

      // 📤 Upload ảnh
      const uploadRes = await axios.post("/api/upload?folder=avatars", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const url = uploadRes.data.url;

      // 🧾 PATCH avatar
      const patchRes = await axios.patch("/api/user/avatar", { avatarUrl: url }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return patchRes.data.data;
    } catch {
      return rejectWithValue("Không cập nhật được avatar");
    }
  }
);

//update info
export const updateProfileInfoThunk = createAsyncThunk(
  "auth/updateProfileInfo",
  async (
    payload: {
      firstname: string;
      lastname: string;
      gender: "MALE" | "FEMALE" | "UNSURE";
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch("/api/user/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    } catch {
      return rejectWithValue("Không cập nhật được thông tin cá nhân");
    }
  }
);

//change password
export const changePasswordThunk = createAsyncThunk(
  "auth/changePassword",
  async (
    payload: {
      currentPassword: string;
      newPassword: string;
      confirmationPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch("/api/user/change-password", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.message; // "Đổi mật khẩu thành công!"
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Password change failed."
        : "Unknown error.";
      return rejectWithValue(msg);
    }
  }
);

// 🧩 Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      Object.assign(state, initialState);
    },
    clearToken: (state) => {
      localStorage.removeItem("token");
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Login
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = action.payload === "MFA_REQUIRED" ? "mfa_required" : "failed";
        state.error = typeof action.payload === "string" ? action.payload : null;
      })

      // ✅ Register
      .addCase(registerThunk.fulfilled, (state, action) => {
        if (action.payload.mfaEnabled) {
          state.status = "mfa_required";
          state.secretImageUri = action.payload.secretImageUri;
          state.mfaEnabled = true;
          state.email = action.payload.email;
        } else {
          state.status = "succeeded";
        }
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : null;
      })

      // ✅ Verify MFA
      .addCase(verifyCodeThunk.fulfilled, (state, action) => {
        state.status = "verified";
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(verifyCodeThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : null;
      })
      .addCase(fetchUserProfileThunk.fulfilled, (state, action) => {
        state.user = {
        id: action.payload.id,
        firstname: action.payload.firstname,
        lastname: action.payload.lastname,
        email: action.payload.email,
        gender: action.payload.gender,
        avatarUrl: action.payload.avatarUrl,
      };
      })
      .addCase(updateAvatarThunk.fulfilled, (state, action) => {
        state.user = action.payload; // hoặc state.user.avatarUrl = action.payload.avatarUrl;
      })
      .addCase(updateProfileInfoThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      ;
  },
});

export const { logout, clearToken } = authSlice.actions;
export default authSlice.reducer;