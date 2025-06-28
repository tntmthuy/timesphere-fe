import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { VerifyCodePage } from "./pages/VerifyCodePage";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import { AuthWatcher } from "./features/auth/AuthWatcher";
import { MainPage } from "./pages/MainPage";
import { FocusPage } from "./features/focus/pages/FocusPage";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { TeamDetailPage } from "./features/team/pages/TeamDetailPage";

function App() {
  return (
    <>
      <AuthWatcher />

      <Routes>
        {/* 🟢 Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyCodePage />} />

        {/* 🧪 Nếu còn muốn test riêng */}
        {/* <Route path="/team-details" element={<TeamDetailPage />} /> */}

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