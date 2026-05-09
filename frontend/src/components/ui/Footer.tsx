const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    Platform: [
      { label: "Cara Kerja", href: "#cara-kerja" },
      { label: "Fitur", href: "#fitur" },
      { label: "Statistik", href: "#statistik" },
      { label: "Peta Laporan", href: "#" },
    ],
    Bantuan: [
      { label: "FAQ", href: "#" },
      { label: "Panduan Pelaporan", href: "#" },
      { label: "Kontak Kami", href: "#" },
      { label: "Kebijakan Privasi", href: "#" },
    ],
    Kategori: [
      { label: "Infrastruktur", href: "#" },
      { label: "Lingkungan", href: "#" },
      { label: "Ketertiban", href: "#" },
      { label: "Pelayanan Publik", href: "#" },
    ],
  };

  return (
    <footer style={{ background: "#0F172A", color: "#ffffff", padding: "6rem 0 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "3rem",
        }}
        className="footer-grid"
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "#5b9cf6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span style={{ fontWeight: 800, fontSize: "1.25rem", display: "block", letterSpacing: "-0.02em" }}>
                  Report<span style={{ color: "#5b9cf6" }}>.in</span>
                </span>
              </div>
            </div>

            <p style={{ color: "rgba(148,163,184,0.9)", fontSize: "0.9rem", lineHeight: 1.75, maxWidth: 280, marginBottom: "1.75rem" }}>
              Platform pengaduan masyarakat digital yang menghubungkan warga dengan RT/RW secara transparan dan akuntabel.
            </p>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 style={{
                fontSize: "0.8rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#93c5fd",
                marginBottom: "1.25rem",
              }}>
                {category}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      style={{
                        color: "rgba(148,163,184,0.8)",
                        fontSize: "0.9rem",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(148,163,184,0.8)"; }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        maxWidth: 1200,
        margin: "0 auto",
        marginTop: "4rem",
        padding: "1.5rem 1.5rem 0",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
      }}>
        <p style={{ color: "rgba(100,116,139,0.9)", fontSize: "0.85rem" }}>
          © {year} Report.in. Hak Cipta Dilindungi.
        </p>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["Syarat & Ketentuan", "Kebijakan Privasi"].map((item) => (
            <a
              key={item}
              href="#"
              style={{ color: "rgba(100,116,139,0.9)", fontSize: "0.85rem", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(100,116,139,0.9)"; }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;