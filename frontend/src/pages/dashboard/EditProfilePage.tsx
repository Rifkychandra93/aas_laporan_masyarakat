import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Save, 
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import DashboardNavbar from "../../components/ui/DashboardNavbar";
import { getProfile, updateProfile } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { updateToken } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error", msg: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setName(data.name);
      setEmail(data.email);
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", msg: "Gagal mengambil data profil" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setStatus(null);
    try {
      const response = await updateProfile({ name });
      
      // Update global auth state with new token
      if (response.token) {
        updateToken(response.token);
      }

      setStatus({ type: "success", msg: "Profil berhasil diperbarui!" });
      setTimeout(() => navigate("/dashboard/profile"), 1500);
    } catch (error: any) {
      console.error(error);
      setStatus({ type: "error", msg: error.response?.data?.message || "Gagal memperbarui profil" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardNavbar />
      <div style={{ display: "flex", justifyContent: "center", padding: "10rem" }}>
        <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "#3b82f6" }} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <DashboardNavbar />

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "3rem 1.5rem" }}>
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate("/dashboard/profile")}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "none", color: "#64748b", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", marginBottom: "2rem" }}
        >
          <ArrowLeft size={16} /> Kembali ke Profil
        </button>

        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", padding: "2rem" }}>
          
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>Edit Profil</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "2rem" }}>Ubah nama tampilan Anda di sistem Report.in</p>

          {status && (
            <div style={{ 
              padding: "1rem", 
              borderRadius: 12, 
              background: status.type === "success" ? "#f0fdf4" : "#fff1f2",
              border: `1px solid ${status.type === "success" ? "#bbf7d0" : "#fecdd3"}`,
              color: status.type === "success" ? "#16a34a" : "#dc2626",
              fontSize: "0.85rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem"
            }}>
              {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSave}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Nama Lengkap</label>
              <div style={{ position: "relative" }}>
                <User size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", padding: "0.85rem 1rem 0.85rem 2.75rem", borderRadius: 12, border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.95rem", color: "#1e293b", outline: "none", boxSizing: "border-box" }}
                  placeholder="Masukkan nama baru..."
                />
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Alamat Email (Tidak dapat diubah)</label>
              <input 
                type="text" 
                value={email}
                disabled
                style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: 12, border: "1px solid #e2e8f0", background: "#f1f5f9", fontSize: "0.95rem", color: "#94a3b8", cursor: "not-allowed", boxSizing: "border-box" }}
              />
            </div>

            <button 
              type="submit" 
              disabled={saving || !name.trim()}
              style={{ 
                width: "100%", 
                padding: "1rem", 
                borderRadius: 12, 
                border: "none", 
                background: "#3b82f6", 
                color: "#fff", 
                fontWeight: 700, 
                fontSize: "0.95rem", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "0.6rem",
                boxShadow: "0 4px 12px rgba(59,130,246,0.25)",
                transition: "all 0.2s"
              }}
            >
              {saving ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={18} />}
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default EditProfilePage;
