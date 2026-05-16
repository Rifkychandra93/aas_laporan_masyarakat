import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  ArrowRight,
  FileText,
  AlertCircle
} from "lucide-react";
import DashboardNavbar from "../../components/ui/DashboardNavbar";
import { getAllLaporan } from "../../services/laporanService";
import type { Laporan } from "../../types/laporan.types";
import { useAuth } from "../../context/AuthContext";

const statusColors: Record<string, string> = {
  pending: "#d97706",
  approved: "#16a34a",
  rejected: "#dc2626",
};

const HistoryPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      const allData = await getAllLaporan();
      // Filter for current user's reports
      const myData = allData.filter((r: Laporan) => r.user?.id === user?.id);
      setReports(myData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <DashboardNavbar />

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#3b82f6", marginBottom: "0.4rem" }}>
              <HistoryIcon size={20} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Riwayat Aktivitas</span>
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Riwayat Laporan</h1>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "0.25rem" }}>Lihat semua laporan yang pernah kamu kirimkan ke sistem.</p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input 
                type="text" 
                placeholder="Cari laporan..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "0.6rem 1rem 0.6rem 2.5rem",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  fontSize: "0.85rem",
                  width: 240,
                  background: "#fff",
                  outline: "none"
                }}
              />
            </div>
          </div>
        </div>

        {/* LIST TABLE-LIKE VIEW */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {loading ? (
             [...Array(5)].map((_, i) => <div key={i} style={{ height: 100, background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", animation: "pulse 1.5s infinite" }} />)
          ) : filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div 
                key={report.id}
                onClick={() => navigate(`/dashboard/laporan/${report.id}`)}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  padding: "1.25rem 1.5rem",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#3b82f6";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0";
                }}
              >
                {/* DATE BADGE */}
                <div style={{
                  minWidth: 70,
                  height: 70,
                  borderRadius: 16,
                  background: "#f8fafc",
                  border: "1px solid #f1f5f9",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
                    {new Date(report.createdAt).toLocaleDateString('id-ID', { month: 'short' })}
                  </span>
                  <span style={{ fontSize: "1.4rem", fontWeight: 900, color: "#1e293b", lineHeight: 1 }}>
                    {new Date(report.createdAt).getDate()}
                  </span>
                </div>

                {/* INFO */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                    <span style={{ 
                        fontSize: "0.65rem", 
                        fontWeight: 800, 
                        background: report.status === 'pending' ? "#fffbeb" : report.status === 'approved' ? "#f0fdf4" : "#fff1f2",
                        color: statusColors[report.status] || "#64748b",
                        padding: "0.15rem 0.5rem",
                        borderRadius: 6,
                        textTransform: "uppercase"
                    }}>
                      {report.status}
                    </span>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#cbd5e1" }} />
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Clock size={12} /> {new Date(report.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>{report.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "0.25rem 0 0", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {report.description}
                  </p>
                </div>

                <div style={{ color: "#cbd5e1" }}>
                  <ArrowRight size={20} />
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "5rem", background: "#fff", borderRadius: 24, border: "1px dashed #e2e8f0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                    <FileText size={32} color="#cbd5e1" />
                </div>
                <h3 style={{ fontWeight: 700, color: "#475569" }}>Belum ada riwayat</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Laporan yang kamu buat akan muncul di sini.</p>
                <button 
                  onClick={() => navigate("/dashboard/buat-laporan")}
                  style={{ marginTop: "1rem", padding: "0.6rem 1.25rem", borderRadius: 10, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 700, cursor: "pointer" }}
                >
                    Buat Laporan Sekarang
                </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default HistoryPage;
