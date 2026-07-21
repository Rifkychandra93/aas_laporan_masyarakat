import DashboardNavbar from "../../components/ui/DashboardNavbar";
import ReportList from "../../components/ui/ReportList";
import DashboardStats from "../../components/ui/DashboardStats";
import { useEffect, useState } from "react";
import { getAllLaporan } from "../../services/laporanService";
import type { Laporan } from "../../types/laporan.types";
import { useAuth } from "../../context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      const data = await getAllLaporan();
      setReports(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const myReports = reports.filter((r) => r.user?.id === user?.id);

  const pending  = reports.filter((r) => r.status === "pending").length;
  const approved = reports.filter((r) => r.status === "approved").length;
  const rejected = reports.filter((r) => r.status === "rejected").length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <DashboardNavbar />

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "1.75rem 1.5rem 4rem",
        }}
        >
          {/* PAGE HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
            <div>
              <h1
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Halo, {user?.name || "Warga"} 
              </h1>
              <p
                style={{
                  color: "#94a3b8",
                  marginTop: "0.4rem",
                  fontSize: "0.9rem",
                }}
              >
                Pantau dan laporkan kejadian di sekitar kamu dengan mudah.
              </p>
            </div>
          </div>

        <DashboardStats
          total={reports.length}
          pending={pending}
          approved={approved}
          rejected={rejected}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "3rem", marginTop: "1rem" }}>
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Laporan Saya
                </h2>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>
                  Daftar laporan yang kamu buat sendiri
                </p>
              </div>
              <span style={{ marginLeft: "auto", fontSize: "0.75rem", fontWeight: 700, color: "#3b82f6", background: "#eff6ff", padding: "0.25rem 0.75rem", borderRadius: 999 }}>
                {myReports.length} Laporan
              </span>
            </div>
            
            <ReportList reports={myReports} isLoading={loading} />
          </section>
          <section>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Semua Laporan Warga
                </h2>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>
                  Informasi terkini dari seluruh lingkungan masyarakat
                </p>
              </div>
              <span style={{ marginLeft: "auto", fontSize: "0.75rem", fontWeight: 700, color: "#16a34a", background: "#f0fdf4", padding: "0.25rem 0.75rem", borderRadius: 999 }}>
                {reports.length} Laporan
              </span>
            </div>

            <ReportList reports={reports} isLoading={loading} />
          </section>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;