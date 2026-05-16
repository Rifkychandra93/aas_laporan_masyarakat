import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Camera,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Settings,
  LogOut,
  ChevronRight,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../components/ui/DashboardNavbar";
import { getProfile } from "../../services/authService";
import { getAllLaporan } from "../../services/laporanService";
import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [reportsCount, setReportsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userProfile, reports] = await Promise.all([
        getProfile(),
        getAllLaporan()
      ]);
      setProfile(userProfile);
      
      const myReports = reports.filter((r: any) => r.user?.id === userProfile.id);
      setReportsCount(myReports.length);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#ffffff" }}>
      <DashboardNavbar />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <Loader2 size={32} className="animate-spin" color="#2563eb" />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <DashboardNavbar />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        
        <div style={{ marginBottom: "2rem" }}>
          <button 
            onClick={() => navigate("/dashboard")}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "none", background: "none", color: "#3b82f6", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}
          >
            <ArrowLeft size={18} /> Kembali ke Dashboard
          </button>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          
          <div style={{ padding: "2.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "2rem" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#eff6ff", border: "2px solid #3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                <User size={48} />
              </div>
              <button style={{ position: "absolute", bottom: 0, right: 0, width: 32, height: 32, borderRadius: "50%", background: "#3b82f6", border: "2px solid #fff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Camera size={14} />
              </button>
            </div>
            
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>{profile?.name}</h1>
                <CheckCircle size={20} color="#3b82f6" />
              </div>
              <p style={{ color: "#64748b", margin: "0.25rem 0 0.75rem", fontSize: "1rem" }}>{profile?.email}</p>
              <div style={{ display: "inline-flex", padding: "0.25rem 0.75rem", borderRadius: 6, background: "#eff6ff", color: "#3b82f6", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                {profile?.role}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", background: "#f8fafc", padding: "1.25rem 2.5rem", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", margin: 0 }}>Total Laporan</p>
              <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1e293b", margin: "0.1rem 0 0" }}>{reportsCount}</p>
            </div>
            <div style={{ width: 1, background: "#e2e8f0", margin: "0 2rem" }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", margin: 0 }}>Status Akun</p>
              <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#10b981", margin: "0.1rem 0 0" }}>Aktif</p>
            </div>
          </div>

          <div style={{ padding: "1rem 0" }}>
            <SectionLabel label="Informasi Pribadi" />
            <ProfileRow icon={<User size={18} />} label="Nama Lengkap" value={profile?.name} />
            <ProfileRow icon={<Mail size={18} />} label="Email" value={profile?.email} noBorder />

            <div style={{ height: "1.5rem" }} />

            <SectionLabel label="Pengaturan Akun" />
            <ActionRow 
              icon={<Settings size={18} />} 
              label="Edit Profil" 
              onClick={() => navigate("/dashboard/profile/edit")} 
            />
            <ActionRow 
              icon={<FileText size={18} />} 
              label="Riwayat Aktivitas" 
              onClick={() => navigate("/dashboard/riwayat")} 
              noBorder
            />

            <div style={{ padding: "1.5rem 2.5rem" }}>
              <button 
                onClick={() => { logout(); navigate("/login"); }}
                style={{ width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #fecdd3", background: "#fff1f2", color: "#e11d48", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              >
                <LogOut size={18} /> Keluar dari Akun
              </button>
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "2rem", color: "#94a3b8", fontSize: "0.85rem" }}>
          Report.in © 2026 • Sistem Pelaporan Masyarakat
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const SectionLabel = ({ label }: { label: string }) => (
  <div style={{ padding: "0.75rem 2.5rem", background: "#f8fafc", color: "#64748b", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.025em" }}>{label}</div>
);

const ProfileRow = ({ icon, label, value, noBorder }: { icon: React.ReactNode; label: string; value: string; noBorder?: boolean }) => (
  <div style={{ padding: "1.25rem 2.5rem", display: "flex", alignItems: "center", gap: "1rem", borderBottom: noBorder ? "none" : "1px solid #f1f5f9" }}>
    <div style={{ color: "#3b82f6" }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600, margin: 0, textTransform: "uppercase" }}>{label}</p>
      <p style={{ fontSize: "0.95rem", color: "#334155", fontWeight: 600, margin: "0.1rem 0 0" }}>{value}</p>
    </div>
  </div>
);

const ActionRow = ({ icon, label, onClick, noBorder }: { icon: React.ReactNode; label: string; onClick: () => void; noBorder?: boolean }) => (
  <div 
    onClick={onClick}
    style={{ padding: "1.1rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: noBorder ? "none" : "1px solid #f1f5f9", cursor: "pointer" }}
    onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
    onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <div style={{ color: "#3b82f6" }}>{icon}</div>
      <span style={{ fontSize: "0.9rem", color: "#475569", fontWeight: 600 }}>{label}</span>
    </div>
    <ChevronRight size={18} color="#cbd5e1" />
  </div>
);

export default ProfilePage;
