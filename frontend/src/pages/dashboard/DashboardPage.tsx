import DashboardNavbar from "../../components/ui/DashboardNavbar";
import ReportList from "../../components/ui/ReportList";
import DashboardStats from "../../components/ui/DashboardStats";
import { useEffect, useState } from "react";
import { getAllLaporan } from "../../services/laporanService";

const DashboardPage = () => {
   const [reports, setReports] = useState([]);

   useEffect(() => {
      fetchLaporan();
   }, []);

   const fetchLaporan = async () => {
      try {
         const data = await getAllLaporan();
         setReports(data);
      } catch (error) {
         console.log(error);
      }
   };

   return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <DashboardNavbar />

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <div
          style={{
            marginBottom: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Laporan Warga
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "0.5rem",
            }}
          >
            Semua laporan terbaru dari masyarakat
          </p>
        </div>

        <DashboardStats total={reports.length} />

        <ReportList />
      </div>
    </div>
  );
};

export default DashboardPage;