import Reveal from "./Reveal";

const StatsSection = () => {
  return (
    <section id="statistik" style={{ padding: "6rem 0", background: "#ffffff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        


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
