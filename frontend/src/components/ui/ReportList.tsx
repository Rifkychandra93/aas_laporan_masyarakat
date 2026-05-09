import { useEffect, useState } from "react";
import { getAllLaporan } from "../../services/laporanService";
import type { Laporan } from "../../types/laporan.types";
import ReportCard from "./ReportCard";

const ReportList = () => {
  const [laporan, setLaporan] = useState<Laporan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLaporan();
  }, []);

 const fetchLaporan = async () => {
  try {
    const data = await getAllLaporan();

    console.log(data);

    setLaporan(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return <p>Loading laporan...</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
        gap: "1.5rem",
      }}
    >
      {laporan.map((item) => (
        <ReportCard key={item.id} laporan={item} />
      ))}
    </div>
  );
};

export default ReportList;