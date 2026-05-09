import { FileText, AlertTriangle, CheckCircle } from "lucide-react";

interface Props {
  total: number;
}

const DashboardStats = ({ total }: Props) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: "1rem",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 20,
          padding: "1.5rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            background: "#eff6ff",
            color: "#5b9cf6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <FileText size={24} />
        </div>

        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          {total}
        </h2>

        <p
          style={{
            color: "#64748b",
            marginTop: "0.4rem",
          }}
        >
          Total Laporan
        </p>
      </div>

      {/* Diproses */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 20,
          padding: "1.5rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            background: "#fff7ed",
            color: "#f97316",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <AlertTriangle size={24} />
        </div>

        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Aktif
        </h2>

        <p
          style={{
            color: "#64748b",
            marginTop: "0.4rem",
          }}
        >
          Status Laporan
        </p>
      </div>

      {/* Sistem */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 20,
          padding: "1.5rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            background: "#ecfdf5",
            color: "#10b981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <CheckCircle size={24} />
        </div>

        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#0f172a",
          }}
        >
          Online
        </h2>

        <p
          style={{
            color: "#64748b",
            marginTop: "0.4rem",
          }}
        >
          Sistem Monitoring
        </p>
      </div>
    </div>
  );
};

export default DashboardStats;