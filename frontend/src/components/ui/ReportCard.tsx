import type { Laporan } from "../../types/laporan.types";

interface Props {
  laporan: Laporan;
}

const ReportCard = ({ laporan }: Props) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      }}
    >
      {/* IMAGE */}
      {laporan.image ? (
        <img
          src={`http://localhost:5000/uploads/${laporan.image}`}
          alt={laporan.title}
          style={{
            width: "100%",
            height: 220,
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            height: 220,
            background: "#eff6ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#5b9cf6",
            fontWeight: 700,
          }}
        >
          Tidak ada gambar
        </div>
      )}

      <div style={{ padding: "1.2rem" }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.8rem",
            alignItems: "center",
          }}
        >
          <span
            style={{
              background:
                laporan.status === "pending"
                  ? "#fef3c7"
                  : laporan.status === "approved"
                  ? "#dcfce7"
                  : "#fee2e2",

              color:
                laporan.status === "pending"
                  ? "#d97706"
                  : laporan.status === "approved"
                  ? "#16a34a"
                  : "#dc2626",

              padding: "0.35rem 0.9rem",
              borderRadius: 999,
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "capitalize",
            }}
          >
            {laporan.status}
          </span>

          <span
            style={{
              color: "#64748b",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {laporan.severity}
          </span>
        </div>

        {/* TITLE */}
        <h2
          style={{
            fontSize: "1.2rem",
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: "0.7rem",
          }}
        >
          {laporan.title}
        </h2>

        {/* DESC */}
        <p
          style={{
            color: "#64748b",
            lineHeight: 1.6,
            fontSize: "0.95rem",
          }}
        >
          {laporan.description}
        </p>

        {/* FOOTER */}
        <div
          style={{
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              color: "#475569",
            }}
          >
            📍 {laporan.latitude}, {laporan.longitude}
          </span>

          <span
            style={{
              fontSize: "0.85rem",
              color: "#5b9cf6",
              fontWeight: 700,
            }}
          >
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;