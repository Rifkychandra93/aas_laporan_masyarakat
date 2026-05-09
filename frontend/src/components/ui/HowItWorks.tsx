import Reveal from "./Reveal";

const steps = [
  {
    number: "1",
    title: "Buat Laporan",
    description: "Tuliskan keluhan atau masalah yang Anda temui. Tambahkan foto jika ada untuk bukti yang lebih kuat.",
  },
  {
    number: "2",
    title: "Verifikasi",
    description: "Laporan Anda akan diverifikasi oleh sistem dan admin kami untuk memastikan validitasnya.",
  },
  {
    number: "3",
    title: "Tindak Lanjut",
    description: "Instansi terkait akan menerima laporan Anda dan segera melakukan tindakan di lapangan.",
  },
  {
    number: "4",
    title: "Selesai",
    description: "Masalah teratasi! Anda akan menerima notifikasi bahwa laporan telah diselesaikan.",
  },
];

const HowItWorks = () => {
  return (
    <section id="cara-kerja" style={{ padding: "8rem 0", background: "#ffffff", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute",
        top: "-10%",
        right: "-5%",
        width: "50%",
        height: "60%",
        background: "radial-gradient(ellipse at right, rgba(0, 82, 255, 0.05) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

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
              Alur Pengaduan
            </span>
            <h2 style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}>
              Cara Kerja Report.in
            </h2>
            <p style={{
              fontSize: "1.15rem",
              color: "#64748b",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}>
              Hanya butuh 4 langkah mudah untuk berpartisipasi dalam membangun lingkungan yang lebih baik.
            </p>
          </div>
        </Reveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "2rem",
          position: "relative",
        }}>
          <div className="connecting-line" style={{
            position: "absolute",
            top: 40,
            left: "12%",
            right: "12%",
            height: 2,
            background: "#f1f5f9",
            zIndex: 0,
          }}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg, #5b9cf6 0%, rgba(0,82,255,0.2) 100%)", borderRadius: 2 }} />
          </div>

          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 200}>
              <div 
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: i === 0 ? "#5b9cf6" : "#ffffff",
                    border: "2px solid #5b9cf6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: i === 0 ? "#ffffff" : "#5b9cf6",
                    marginBottom: "1.5rem",
                    boxShadow: "0 10px 25px rgba(0, 82, 255, 0.15)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 15px 35px rgba(0, 82, 255, 0.25)";
                    (e.currentTarget as HTMLElement).style.background = "#5b9cf6";
                    (e.currentTarget as HTMLElement).style.color = "#ffffff";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 25px rgba(0, 82, 255, 0.15)";
                    (e.currentTarget as HTMLElement).style.background = i === 0 ? "#5b9cf6" : "#ffffff";
                    (e.currentTarget as HTMLElement).style.color = i === 0 ? "#ffffff" : "#5b9cf6";
                  }}
                >
                  {step.number}
                </div>

                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: "0.5rem",
                }}>
                  {step.title}
                </h3>
                
                <p style={{
                  color: "#64748b",
                  lineHeight: 1.6,
                }}>
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) { .connecting-line { display: none !important; } }
      `}</style>
    </section>
  );
};

export default HowItWorks;