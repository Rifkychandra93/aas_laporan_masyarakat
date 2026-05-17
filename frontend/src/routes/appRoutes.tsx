import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/common/ProtectedRoute";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardUser";
import CreateLaporanPage from "../pages/dashboard/CreateLaporanPage";
import DetailLaporanPage from "../pages/dashboard/DetailLaporanPage";
import EditLaporanPage from "../pages/dashboard/EditLaporanPage";
import HistoryPage from "../pages/dashboard/HistoryPage";
import ProfilePage from "../pages/dashboard/ProfilePage";
import EditProfilePage from "../pages/dashboard/EditProfilePage";
import LandingPage from "../pages/LandingPage";
import AdminRoute from "../components/common/AdminRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/buat-laporan"
            element={
              <ProtectedRoute>
                <CreateLaporanPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/laporan/:id"
            element={
              <ProtectedRoute>
                <DetailLaporanPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/laporan/edit/:id"
            element={
              <ProtectedRoute>
                <EditLaporanPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/riwayat"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
