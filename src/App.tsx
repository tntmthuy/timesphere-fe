import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./features/landing/pages/LandingPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { VerifyCodePage } from "./features/auth/pages/VerifyCodePage";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import { AuthWatcher } from "./features/auth/AuthWatcher";
import { MainPage } from "./features/landing/pages/MainPage";
import { FocusPage } from "./features/focus/pages/FocusPage";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { TeamDetailPage } from "./features/team/pages/TeamDetailPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <AuthWatcher />
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />

      <Routes>
        {/* 🟢 Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyCodePage />} />

        {/* 🔐 Protected layout */}
        <Route
          path="/mainpage"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<FocusPage />} />
          <Route path="focus" element={<FocusPage />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* ✅ Trang xem chi tiết nhóm */}
          <Route path="team/:id" element={<TeamDetailPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
