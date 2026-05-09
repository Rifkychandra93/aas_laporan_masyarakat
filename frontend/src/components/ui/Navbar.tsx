import { useState, useEffect } from "react";
import logo from "../../assets/logo1.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Beranda", href: "#hero" },
    { label: "Fitur", href: "#fitur" },
    { label: "Cara Kerja", href: "#cara-kerja" },
    { label: "Statistik", href: "#statistik" },
    { label: "Testimoni", href: "#testimoni" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith("#")) {
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        const top = elem.getBoundingClientRect().top + window.scrollY - 76; // offset for fixed navbar
        window.scrollTo({ top, behavior: "smooth" });
      }
    } else {
      window.location.href = href;
    }
    setMenuOpen(false);
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.3s ease",
        background: scrolled
          ? "rgba(255, 255, 255, 0.45)"
          : "rgba(255, 255, 255, 1)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 4px 20px rgba(91, 156, 246, 0.08)" : "none",
        borderBottom: "1px solid rgba(91, 156, 246, 0.1)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 76 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.15rem", textDecoration: "none" }}>
            <img
              src={logo}
              alt="Report.in Logo"
              style={{
                width: 94,
                height: 94,
                objectFit: "contain",
                flexShrink: 0,
                marginRight: "-0.6rem",
              }}
            />
          <div>
            <span style={{
              fontWeight: 800,
              fontSize: "1.25rem",
              letterSpacing: "-0.02em",
              display: "block",
              lineHeight: 1.1,
              color: "#0f172a",
              transition: "color 0.3s",
            }}>
              Report<span style={{ color: "#5b9cf6" }}>.in</span>
            </span>
            <span style={{
              fontSize: "0.75rem",
              color: "#5b9cf6",
              lineHeight: 1,
              fontWeight: 600,
              transition: "color 0.3s",
            }}>
            </span>
          </div>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="nav-desktop">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 100,
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "#475569",
                textDecoration: "none",
                transition: "all 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.background = "rgba(91, 156, 246, 0.08)";
                (e.target as HTMLElement).style.color = "#5b9cf6";
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.background = "transparent";
                (e.target as HTMLElement).style.color = "#475569";
                (e.target as HTMLElement).style.transform = "scale(1)";
              }}
              onMouseDown={e => { (e.target as HTMLElement).style.transform = "scale(0.92)"; }}
              onMouseUp={e => { (e.target as HTMLElement).style.transform = "scale(1)"; }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }} className="nav-desktop">
          <a
            href="/login"
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: 100,
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#5b9cf6",
              textDecoration: "none",
              border: "2px solid rgba(91, 156, 246, 0.2)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(91, 156, 246, 0.05)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
            onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = "scale(0.95)"; }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            Masuk
          </a>
          <a
            href="/register"
            style={{
              padding: "0.6rem 1.5rem",
              borderRadius: 100,
              fontSize: "0.95rem",
              fontWeight: 700,
              background: "#5b9cf6",
              color: "#ffffff",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(91, 156, 246, 0.3)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(91, 156, 246, 0.4)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(91, 156, 246, 0.3)";
            }}
            onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = "scale(0.95)"; }}
            onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            Daftar Gratis
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="nav-mobile"
          style={{
            padding: "0.5rem",
            borderRadius: 8,
            border: "none",
            background: "transparent",
            color: "#0f172a",
            cursor: "pointer",
            display: "none",
          }}
          aria-label="Menu"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div style={{
          background: "#ffffff",
          borderTop: "1px solid #e2e8f0",
          padding: "1rem 1.5rem 1.5rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                display: "block",
                padding: "1rem 0",
                fontSize: "1.05rem",
                fontWeight: 600,
                color: "#334155",
                borderBottom: "1px solid #f1f5f9",
                textDecoration: "none",
              }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ paddingTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <a
              href="/login"
              style={{
                display: "block",
                textAlign: "center",
                padding: "0.875rem",
                border: "2px solid rgba(91, 156, 246, 0.2)",
                color: "#5b9cf6",
                borderRadius: 100,
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
              }}
            >
              Masuk
            </a>
            <a
              href="/register"
              style={{
                display: "block",
                textAlign: "center",
                padding: "0.875rem",
                background: "#5b9cf6",
                color: "#ffffff",
                borderRadius: 100,
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(91, 156, 246, 0.3)",
              }}
            >
              Daftar Gratis Sekarang
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) { .nav-mobile { display: none !important; } }
        @media (max-width: 767px) { .nav-desktop { display: none !important; } .nav-mobile { display: flex !important; } }
      `}</style>
    </nav>
  );
};

export default Navbar;