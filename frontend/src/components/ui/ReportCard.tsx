import type { Laporan } from "../../types/laporan.types";
import { MapPin, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  laporan: Laporan;
}

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  pending:  { bg: "#fef3c7", color: "#d97706", label: "Menunggu" },
  approved: { bg: "#dcfce7", color: "#16a34a", label: "Disetujui" },
  rejected: { bg: "#fee2e2", color: "#dc2626", label: "Ditolak" },
};

const ReportCard = ({ laporan }: Props) => {
  const navigate = useNavigate();
  const status = statusConfig[laporan.status] ?? {
    bg: "#f1f5f9",
    color: "#64748b",
    label: laporan.status,
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={() => navigate(`/dashboard/laporan/${laporan.id}`)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 24px rgba(0,0,0,0.09)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 8px rgba(0,0,0,0.04)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* IMAGE */}
      {laporan.image ? (
        <img
          src={`http://localhost:3000/uploads/${laporan.image}`}
          alt={laporan.title}
          style={{
            width: "100%",
            height: 150,
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            height: 120,
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#93c5fd",
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          Tidak ada gambar
        </div>
      )}

      <div style={{ padding: "0.875rem 1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {/* STATUS + SEVERITY */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              background: status.bg,
              color: status.color,
              padding: "0.2rem 0.65rem",
              borderRadius: 999,
              fontSize: "0.7rem",
              fontWeight: 700,
              textTransform: "capitalize",
              letterSpacing: "0.03em",
            }}
          >
            {status.label}
          </span>

          {laporan.severity && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.2rem",
                color: "#94a3b8",
                fontSize: "0.72rem",
                fontWeight: 600,
              }}
            >
              <Tag size={11} />
              {laporan.severity}
            </span>
          )}
        </div>

        {/* TITLE */}
        <h2
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "#0f172a",
            lineHeight: 1.35,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {laporan.title}
        </h2>

        {/* DESC */}
        <p
          style={{
            color: "#64748b",
            fontSize: "0.8rem",
            lineHeight: 1.55,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {laporan.description}
        </p>

        {/* FOOTER */}
        <div
          style={{
            paddingTop: "0.6rem",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            color: "#94a3b8",
            fontSize: "0.72rem",
            fontWeight: 500,
          }}
        >
          <MapPin size={11} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {laporan.latitude}, {laporan.longitude}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;