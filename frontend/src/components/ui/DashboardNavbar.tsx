import { useState, useRef, useEffect } from "react";
import { Bell, History, User, Plus, LogOut, UserCircle, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo1.png";
import { useAuth } from "../../context/AuthContext";
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from "../../services/notificationService";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const fetchNotificationsData = async () => {
    try {
      const data = await getNotifications();
      setNotificationsList(data);
      const unread = data.filter((n: any) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Gagal memuat notifikasi:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotificationsData();
      // Poll every 30 seconds for live updates
      const interval = setInterval(fetchNotificationsData, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      fetchNotificationsData();
    } catch (error) {
      console.error("Gagal menandai notifikasi:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      fetchNotificationsData();
    } catch (error) {
      console.error("Gagal menandai semua notifikasi:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
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
            <div style={{ position: "relative", display: "flex", alignItems: "center" }} ref={notificationsRef}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowDropdown(false);
                }}
                style={iconButtonStyle} 
                title="Notifikasi"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={unreadBadgeStyle}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div style={notificationsDropdownStyle}>
                  <div style={notifHeaderStyle}>
                    <h4 style={{ margin: 0, fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>Notifikasi</h4>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} style={markAllBtnStyle}>
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>

                  <div style={notifListStyle}>
                    {notificationsList.length > 0 ? (
                      notificationsList.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => handleMarkAsRead(notif.id)}
                          style={{
                            ...notifItemStyle,
                            background: notif.isRead ? "transparent" : "#eff6ff",
                          }}
                        >
                          <div style={{ display: "flex", gap: "0.75rem", width: "100%" }}>
                            <div style={{
                              ...notifIconBgStyle,
                              background: notif.title.includes("Disetujui") ? "#ecfdf5" : "#fef2f2",
                              color: notif.title.includes("Disetujui") ? "#10b981" : "#ef4444",
                            }}>
                              {notif.title.includes("Disetujui") ? "✓" : "✕"}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={notifTitleStyle}>{notif.title}</p>
                              <p style={notifMessageStyle}>{notif.message}</p>
                              <span style={notifDateStyle}>
                                {new Date(notif.createdAt).toLocaleDateString("id-ID", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                            </div>
                            {!notif.isRead && (
                              <div style={unreadDotStyle} />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "#94a3b8" }}>
                        <Bell size={28} style={{ marginBottom: "0.5rem", color: "#cbd5e1" }} />
                        <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600 }}>Tidak ada notifikasi baru</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
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

const unreadBadgeStyle: React.CSSProperties = {
  position: "absolute",
  top: 4,
  right: 4,
  background: "#ef4444",
  color: "#fff",
  borderRadius: "50%",
  width: 16,
  height: 16,
  fontSize: "0.62rem",
  fontWeight: 800,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid #fff",
  boxShadow: "0 2px 5px rgba(239, 68, 68, 0.2)",
};

const notificationsDropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 10px)",
  right: 0,
  width: 320,
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  overflow: "hidden",
  zIndex: 1001,
};

const notifHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.9rem 1rem",
  borderBottom: "1px solid #f1f5f9",
};

const markAllBtnStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#3b82f6",
  fontSize: "0.72rem",
  fontWeight: 700,
  cursor: "pointer",
  padding: 0,
};

const notifListStyle: React.CSSProperties = {
  maxHeight: 300,
  overflowY: "auto",
};

const notifItemStyle: React.CSSProperties = {
  padding: "0.85rem 1rem",
  borderBottom: "1px solid #f8fafc",
  cursor: "pointer",
  transition: "background 0.15s",
};

const notifIconBgStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: "0.8rem",
  flexShrink: 0,
};

const notifTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.8rem",
  fontWeight: 800,
  color: "#0f172a",
};

const notifMessageStyle: React.CSSProperties = {
  margin: "0.15rem 0 0",
  fontSize: "0.74rem",
  color: "#475569",
  lineHeight: 1.45,
};

const notifDateStyle: React.CSSProperties = {
  display: "block",
  marginTop: "0.3rem",
  fontSize: "0.68rem",
  color: "#94a3b8",
};

const unreadDotStyle: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: "50%",
  background: "#3b82f6",
  alignSelf: "center",
  flexShrink: 0,
  boxShadow: "0 0 8px #3b82f6",
};

export default DashboardNavbar;