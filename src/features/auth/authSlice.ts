import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  token: string | null;
  user: unknown;
  status: "idle" | "loading" | "succeeded" | "failed" | "mfa_required" | "verified";
  error: string | null;
  mfaEnabled: boolean;
  secretImageUri: string;
  email: string;
}

const initialState: AuthState = {
  token: null,
  user: null,
  status: "idle",
  error: null,
  mfaEnabled: false,
  secretImageUri: "",
  email: "",
};

// Thunk: login
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/authenticate", payload);
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      return { token, user: res.data.user ?? null };
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "Đăng nhập thất bại"
        : "Lỗi không xác định";
      if (message === "MFA_REQUIRED") return rejectWithValue("MFA_REQUIRED");
      return rejectWithValue(message);
    }
  }
);

// Thunk: register
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

// Thunk: verify OTP
export const verifyCodeThunk = createAsyncThunk(
  "auth/verifyCode",
  async (payload: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/verify", payload);
      const token = res.data.access_token;
      localStorage.setItem("token", token);
      return token;
    } catch {
      return rejectWithValue("Mã xác thực không hợp lệ");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      Object.assign(state, initialState);
    },
    clearToken: (state) => {
      localStorage.removeItem("token"); // ✅ chỉ xoá token, không reset toàn bộ
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
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

      // REGISTER
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

      // VERIFY OTP
      .addCase(verifyCodeThunk.fulfilled, (state, action) => {
        state.status = "verified"; // ✅ Không phải 'succeeded'
        state.token = action.payload;
      })
      .addCase(verifyCodeThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = typeof action.payload === "string" ? action.payload : null;
      });
  },
});

export const { logout, clearToken } = authSlice.actions;
export default authSlice.reducer;