import Reveal from "./Reveal";

const testimonials = [
  {
    name: "Budi Santoso",
    role: "Warga Jakarta Selatan",
    text: "Sangat mudah digunakan! Laporan jalan berlubang di depan rumah saya langsung diperbaiki dalam waktu 2 hari. Terima kasih Report.in!",
    initials: "BS",
  },
  {
    name: "Siti Rahma",
    role: "Mahasiswa",
    text: "Dulu bingung mau lapor lampu jalan mati kemana. Sekarang tinggal foto, upload, dan tunggu petugas datang. Sangat transparan.",
    initials: "SR",
  },
  {
    name: "Ahmad Fauzi",
    role: "Pelaku UMKM",
    text: "Sistem trackingnya sangat membantu. Kita jadi tahu sampai mana laporan kita diproses. Pelayanan publik jadi jauh lebih baik.",
    initials: "AF",
  },
];

const TestimoniSection = () => {
  return (
    <section id="testimoni" style={{ padding: "8rem 0", background: "#ffffff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span style={{
              display: "inline-block",
              fontSize: "0.85rem",
              fontWeight: 800,
              color: "#5b9cf6",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "1rem",
            }}>
              Kisah Nyata
            </span>
            <h2 style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
            }}>
              Suara Mereka yang <br className="feature-br" />
              Telah <span style={{ color: "#5b9cf6" }}>Didengar</span>
            </h2>
          </div>
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}>
          {testimonials.map((t, idx) => (
            <Reveal key={t.name} delay={idx * 100}>
              <div
                style={{
                  background: "#F8FAFC",
                  borderRadius: 24,
                  padding: "2.5rem",
                  transition: "all 0.3s ease",
                  height: "100%",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "#ffffff";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px -10px rgba(0,0,0,0.1)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "#F8FAFC";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", gap: "4px", marginBottom: "1.5rem", color: "#fbbf24", fontSize: "1.25rem" }}>
                </div>
                <p style={{
                  fontSize: "1.1rem",
                  color: "#334155",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                  fontStyle: "italic",
                }}>
                  "{t.text}"
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#5b9cf6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "1rem",
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a" }}>{t.name}</p>
                    <p style={{ fontSize: "0.85rem", color: "#64748b" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimoniSection;