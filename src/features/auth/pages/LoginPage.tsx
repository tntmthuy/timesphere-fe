// src/features/auth/pages/LoginPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/hooks";
import { loginThunk } from "../authSlice";

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const { token, status, error } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginThunk(form));
  };

  useEffect(() => {
  console.log("🧪 [LoginPage] Redux status:", status);
  console.log("🔑 [LoginPage] Redux token:", token);

  if (token && status === "succeeded") {
    console.log("🚀 [LoginPage] Điều hướng sang /mainpage");
    navigate("/mainpage");
  }
}, [token, status, navigate]);



  return (
    <section className="flex min-h-screen items-center justify-center bg-[#FFDE70] px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-black bg-white p-8 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-black">
          Welcome Back
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-black"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full rounded border border-black px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-black"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded border border-black px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
            />
            <div className="mt-2 text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-[#B3B1B0] hover:text-[#5d512c]"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {status === "loading" && (
            <p className="text-sm text-gray-500">Đang đăng nhập...</p>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded border border-black bg-[#FFDE70] px-6 py-2 font-medium text-black transition hover:bg-black hover:text-white"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Đang xử lý..." : "Log In"}
          </button>
        </form>

        <hr className="my-4 border-t border-[#D1D5DB]" />

        <p className="text-center text-sm text-[#B3B1B0]">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-black hover:text-[#5d512c]"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};
