import Reveal from "./Reveal";

const features = [
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Cepat & Mudah",
    description: "Proses pelaporan dirancang agar bisa diselesaikan dalam waktu kurang dari 3 menit dari HP Anda.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Privasi Terjaga",
    description: "Identitas Anda dienkripsi dan bisa disembunyikan. Lapor dengan aman tanpa rasa takut.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: "Update Real-time",
    description: "Dapatkan notifikasi instan setiap kali status laporan Anda berubah atau ditindaklanjuti.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: "Peta Interaktif",
    description: "Lihat titik-titik masalah di sekitar Anda melalui peta laporan publik yang transparan.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Transparansi Data",
    description: "Akses statistik penyelesaian secara terbuka untuk memantau kinerja pemerintah daerah.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: "Respon Langsung",
    description: "Berkomunikasi dua arah dengan petugas lapangan untuk memberikan detail atau menanyakan progres.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="fitur" style={{ padding: "8rem 0", background: "#F8FAFC" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <span style={{
              display: "inline-block",
              fontSize: "0.85rem",
              fontWeight: 800,
              color: "#5b9cf6",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "1rem",
            }}>
              Kenapa Memilih Kami
            </span>
            <h2 style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              marginBottom: "1.25rem",
            }}>
              Lebih dari Sekadar <br className="feature-br" />
              <span style={{ color: "#5b9cf6" }}>Formulir Pengaduan</span>
            </h2>
            <p style={{
              fontSize: "1.15rem",
              color: "#64748b",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}>
              Kami menyediakan alat yang kuat untuk memastikan suara Anda didengar dan ditindaklanjuti.
            </p>
          </div>
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
        }}>
          {features.map((feature, idx) => (
            <Reveal key={feature.title} delay={idx * 100}>
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: 24,
                  padding: "2.5rem",
                  transition: "all 0.3s ease",
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  height: "100%",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px -10px rgba(0, 82, 255, 0.1)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#E0E7FF";
                  
                  const iconContainer = e.currentTarget.querySelector('.icon-container') as HTMLElement;
                  if (iconContainer) {
                    iconContainer.style.background = "#5b9cf6";
                    iconContainer.style.color = "#ffffff";
                    iconContainer.style.transform = "scale(1.1) rotate(5deg)";
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#f1f5f9";
                  
                  const iconContainer = e.currentTarget.querySelector('.icon-container') as HTMLElement;
                  if (iconContainer) {
                    iconContainer.style.background = "#F0F6FF";
                    iconContainer.style.color = "#5b9cf6";
                    iconContainer.style.transform = "scale(1) rotate(0deg)";
                  }
                }}
              >
                <div 
                  className="icon-container"
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: "#F0F6FF",
                    color: "#5b9cf6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.75rem",
                    transition: "all 0.3s ease",
                  }}
                >
                  {feature.icon}
                </div>

                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.01em",
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: "1rem",
                  color: "#64748b",
                  lineHeight: 1.7,
                }}>
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) { .feature-br { display: none; } }
      `}</style>
    </section>
  );
};

export default FeaturesSection;