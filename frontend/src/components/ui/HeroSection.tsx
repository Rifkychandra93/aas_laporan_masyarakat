const HeroSection = () => {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#5b9cf6",
      }}
    >
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at top right, rgba(255,255,255,0.15) 0%, transparent 60%)",
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
      </div>

      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 1.5rem",
        paddingTop: 120,
        paddingBottom: 80,
        display: "flex",
        flexDirection: "row",
        gap: "4rem",
        alignItems: "center",
      }}
      className="hero-inner"
      >
        <div style={{ flex: 1, color: "#ffffff", minWidth: 0 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "rgba(255,255,255,0.15)",
            borderRadius: 100,
            padding: "0.5rem 1.25rem",
            marginBottom: "2rem",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}>
            <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ffffff", letterSpacing: "0.02em" }}>
              Platform Pengaduan Resmi Masyarakat
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(2.5rem, 5.5vw, 4rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "1.5rem",
          }}>
            Laporkan Masalah,
            <br />
            <span style={{ color: "#E0F2FE" }}>
              Wujudkan Perubahan
            </span>
          </h1>

          <p style={{
            fontSize: "clamp(1.1rem, 2vw, 1.25rem)",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.85)",
            marginBottom: "2.5rem",
            maxWidth: 560,
          }}>
            Report.in menghubungkan masyarakat dengan ketua RT/RW. Sampaikan pengaduan dengan mudah,
            cepat, dan transparan karena suara Anda penting untuk perubahan nyata.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", marginBottom: "3rem" }}>
            <a
              href="/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                background: "#ffffff",
                color: "#5b9cf6",
                fontWeight: 800,
                fontSize: "1.05rem",
                padding: "1rem 2rem",
                borderRadius: 100,
                textDecoration: "none",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 15px 35px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
              }}
            >
              Buat Laporan Sekarang
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#cara-kerja"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                background: "rgba(255,255,255,0.1)",
                border: "2px solid rgba(255,255,255,0.3)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "1.05rem",
                padding: "1rem 2rem",
                borderRadius: 100,
                textDecoration: "none",
                transition: "all 0.2s",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
              }}
            >
              Pelajari Cara Kerja
            </a>
          </div>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255,255,255,0.2)",
          }}>
            {[
              { icon: "", text: "Aman & Terenkripsi" },
              { icon: "", text: "Respon Cepat" },
              { icon: "", text: "Pantauan Real-time" },
            ].map((item) => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
                <span style={{ fontSize: "0.95rem", color: "#ffffff", fontWeight: 600 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: "0 0 460px", position: "relative" }} className="hero-card-wrap">
          <div style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: "2rem",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            color: "#0f172a",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>
                  Laporan Terbaru
                </h3>
              </div>
              <div style={{
                width: 44, height: 44,
                borderRadius: 12,
                background: "#F0F6FF",
                color: "#5b9cf6",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { title: "Jalan berlubang Jl. Sudirman", status: "Diproses", statusColor: "#d97706", statusBg: "#fef3c7", dot: "#f59e0b", time: "2 jam lalu" },
                { title: "Lampu jalan mati RT 05", status: "Selesai", statusColor: "#059669", statusBg: "#d1fae5", dot: "#10b981", time: "1 hari lalu" },
                { title: "Sampah menumpuk Pasar Baru", status: "Diterima", statusColor: "#5b9cf6", statusBg: "#eff6ff", dot: "#3b82f6", time: "2 hari lalu" },
              ].map((report) => (
                <div key={report.title} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  background: "#ffffff",
                  borderRadius: 16,
                  padding: "1rem",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: report.dot, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {report.title}
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 4 }}>{report.time}</p>
                  </div>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    padding: "0.3rem 0.75rem",
                    borderRadius: 100,
                    background: report.statusBg,
                    color: report.statusColor,
                    flexShrink: 0,
                  }}>
                    {report.status}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "1.5rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid #e2e8f0",
            }}>
              <p style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: 500 }}>Total bulan ini</p>
              <p style={{ fontSize: "1.05rem", fontWeight: 900, color: "#0f172a" }}>247 Laporan Masuk</p>
            </div>
          </div>

          <div style={{
            position: "absolute",
            top: -20,
            right: -20,
            background: "#10b981",
            color: "#fff",
            borderRadius: 100,
            padding: "0.75rem 1.25rem",
            fontSize: "0.9rem",
            fontWeight: 800,
            boxShadow: "0 10px 25px rgba(16,185,129,0.3)",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Terverifikasi
          </div>

          <div style={{
            position: "absolute",
            bottom: -30,
            left: -30,
            background: "#ffffff",
            borderRadius: 20,
            padding: "1.25rem 1.5rem",
            boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
            border: "1px solid #f1f5f9",
          }}>
            <p style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Tingkat Penyelesaian</p>
            <p style={{ fontSize: "2rem", fontWeight: 900, color: "#5b9cf6", lineHeight: 1 }}>92%</p>
            <div style={{ marginTop: 12, width: 140, height: 8, background: "#e2e8f0", borderRadius: 100, overflow: "hidden" }}>
              <div style={{ width: "92%", height: "100%", background: "#5b9cf6", borderRadius: 100 }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: -2, left: 0, right: 0 }}>
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%", height: "auto" }}>
          <path
            d="M0 80L60 74.7C120 69.3 240 58.7 360 53.3C480 48 600 48 720 53.3C840 58.7 960 69.3 1080 69.3C1200 69.3 1320 58.7 1380 53.3L1440 48V80H0Z"
            fill="white"
          />
        </svg>
      </div>

      <style>{`
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @media (max-width: 992px) {
          .hero-inner { flex-direction: column !important; padding-top: 140px !important; padding-bottom: 120px !important; text-align: center; }
          .hero-inner > div:first-child { display: flex; flex-direction: column; alignItems: center; }
          .hero-inner p { margin-left: auto; margin-right: auto; }
          .hero-inner .trust-indicators { justify-content: center; }
          .hero-card-wrap { display: none !important; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
