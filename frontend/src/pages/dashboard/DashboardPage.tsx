import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, FileText, User, Shield } from "lucide-react";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login"); };

  const roleLabel: Record<string, string> = {
    USER: "Pengguna", ADMIN: "Admin", SUPER_ADMIN: "Super Admin",
  };
  const roleStyle: Record<string, { color: string; bg: string; border: string }> = {
    USER:        { color: "#5b9cf6", bg: "#ebf3ff", border: "#bfdbfe" },
    ADMIN:       { color: "#4285f4", bg: "#eff6ff", border: "#bfdbfe" },
    SUPER_ADMIN: { color: "#1d4ed8", bg: "#dbeafe", border: "#93c5fd" },
  };
  const role = user?.role ?? "USER";
  const rs   = roleStyle[role] ?? roleStyle.USER;

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-nav">
        <div className="dashboard-nav-brand">
          <FileText size={20} color="var(--blue)" strokeWidth={1.5} />
          <span>Report<span className="brand-dot-in">.in</span></span>
        </div>
        <div className="dashboard-nav-right">
          <div className="dashboard-role-pill">
            <User size={13} />
            {roleLabel[role]}
          </div>
          <button id="logout-btn" className="dashboard-logout" onClick={handleLogout}>
            <LogOut size={13} />
            Keluar
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-card">
          <div className="dashboard-badge"
            style={{ color: rs.color, background: rs.bg, borderColor: rs.border }}>
            <Shield size={12} /> {roleLabel[role]}
          </div>
          <h1>Selamat Datang!</h1>
          <p>
            Anda berhasil login sebagai <strong>{roleLabel[role]}</strong>.<br />
            Sistem Report.in berjalan dengan baik.
          </p>
          <div className="dashboard-meta">
            <div className="dashboard-meta-item">
              <span className="dashboard-meta-label">User ID</span>
              <span className="dashboard-meta-value" style={{ color: "var(--blue)" }}>#{user?.id}</span>
            </div>
            <div className="dashboard-meta-item">
              <span className="dashboard-meta-label">Role</span>
              <span className="dashboard-meta-value" style={{ color: rs.color }}>{role}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
