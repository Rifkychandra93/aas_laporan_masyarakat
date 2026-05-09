import Reveal from "./Reveal";

const stats = [
  {
    value: "12.400+",
    label: "Laporan Masuk",
    icon: "📋",
    color: "#5b9cf6",
    bg: "#F0F6FF",
  },
  {
    value: "92%",
    label: "Penyelesaian",
    icon: "✅",
    color: "#10b981",
    bg: "#f0fdf4",
  },
  {
    value: "48 Jam",
    label: "Rata-rata Respons",
    icon: "⚡",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    value: "38 Kota",
    label: "Wilayah Aktif",
    icon: "🗺️",
    color: "#8b5cf6",
    bg: "#f5f3ff",
  },
];

const StatsSection = () => {
  return (
    <section id="statistik" style={{ padding: "6rem 0", background: "#ffffff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "2rem",
          marginBottom: "4rem",
        }}>
          {stats.map((stat, idx) => (
            <Reveal key={stat.label} delay={idx * 100}>
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: 24,
                  border: "1px solid #f1f5f9",
                  padding: "2.5rem 2rem",
                  textAlign: "center",
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  height: "100%",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px -10px rgba(0,0,0,0.1)";
                  (e.currentTarget as HTMLElement).style.borderColor = stat.bg;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px -10px rgba(0,0,0,0.05)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#f1f5f9";
                }}
              >
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  background: stat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  fontSize: "2rem",
                }}>
                  {stat.icon}
                </div>

                <p style={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  color: "#0f172a",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                }}>
                  {stat.value}
                </p>

                <p style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#64748b",
                }}>
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} direction="up">
          <div style={{
          background: "#5b9cf6",
          borderRadius: 32,
          padding: "3rem 4rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
          boxShadow: "0 20px 40px rgba(0, 82, 255, 0.2)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: "60%",
            height: "200%",
            background: "radial-gradient(ellipse at right, rgba(255,255,255,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{ color: "#ffffff", position: "relative", zIndex: 1, maxWidth: 600 }}>
            <h3 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 900, marginBottom: "0.75rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              Jadilah Bagian dari Perubahan
            </h3>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem", lineHeight: 1.6 }}>
              Ribuan laporan telah diselesaikan. Kini giliran Anda untuk mewujudkan lingkungan yang lebih baik.
            </p>
          </div>
          <a
            href="/register"
            style={{
              flexShrink: 0,
              display: "inline-block",
              background: "#ffffff",
              color: "#5b9cf6",
              fontWeight: 800,
              fontSize: "1.1rem",
              padding: "1.1rem 2.5rem",
              borderRadius: 100,
              textDecoration: "none",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              position: "relative",
              zIndex: 1,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 15px 35px rgba(0,0,0,0.25)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
            }}
          >
            Daftar Sekarang
          </a>
        </div>
        </Reveal>
      </div>
    </section>
  );
};

export default StatsSection;
