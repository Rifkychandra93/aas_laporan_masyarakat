import { useEffect, useState } from "react";
import { getAllLaporan } from "../../services/laporanService";
import type { Laporan } from "../../types/laporan.types";
import ReportCard from "./ReportCard";
import { FileX } from "lucide-react";

interface ReportListProps {
  reports?: Laporan[];
  isLoading?: boolean;
}

const ReportList = ({ reports, isLoading }: ReportListProps) => {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reports) {
      setLaporan(reports);
      setLoading(isLoading ?? false);
    } else {
      fetchLaporan();
    }
  }, [reports, isLoading]);

  const fetchLaporan = async () => {
    try {
      const data = await getAllLaporan();
      setLaporan(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1rem",
        }}
      >
        {[...Array(reports?.length || 4)].map((_, i) => (
          <div
            key={i}
            style={{
              background: "#ffffff",
              borderRadius: 14,
              height: 260,
              border: "1px solid #e2e8f0",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        ))}
      </div>
    );
  }

  if (laporan.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #e2e8f0",
          color: "#94a3b8",
        }}
      >
        <FileX size={32} style={{ margin: "0 auto 0.5rem", opacity: 0.4 }} />
        <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>Tidak ada laporan ditemukan</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "1rem",
      }}
    >
      {laporan.map((item) => (
        <ReportCard key={item.id} laporan={item} />
      ))}
    </div>
  );
};

export default ReportList;