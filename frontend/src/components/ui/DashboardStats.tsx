import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  total: number;
  pending?: number;
  approved?: number;
  rejected?: number;
}

const DashboardStats = ({ total, pending = 0, approved = 0, rejected = 0 }: Props) => {
  const stats = [
    {
      label: "Total Laporan",
      value: total,
      icon: FileText,
      bg: "#eff6ff",
      color: "#3b82f6",
      accent: "#dbeafe",
    },
    {
      label: "Menunggu",
      value: pending,
      icon: Clock,
      bg: "#fffbeb",
      color: "#f59e0b",
      accent: "#fef3c7",
    },
    {
      label: "Disetujui",
      value: approved,
      icon: CheckCircle2,
      bg: "#f0fdf4",
      color: "#22c55e",
      accent: "#dcfce7",
    },
    {
      label: "Ditolak",
      value: rejected,
      icon: XCircle,
      bg: "#fff1f2",
      color: "#f43f5e",
      accent: "#ffe4e6",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "0.875rem",
        marginBottom: "1.75rem",
      }}
    >
      {stats.map(({ label, value, icon: Icon, bg, color }) => (
        <div
          key={label}
          style={{
            background: "#ffffff",
            borderRadius: 14,
            padding: "1rem 1.1rem",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            display: "flex",
            alignItems: "center",
            gap: "0.875rem",
            transition: "box-shadow 0.2s, transform 0.2s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 6px 20px rgba(0,0,0,0.08)";
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 2px 8px rgba(0,0,0,0.04)";
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: bg,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={18} />
          </div>
          <div>
            <div
              style={{
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: 1.1,
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "#94a3b8",
                marginTop: "0.2rem",
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;