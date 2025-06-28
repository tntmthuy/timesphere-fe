// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface LoginPayload {
  email: string;
  password: string;
}

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (form: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:8081/api/auth/authenticate", form);
      
      localStorage.setItem("token", res.data.access_token); // 👈 bạn cũng có thể chuyển qua thunk thay vì component
      return {
  token: res.data.access_token,
  user: res.data.user || null
};
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            return rejectWithValue(err.response?.data?.message || "Đăng nhập thất bại");
        }
        return rejectWithValue("Lỗi không xác định");
}
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null as string | null,
    user: null as unknown, // nếu response trả user info
    status: "idle", // loading, succeeded, failed
    error: null as string | null,
  },
  reducers: {
    logout: (state) => {
    state.token = null;
    state.user = null;
    state.status = "idle";
    state.error = null;
  },

  },
  extraReducers: builder => {
    builder
      .addCase(loginThunk.pending, state => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user || null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;