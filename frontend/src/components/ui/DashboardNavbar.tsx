import { useState, useRef, useEffect } from "react";
import { Bell, History, User, Plus, LogOut, UserCircle, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo1.png";
import { useAuth } from "../../context/AuthContext";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={navbarStyle}>
      <div style={containerStyle}>
        
        <div 
          onClick={() => navigate("/dashboard")}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
        >
          <img src={logo} alt="Logo" style={logoStyle} />
          <h1 className="brand-text" style={brandNameStyle}>Report.<span style={{ color: "#3b82f6" }}>in</span></h1>
        </div>

        <button 
          className="mobile-toggle"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          style={mobileToggleStyle}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-actions ${showMobileMenu ? 'active' : ''}`} style={navActionsStyle}>
          <button
            onClick={() => navigate("/dashboard/buat-laporan")}
            className="btn-create"
            style={createButtonStyle}
          >
            <Plus size={18} />
            <span className="btn-text">Buat Laporan</span>
          </button>

          <div style={dividerStyle} className="hide-mobile" />

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="action-icons">
            <button 
              onClick={() => navigate("/dashboard/riwayat")}
              style={iconButtonStyle} 
              title="Riwayat"
            >
              <History size={20} />
            </button>
            <button style={iconButtonStyle} title="Notifikasi">
              <Bell size={20} />
            </button>
          </div>

          <div style={dividerStyle} className="hide-mobile" />

          <div style={{ position: "relative" }} ref={dropdownRef} className="profile-section">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              style={profileButtonStyle}
            >
              <div style={avatarCircleStyle}>
                <User size={18} />
              </div>
              <span className="user-name" style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>
                {user?.name?.split(' ')[0] || "User"}
              </span>
            </button>

            {showDropdown && (
              <div style={dropdownStyle}>
                <div style={{ padding: "1rem", borderBottom: "1px solid #f1f5f9" }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 800, color: "#0f172a" }}>{user?.name}</p>
                  <p style={{ margin: "0.1rem 0 0", fontSize: "0.72rem", color: "#94a3b8" }}>{user?.role}</p>
                </div>
                
                <div style={{ padding: "0.5rem" }}>
                  <button 
                    onClick={() => { navigate("/dashboard/profile"); setShowDropdown(false); }}
                    style={dropdownItemStyle}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <UserCircle size={16} /> Profil Saya
                  </button>
                </div>

                <div style={{ padding: "0.5rem", borderTop: "1px solid #f1f5f9" }}>
                  <button 
                    onClick={handleLogout}
                    style={{ ...dropdownItemStyle, color: "#dc2626" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#fff1f2"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <LogOut size={16} /> Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .brand-text { display: none; }
          .btn-text { display: none; }
          .btn-create { padding: 0.6rem !important; border-radius: 12px !important; }
          .hide-mobile { display: none; }
          .user-name { display: none; }
          
          .nav-actions {
            position: fixed;
            top: 72px;
            left: 0;
            right: 0;
            background: #fff;
            padding: 1rem;
            flex-direction: column;
            border-bottom: 1px solid #e2e8f0;
            display: none !important;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          }
          
          .nav-actions.active {
            display: flex !important;
          }

          /* Simplified Mobile Layout: Icons on the right */
          .nav-actions {
            position: static !important;
            display: flex !important;
            flex-direction: row !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            gap: 0.5rem !important;
          }
          
          .mobile-toggle { display: none !important; } /* Hide toggle, use direct icons */
        }

        @media (max-width: 480px) {
          .action-icons { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

const navbarStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(12px)",
  borderBottom: "1px solid #e2e8f0",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  height: 72,
  display: "flex",
  alignItems: "center",
};

const containerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 1400,
  margin: "0 auto",
  padding: "0 1.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const logoStyle: React.CSSProperties = {
  height: 87,
  objectFit: "contain",
  mixBlendMode: "multiply",
};

const brandNameStyle: React.CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: 900,
  color: "#0f172a",
  margin: 0,
  letterSpacing: "-0.02em",
};

const navActionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const createButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.6rem 1rem",
  borderRadius: 12,
  border: "none",
  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
  color: "#fff",
  fontSize: "0.85rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
};

const dividerStyle: React.CSSProperties = {
  width: 1,
  height: 24,
  background: "#e2e8f0",
};

const iconButtonStyle: React.CSSProperties = {
  background: "transparent", border: "none", color: "#64748b",
  width: 40, height: 40, borderRadius: 12, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  transition: "all 0.15s",
};

const profileButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  padding: "0.4rem 0.5rem 0.4rem 0.4rem",
  borderRadius: 99,
  border: "1px solid #e2e8f0",
  background: "#fff",
  cursor: "pointer",
};

const avatarCircleStyle: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: "50%",
  background: "#eff6ff",
  color: "#3b82f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const mobileToggleStyle: React.CSSProperties = {
  display: "none",
  background: "transparent",
  border: "none",
  color: "#475569",
  cursor: "pointer",
};

const dropdownStyle: React.CSSProperties = {
  position: "absolute", top: "calc(100% + 10px)", right: 0,
  width: 200, background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)", overflow: "hidden",
};

const dropdownItemStyle: React.CSSProperties = {
  width: "100%", display: "flex", alignItems: "center", gap: "0.7rem",
  padding: "0.6rem 0.8rem", border: "none", background: "transparent",
  fontSize: "0.82rem", fontWeight: 600, color: "#475569", cursor: "pointer",
  borderRadius: 10, textAlign: "left", transition: "background 0.15s",
};

export default DashboardNavbar;