import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  LogOut,
  MapPin,
  Calendar,
  Search,
  Menu,
  X,
  ChevronRight,
  Image as ImageIcon,
  User,
  Filter,
  Check,
  ExternalLink
} from "lucide-react";
import logo from "../../assets/logo1.png";
import { useAuth } from "../../context/AuthContext";
import {
  getAdminStats,
  getAllUsers,
  approveLaporan,
  rejectLaporan,
  deleteLaporanAdmin,
  deleteUserAdmin,
  type AdminStats,
  type AdminUser
} from "../../services/adminService";
import { getAllLaporan } from "../../services/laporanService";
import type { Laporan } from "../../types/laporan.types";

const severityColors: Record<string, { bg: string; text: string }> = {
  rendah: { bg: "#f0fdf4", text: "#16a34a" },
  sedang: { bg: "#fef3c7", text: "#d97706" },
  tinggi: { bg: "#fef2f2", text: "#dc2626" },
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "#fffbeb", text: "#d97706", border: "#fef3c7" },
  approved: { bg: "#f0fdf4", text: "#16a34a", border: "#dcfce7" },
  rejected: { bg: "#fef2f2", text: "#dc2626", border: "#fee2e2" },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Tabs: 'overview' | 'users' | 'reports'
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "reports">("overview");
  
  // Data State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [reportsList, setReportsList] = useState<Laporan[]>([]);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [searchReport, setSearchReport] = useState("");
  const [reportFilter, setReportFilter] = useState<string>("all"); // 'all' | 'pending' | 'approved' | 'rejected'
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null); // holds report ID currently being updated
  
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, reportsData] = await Promise.all([
        getAdminStats(),
        getAllUsers(),
        getAllLaporan()
      ]);
      setStats(statsData);
      setUsersList(usersData);
      // Sort reports by newest
      const sortedReports = [...reportsData].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setReportsList(sortedReports);
    } catch (error) {
      console.error("Gagal mengambil data admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStatsAndReports = async () => {
    try {
      const [statsData, reportsData] = await Promise.all([
        getAdminStats(),
        getAllLaporan()
      ]);
      setStats(statsData);
      const sortedReports = [...reportsData].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setReportsList(sortedReports);
    } catch (error) {
      console.error("Gagal menyegarkan data:", error);
    }
  };

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      await approveLaporan(id);
      await handleRefreshStatsAndReports();
    } catch (error) {
      alert("Gagal menyetujui laporan");
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try {
      await rejectLaporan(id);
      await handleRefreshStatsAndReports();
    } catch (error) {
      alert("Gagal menolak laporan");
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteReport = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan, dan pembuat laporan akan dikirimi notifikasi.")) {
      return;
    }
    setActionLoading(id);
    try {
      await deleteLaporanAdmin(id);
      await handleRefreshStatsAndReports();
    } catch (error) {
      alert("Gagal menghapus laporan");
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pengguna ini? Pengguna tidak akan dapat login atau mendaftar kembali dengan email tersebut.")) {
      return;
    }
    setActionLoading(id);
    try {
      await deleteUserAdmin(id);
      const updatedUsers = await getAllUsers();
      setUsersList(updatedUsers);
    } catch (error) {
      alert("Gagal menghapus pengguna");
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Filters and searches
  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    (u.location && u.location.toLowerCase().includes(searchUser.toLowerCase()))
  );

  const filteredReports = reportsList.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchReport.toLowerCase()) ||
      r.description.toLowerCase().includes(searchReport.toLowerCase()) ||
      (r.user && r.user.name.toLowerCase().includes(searchReport.toLowerCase()));
    
    if (reportFilter === "all") return matchesSearch;
    return matchesSearch && r.status === reportFilter;
  });

  const getReportImageUrl = (imageName: string | null) => {
    if (!imageName) return null;
    return `http://localhost:3000/uploads/${imageName}`;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      
      {/* SIDEBAR */}
      <aside style={{
        ...sidebarStyle,
        transform: sidebarOpen ? "translateX(0)" : undefined,
      }} className="admin-sidebar">
        <div>
          {/* Sidebar Brand Logo */}
          <div style={brandContainerStyle}>
            <img 
              src={logo} 
              alt="Logo" 
              style={{
                width: 56,
                height: 56,
                objectFit: "contain",
                mixBlendMode: "multiply",
              }} 
            />
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>
                Report.<span style={{ color: "#3b82f6" }}>in</span>
              </h2>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "1rem" }}>
            <button
              onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}
              style={activeTab === "overview" ? activeSidebarItemStyle : sidebarItemStyle}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab("users"); setSidebarOpen(false); }}
              style={activeTab === "users" ? activeSidebarItemStyle : sidebarItemStyle}
            >
              <Users size={18} />
              <span style={{ flex: 1, textAlign: "left" }}>Kelola Pengguna</span>
              {stats && (
                <span style={sidebarBadgeStyle}>{stats.totalUser}</span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab("reports"); setSidebarOpen(false); }}
              style={activeTab === "reports" ? activeSidebarItemStyle : sidebarItemStyle}
            >
              <FileText size={18} />
              <span style={{ flex: 1, textAlign: "left" }}>Validasi Laporan</span>
              {stats && stats.pendingLaporan > 0 && (
                <span style={sidebarBadgePendingStyle}>{stats.pendingLaporan}</span>
              )}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Account & Logout */}
        <div style={sidebarFooterStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={adminAvatarStyle}>
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: "#1e293b", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {user?.name || "Admin"}
              </p>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "#64748b", textTransform: "capitalize" }}>
                {user?.role || "Administrator"}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            <LogOut size={16} />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={sidebarOverlayStyle}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, marginLeft: sidebarWidth }} className="admin-main">
        
        {/* HEADER NAVBAR */}
        <header style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={sidebarToggleStyle} className="sidebar-toggle-btn">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Dashboard Admin
              </h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }} className="header-right">
            <div style={dateWidgetStyle}>
              <Calendar size={14} color="#3b82f6" />
              <span>{new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </div>
        </header>

        {/* CONTAINER CONTENT */}
        <div style={{ padding: "1.5rem", flex: 1, overflowY: "auto" }}>
          
          {loading ? (
            <div style={loaderContainerStyle}>
              <div style={spinnerStyle} />
              <p style={{ marginTop: "1rem", color: "#64748b", fontWeight: 600 }}>Memuat data portal admin...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  
                  {/* METRIC COUNTERS GRID */}
                  <div style={metricsGridStyle}>
                    <div style={{ ...metricCardStyle, borderLeft: "4px solid #3b82f6" }}>
                      <div style={metricContentStyle}>
                        <div>
                          <p style={metricLabelStyle}>Total Pengguna</p>
                          <h3 style={metricValueStyle}>{stats?.totalUser || 0}</h3>
                        </div>
                        <div style={{ ...metricIconBgStyle, background: "#eff6ff", color: "#3b82f6" }}>
                          <Users size={20} />
                        </div>
                      </div>
                    </div>

                    <div style={{ ...metricCardStyle, borderLeft: "4px solid #6366f1" }}>
                      <div style={metricContentStyle}>
                        <div>
                          <p style={metricLabelStyle}>Total Laporan</p>
                          <h3 style={metricValueStyle}>{stats?.totalLaporan || 0}</h3>
                        </div>
                        <div style={{ ...metricIconBgStyle, background: "#e0e7ff", color: "#6366f1" }}>
                          <FileText size={20} />
                        </div>
                      </div>
                    </div>

                    <div style={{ ...metricCardStyle, borderLeft: "4px solid #f59e0b" }}>
                      <div style={metricContentStyle}>
                        <div>
                          <p style={metricLabelStyle}>Menunggu Persetujuan</p>
                          <h3 style={metricValueStyle}>{stats?.pendingLaporan || 0}</h3>
                        </div>
                        <div style={{ ...metricIconBgStyle, background: "#fffbeb", color: "#f59e0b" }}>
                          <Clock size={20} />
                        </div>
                      </div>
                    </div>

                    <div style={{ ...metricCardStyle, borderLeft: "4px solid #10b981" }}>
                      <div style={metricContentStyle}>
                        <div>
                          <p style={metricLabelStyle}>Laporan Disetujui</p>
                          <h3 style={metricValueStyle}>{stats?.approvedLaporan || 0}</h3>
                        </div>
                        <div style={{ ...metricIconBgStyle, background: "#ecfdf5", color: "#10b981" }}>
                          <CheckCircle2 size={20} />
                        </div>
                      </div>
                    </div>

                    <div style={{ ...metricCardStyle, borderLeft: "4px solid #ef4444" }}>
                      <div style={metricContentStyle}>
                        <div>
                          <p style={metricLabelStyle}>Laporan Ditolak</p>
                          <h3 style={metricValueStyle}>{stats?.rejectedLaporan || 0}</h3>
                        </div>
                        <div style={{ ...metricIconBgStyle, background: "#fef2f2", color: "#ef4444" }}>
                          <XCircle size={20} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QUICK STATS ROW */}
                  <div style={overviewRowStyle}>
                    
                    {/* RECENT REPORTS */}
                    <div style={{ ...whiteCardStyle, flex: 2, minWidth: 290 }}>
                      <div style={cardHeaderStyle}>
                        <h4 style={cardTitleStyle}>Laporan Terbaru Masuk</h4>
                        <button onClick={() => setActiveTab("reports")} style={cardActionLinkStyle}>
                          <span>Lihat Semua</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                        {reportsList.slice(0, 4).length > 0 ? (
                          reportsList.slice(0, 4).map((r) => {
                            const sc = statusColors[r.status] || { bg: "#f1f5f9", text: "#64748b", border: "#cbd5e1" };
                            return (
                              <div 
                                key={r.id} 
                                style={recentReportItemStyle}
                                onClick={() => setActiveTab("reports")}
                              >
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                                    <span style={{
                                      fontSize: "0.65rem",
                                      fontWeight: 800,
                                      padding: "0.1rem 0.4rem",
                                      borderRadius: 6,
                                      background: sc.bg,
                                      color: sc.text,
                                      textTransform: "uppercase"
                                    }}>
                                      {r.status}
                                    </span>
                                    <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                                      {new Date(r.createdAt).toLocaleDateString("id-ID", { month: "short", day: "numeric" })}
                                    </span>
                                  </div>
                                  <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, color: "#1e293b" }}>{r.title}</p>
                                  <p style={{ margin: "0.1rem 0 0", fontSize: "0.75rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    Oleh: {r.user?.name || "Anonim"}
                                  </p>
                                </div>
                                <ChevronRight size={16} color="#cbd5e1" />
                              </div>
                            );
                          })
                        ) : (
                          <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>Belum ada laporan masuk.</div>
                        )}
                      </div>
                    </div>

                    {/* NEWEST USERS SUMMARY */}
                    <div style={{ ...whiteCardStyle, flex: 1, minWidth: 290 }}>
                      <div style={cardHeaderStyle}>
                        <h4 style={cardTitleStyle}>Pengguna Baru Terdaftar</h4>
                        <button onClick={() => setActiveTab("users")} style={cardActionLinkStyle}>
                          <span>Kelola</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginTop: "1rem" }}>
                        {usersList.slice(0, 4).length > 0 ? (
                          usersList.slice(0, 4).map((u) => (
                            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div style={smallAvatarStyle}>
                                {u.name[0].toUpperCase()}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</p>
                                <p style={{ margin: 0, fontSize: "0.7rem", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</p>
                              </div>
                              <span style={{ fontSize: "0.7rem", color: "#cbd5e1", fontWeight: 600 }}>
                                {u._count?.laporan || 0} Lapor
                              </span>
                            </div>
                          ))
                        ) : (
                          <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>Belum ada pengguna.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MANAGE USERS */}
              {activeTab === "users" && (
                <div style={whiteCardStyle}>
                  
                  {/* BAR CONTROL */}
                  <div style={barControlStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                        Daftar Pengguna Aktif
                      </h4>
                      <span style={{
                        background: "#eff6ff",
                        color: "#3b82f6",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        padding: "0.15rem 0.5rem",
                        borderRadius: 12
                      }}>
                        {filteredUsers.length} Terdaftar
                      </span>
                    </div>

                    <div style={searchContainerStyle}>
                      <Search size={16} color="#94a3b8" />
                      <input
                        type="text"
                        placeholder="Cari pengguna berdasarkan nama/email/lokasi..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        style={searchInputStyle}
                      />
                    </div>
                  </div>

                  {/* USER TABLE CONTAINER */}
                  <div style={{ overflowX: "auto", margin: "1rem -1.5rem -1.5rem", borderTop: "1px solid #f1f5f9" }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr style={tableRowHeaderStyle}>
                          <th style={{ ...tableHeaderCellStyle, paddingLeft: "1.5rem" }}>PENGGUNA</th>
                          <th style={tableHeaderCellStyle}>LOKASI</th>
                          <th style={tableHeaderCellStyle}>TANGGAL GABUNG</th>
                          <th style={{ ...tableHeaderCellStyle, textAlign: "center" }}>LAPORAN DIBUAT</th>
                          <th style={tableHeaderCellStyle}>ROLE</th>
                          <th style={{ ...tableHeaderCellStyle, paddingRight: "1.5rem", width: 100 }}>AKSI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((u) => (
                            <tr key={u.id} style={tableRowStyle}>
                              <td style={{ ...tableBodyCellStyle, paddingLeft: "1.5rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                  <div style={tableAvatarStyle}>
                                    {u.name[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <p style={{ margin: 0, fontWeight: 700, color: "#1e293b", fontSize: "0.85rem" }}>{u.name}</p>
                                    <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.75rem" }}>{u.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td style={{ ...tableBodyCellStyle, color: u.location ? "#475569" : "#cbd5e1" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem" }}>
                                  <MapPin size={14} color={u.location ? "#94a3b8" : "#cbd5e1"} />
                                  <span>{u.location || "Tidak ditentukan"}</span>
                                </div>
                              </td>
                              <td style={{ ...tableBodyCellStyle, fontSize: "0.82rem", color: "#475569" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                  <Calendar size={14} color="#94a3b8" />
                                  <span>{new Date(u.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</span>
                                </div>
                              </td>
                              <td style={{ ...tableBodyCellStyle, textAlign: "center" }}>
                                <span style={{
                                  fontSize: "0.8rem",
                                  fontWeight: 800,
                                  background: (u._count?.laporan || 0) > 0 ? "#eff6ff" : "#f1f5f9",
                                  color: (u._count?.laporan || 0) > 0 ? "#3b82f6" : "#94a3b8",
                                  padding: "0.2rem 0.6rem",
                                  borderRadius: 8
                                }}>
                                  {u._count?.laporan || 0}
                                </span>
                              </td>
                              <td style={tableBodyCellStyle}>
                                <span style={{
                                  fontSize: "0.65rem",
                                  fontWeight: 800,
                                  padding: "0.15rem 0.5rem",
                                  borderRadius: 6,
                                  textTransform: "uppercase",
                                  background: u.role?.toLowerCase() === "admin" ? "#e0e7ff" : "#f1f5f9",
                                  color: u.role?.toLowerCase() === "admin" ? "#4f46e5" : "#64748b"
                                }}>
                                  {u.role}
                                </span>
                              </td>
                              <td style={{ ...tableBodyCellStyle, paddingRight: "1.5rem" }}>
                                {u.role?.toLowerCase() !== "admin" && (
                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    disabled={actionLoading === u.id}
                                    style={{
                                      background: "#fef2f2",
                                      color: "#dc2626",
                                      border: "none",
                                      padding: "0.4rem 0.8rem",
                                      borderRadius: 6,
                                      fontSize: "0.75rem",
                                      fontWeight: 600,
                                      cursor: actionLoading === u.id ? "not-allowed" : "pointer",
                                      opacity: actionLoading === u.id ? 0.7 : 1
                                    }}
                                  >
                                    {actionLoading === u.id ? "Menghapus..." : "Hapus"}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} style={{ textAlign: "center", padding: "4rem", color: "#94a3b8" }}>
                              Tidak ada pengguna ditemukan.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: VERIFY REPORTS */}
              {activeTab === "reports" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  
                  {/* CONTROLS BAR */}
                  <div style={whiteCardStyle}>
                    <div style={reportsBarControlStyle}>
                      {/* Search */}
                      <div style={{ ...searchContainerStyle, flex: 1, minWidth: 260 }}>
                        <Search size={16} color="#94a3b8" />
                        <input
                          type="text"
                          placeholder="Cari laporan berdasarkan judul, deskripsi, atau pelapor..."
                          value={searchReport}
                          onChange={(e) => setSearchReport(e.target.value)}
                          style={searchInputStyle}
                        />
                      </div>

                      {/* Filters */}
                      <div style={filtersGroupStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#64748b", fontSize: "0.8rem", fontWeight: 700 }}>
                          <Filter size={14} />
                          <span>Status:</span>
                        </div>
                        
                        <div style={{ display: "flex", gap: "0.3rem" }}>
                          <button
                            onClick={() => setReportFilter("all")}
                            style={reportFilter === "all" ? activeFilterButtonStyle : filterButtonStyle}
                          >
                            Semua ({reportsList.length})
                          </button>
                          <button
                            onClick={() => setReportFilter("pending")}
                            style={reportFilter === "pending" ? activeFilterButtonStylePending : filterButtonStyle}
                          >
                            Pending ({reportsList.filter(r => r.status === "pending").length})
                          </button>
                          <button
                            onClick={() => setReportFilter("approved")}
                            style={reportFilter === "approved" ? activeFilterButtonStyleApproved : filterButtonStyle}
                          >
                            Approved ({reportsList.filter(r => r.status === "approved").length})
                          </button>
                          <button
                            onClick={() => setReportFilter("rejected")}
                            style={reportFilter === "rejected" ? activeFilterButtonStyleRejected : filterButtonStyle}
                          >
                            Rejected ({reportsList.filter(r => r.status === "rejected").length})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* LIST CARDS LAPORAN */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => {
                        const sc = statusColors[report.status] || { bg: "#f1f5f9", text: "#64748b", border: "#cbd5e1" };
                        const sev = severityColors[report.severity?.toLowerCase()] || { bg: "#f1f5f9", text: "#64748b" };
                        const hasCoordinates = report.latitude !== null && report.longitude !== null;
                        
                        return (
                          <div key={report.id} style={reportRowCardStyle}>
                            <div style={reportMainLayout}>
                              
                              {/* Left Info Panel */}
                              <div style={reportLeftPanel}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                                  {/* Status badge */}
                                  <span style={{
                                    fontSize: "0.65rem",
                                    fontWeight: 900,
                                    padding: "0.2rem 0.5rem",
                                    borderRadius: 6,
                                    textTransform: "uppercase",
                                    background: sc.bg,
                                    color: sc.text,
                                    border: `1px solid ${sc.border}`
                                  }}>
                                    {report.status}
                                  </span>

                                  {/* Category */}
                                  <span style={{
                                    fontSize: "0.65rem",
                                    fontWeight: 800,
                                    padding: "0.2rem 0.5rem",
                                    borderRadius: 6,
                                    background: "#eff6ff",
                                    color: "#3b82f6",
                                  }}>
                                    {report.category?.name || "Umum"}
                                  </span>

                                  {/* Severity */}
                                  <span style={{
                                    fontSize: "0.65rem",
                                    fontWeight: 800,
                                    padding: "0.2rem 0.5rem",
                                    borderRadius: 6,
                                    background: sev.bg,
                                    color: sev.text,
                                    textTransform: "uppercase"
                                  }}>
                                    Tingkat: {report.severity}
                                  </span>
                                </div>

                                <h3 style={reportCardTitleStyle}>{report.title}</h3>
                                <p style={reportCardDescStyle}>{report.description}</p>

                                <div style={reportMetadataContainer}>
                                  <div style={metaItemStyle}>
                                    <User size={14} color="#94a3b8" />
                                    <span>Pelapor: <strong>{report.user?.name || "Anonim"}</strong> ({report.user?.email || "-"})</span>
                                  </div>
                                  <div style={metaItemStyle}>
                                    <Calendar size={14} color="#94a3b8" />
                                    <span>Dikirim: {new Date(report.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} WIB</span>
                                  </div>
                                  
                                  {hasCoordinates && (
                                    <div style={metaItemStyle}>
                                      <MapPin size={14} color="#f43f5e" />
                                      <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${report.latitude},${report.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={locationLinkStyle}
                                      >
                                        <span>Koordinat: {report.latitude?.toFixed(5)}, {report.longitude?.toFixed(5)}</span>
                                        <ExternalLink size={12} />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right Image Attachment */}
                              {report.image && (
                                <div style={reportRightPanel}>
                                  <div 
                                    className="report-image-wrapper"
                                    style={reportImageWrapper}
                                    onClick={() => setSelectedImage(getReportImageUrl(report.image))}
                                    title="Klik untuk memperbesar gambar"
                                  >
                                    <img
                                      src={getReportImageUrl(report.image) || ""}
                                      alt={report.title}
                                      style={reportImageStyle}
                                    />
                                    <div className="image-hover-overlay" style={imageHoverOverlayStyle}>
                                      <ImageIcon size={18} color="#fff" />
                                      <span style={{ fontSize: "0.75rem", color: "#fff", fontWeight: 700 }}>Perbesar</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Action Bottom Bar */}
                            <div style={reportActionBarStyle}>
                              <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                                ID Laporan: <strong style={{ color: "#1e293b" }}>#{report.id}</strong>
                              </div>

                              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                {report.status === "pending" ? (
                                  <>
                                    <button
                                      disabled={actionLoading !== null}
                                      onClick={() => handleReject(report.id)}
                                      style={actionRejectButtonStyle}
                                    >
                                      {actionLoading === report.id ? "Menolak..." : "Tolak"}
                                    </button>
                                    <button
                                      disabled={actionLoading !== null}
                                      onClick={() => handleApprove(report.id)}
                                      style={actionApproveButtonStyle}
                                    >
                                      {actionLoading === report.id ? "Menyetujui..." : "Setujui"}
                                    </button>
                                  </>
                                ) : (
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: sc.text, fontSize: "0.8rem", fontWeight: 700, marginRight: "0.5rem" }}>
                                    <Check size={16} />
                                    <span>{report.status === "approved" ? "Disetujui" : "Ditolak"}</span>
                                  </div>
                                )}

                                {/* Admin can delete any report */}
                                <button
                                  disabled={actionLoading !== null}
                                  onClick={() => handleDeleteReport(report.id)}
                                  style={actionDeleteButtonStyle}
                                >
                                  {actionLoading === report.id ? "Menghapus..." : "Hapus"}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ textAlign: "center", padding: "5rem 2rem", background: "#fff", borderRadius: 20, border: "1px dashed #e2e8f0" }}>
                        <Clock size={40} color="#cbd5e1" style={{ marginBottom: "1rem" }} />
                        <h4 style={{ fontWeight: 700, color: "#475569" }}>Tidak ada laporan ditemukan</h4>
                        <p style={{ color: "#94a3b8", fontSize: "0.85rem", maxWidth: 300, margin: "0.25rem auto 0" }}>
                          Laporan dengan filter atau kata kunci ini tidak tersedia saat ini.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* POPUP LIGHTBOX FOR ATTACHMENT IMAGE */}
      {selectedImage && (
        <div style={lightboxOverlayStyle} onClick={() => setSelectedImage(null)}>
          <button style={lightboxCloseButtonStyle} onClick={() => setSelectedImage(null)}>
            <X size={24} />
          </button>
          <img
            src={selectedImage}
            alt="Perbesaran lampiran"
            style={lightboxImageStyle}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* CSS Injected Styles for Hover & Media queries */}
      <style>{`
        /* Sidebar active & standard styling transitions */
        .admin-sidebar {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Hover states for interactive elements */
        button {
          transition: all 0.2s ease;
        }
        button:hover {
          filter: brightness(0.95);
        }
        button:active {
          transform: scale(0.98);
        }

        /* image zoom-in hover zoom indicator */
        .report-image-wrapper:hover .image-hover-overlay {
          opacity: 1 !important;
        }

        /* custom table scrollbar styling */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @media (max-width: 1024px) {
          .admin-sidebar {
            width: 250px !important;
            transform: translateX(-100%);
          }
          .admin-main {
            margin-left: 0 !important;
          }
          .sidebar-toggle-btn {
            display: flex !important;
          }
        }

        @media (max-width: 768px) {
          .header-right {
            display: none !important;
          }
          .admin-sidebar {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

// Styles variables
const sidebarWidth = 270;

const sidebarStyle: React.CSSProperties = {
  width: sidebarWidth,
  background: "#fff",
  borderRight: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  zIndex: 100,
  boxShadow: "4px 0 20px rgba(15, 23, 42, 0.02)",
};

const sidebarOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(15, 23, 42, 0.3)",
  backdropFilter: "blur(4px)",
  zIndex: 99,
};

const brandContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "1.75rem 1.5rem",
  borderBottom: "1px solid #f1f5f9",
};

const sidebarItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0.75rem 1rem",
  borderRadius: 12,
  border: "none",
  background: "transparent",
  color: "#64748b",
  fontSize: "0.85rem",
  fontWeight: 600,
  cursor: "pointer",
  textAlign: "left",
  width: "100%",
};

const activeSidebarItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0.75rem 1rem",
  borderRadius: 12,
  border: "none",
  background: "#eff6ff",
  color: "#3b82f6",
  fontSize: "0.85rem",
  fontWeight: 700,
  cursor: "pointer",
  textAlign: "left",
  width: "100%",
};

const sidebarBadgeStyle: React.CSSProperties = {
  fontSize: "0.7rem",
  fontWeight: 700,
  background: "#f1f5f9",
  color: "#475569",
  padding: "0.1rem 0.4rem",
  borderRadius: 8,
};

const sidebarBadgePendingStyle: React.CSSProperties = {
  fontSize: "0.7rem",
  fontWeight: 800,
  background: "#fffbeb",
  color: "#d97706",
  padding: "0.1rem 0.4rem",
  borderRadius: 8,
};

const sidebarFooterStyle: React.CSSProperties = {
  padding: "1.25rem 1rem",
  borderTop: "1px solid #f1f5f9",
};

const adminAvatarStyle: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: "1rem",
  boxShadow: "0 2px 6px rgba(59,130,246,0.2)",
};

const logoutButtonStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  padding: "0.65rem",
  borderRadius: 10,
  border: "1px solid #fee2e2",
  background: "#fff5f5",
  color: "#ef4444",
  fontSize: "0.8rem",
  fontWeight: 700,
  cursor: "pointer",
};

const headerStyle: React.CSSProperties = {
  height: 72,
  background: "#fff",
  borderBottom: "1px solid #e2e8f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 1.5rem",
};

const sidebarToggleStyle: React.CSSProperties = {
  display: "none",
  background: "transparent",
  border: "none",
  color: "#475569",
  cursor: "pointer",
  padding: 0,
};

const dateWidgetStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0.4rem 0.8rem",
  borderRadius: 10,
  background: "#eff6ff",
  color: "#1e3a8a",
  fontSize: "0.78rem",
  fontWeight: 700,
  border: "1px solid #dbeafe",
};

const loaderContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "8rem 2rem",
};

const spinnerStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  border: "4px solid #cbd5e1",
  borderTop: "4px solid #3b82f6",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const metricsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1rem",
};

const metricCardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: "1.25rem",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01), 0 2px 4px -1px rgba(0,0,0,0.005)",
  border: "1px solid #e2e8f0",
};

const metricContentStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const metricLabelStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.75rem",
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.02em",
};

const metricValueStyle: React.CSSProperties = {
  margin: "0.25rem 0 0",
  fontSize: "1.75rem",
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1.1,
};

const metricIconBgStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const overviewRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1.5rem",
};

const whiteCardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 20,
  border: "1px solid #e2e8f0",
  padding: "1.5rem",
  boxShadow: "0 4px 20px rgba(15, 23, 42, 0.01)",
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #f1f5f9",
  paddingBottom: "0.75rem",
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.95rem",
  fontWeight: 800,
  color: "#0f172a",
};

const cardActionLinkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
  border: "none",
  background: "transparent",
  color: "#3b82f6",
  fontSize: "0.8rem",
  fontWeight: 700,
  cursor: "pointer",
  padding: 0,
};

const recentReportItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.75rem",
  borderRadius: 12,
  background: "#f8fafc",
  border: "1px solid #f1f5f9",
  cursor: "pointer",
  transition: "all 0.15s",
};

const smallAvatarStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: "#eff6ff",
  color: "#3b82f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: "0.8rem",
};

const barControlStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "1rem",
  marginBottom: "1rem",
};

const searchContainerStyle: React.CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: "0.5rem 0.75rem",
  gap: "0.5rem",
};

const searchInputStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  fontSize: "0.85rem",
  color: "#1e293b",
  outline: "none",
  width: "100%",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
};

const tableRowHeaderStyle: React.CSSProperties = {
  borderBottom: "2px solid #f1f5f9",
};

const tableHeaderCellStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  fontSize: "0.72rem",
  fontWeight: 800,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tableRowStyle: React.CSSProperties = {
  borderBottom: "1px solid #f1f5f9",
  transition: "background 0.15s",
};

const tableBodyCellStyle: React.CSSProperties = {
  padding: "1rem",
  verticalAlign: "middle",
};

const tableAvatarStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "#eff6ff",
  color: "#3b82f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: "0.9rem",
  boxShadow: "0 2px 4px rgba(59,130,246,0.05)",
};

const reportsBarControlStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "1rem",
};

const filtersGroupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  flexWrap: "wrap",
};

const filterButtonStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  background: "#fff",
  color: "#64748b",
  padding: "0.4rem 0.75rem",
  borderRadius: 8,
  fontSize: "0.78rem",
  fontWeight: 600,
  cursor: "pointer",
};

const activeFilterButtonStyle: React.CSSProperties = {
  border: "1px solid #3b82f6",
  background: "#eff6ff",
  color: "#3b82f6",
  padding: "0.4rem 0.75rem",
  borderRadius: 8,
  fontSize: "0.78rem",
  fontWeight: 700,
  cursor: "pointer",
};

const activeFilterButtonStylePending: React.CSSProperties = {
  border: "1px solid #f59e0b",
  background: "#fffbeb",
  color: "#d97706",
  padding: "0.4rem 0.75rem",
  borderRadius: 8,
  fontSize: "0.78rem",
  fontWeight: 700,
  cursor: "pointer",
};

const activeFilterButtonStyleApproved: React.CSSProperties = {
  border: "1px solid #10b981",
  background: "#ecfdf5",
  color: "#10b981",
  padding: "0.4rem 0.75rem",
  borderRadius: 8,
  fontSize: "0.78rem",
  fontWeight: 700,
  cursor: "pointer",
};

const activeFilterButtonStyleRejected: React.CSSProperties = {
  border: "1px solid #ef4444",
  background: "#fef2f2",
  color: "#ef4444",
  padding: "0.4rem 0.75rem",
  borderRadius: 8,
  fontSize: "0.78rem",
  fontWeight: 700,
  cursor: "pointer",
};

const reportRowCardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 20,
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 15px rgba(15, 23, 42, 0.01)",
  overflow: "hidden",
};

const reportMainLayout: React.CSSProperties = {
  display: "flex",
  gap: "1.5rem",
  padding: "1.5rem",
  flexWrap: "wrap",
};

const reportLeftPanel: React.CSSProperties = {
  flex: 2,
  minWidth: 290,
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const reportRightPanel: React.CSSProperties = {
  flex: 1,
  minWidth: 220,
  maxWidth: 320,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const reportCardTitleStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  fontWeight: 800,
  color: "#0f172a",
  margin: "0.25rem 0",
};

const reportCardDescStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  color: "#475569",
  lineHeight: 1.6,
  margin: 0,
};

const reportMetadataContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
  marginTop: "0.5rem",
  paddingTop: "0.75rem",
  borderTop: "1px dashed #f1f5f9",
};

const metaItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "0.78rem",
  color: "#64748b",
};

const locationLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.25rem",
  color: "#f43f5e",
  textDecoration: "none",
  fontWeight: 700,
};

const reportImageWrapper: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: 180,
  borderRadius: 16,
  overflow: "hidden",
  border: "1px solid #f1f5f9",
  cursor: "zoom-in",
};

const reportImageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const imageHoverOverlayStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(15,23,42,0.4)",
  opacity: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.25rem",
  transition: "opacity 0.2s",
};

// Injected styles handle hover opacity on .report-image-wrapper:hover
const reportActionBarStyle: React.CSSProperties = {
  background: "#f8fafc",
  borderTop: "1px solid #f1f5f9",
  padding: "1rem 1.5rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "0.75rem",
};

const actionApproveButtonStyle: React.CSSProperties = {
  border: "none",
  background: "#10b981",
  color: "#fff",
  padding: "0.5rem 1rem",
  borderRadius: 10,
  fontSize: "0.8rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(16,185,129,0.25)",
};

const actionRejectButtonStyle: React.CSSProperties = {
  border: "1px solid #fecaca",
  background: "#fef2f2",
  color: "#ef4444",
  padding: "0.5rem 1rem",
  borderRadius: 10,
  fontSize: "0.8rem",
  fontWeight: 700,
  cursor: "pointer",
};

const actionDeleteButtonStyle: React.CSSProperties = {
  border: "none",
  background: "#ef4444",
  color: "#fff",
  padding: "0.5rem 1rem",
  borderRadius: 10,
  fontSize: "0.8rem",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(239, 68, 68, 0.25)",
};

const lightboxOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const lightboxImageStyle: React.CSSProperties = {
  maxWidth: "90%",
  maxHeight: "85%",
  borderRadius: 16,
  boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
  border: "2px solid rgba(255,255,255,0.1)",
};

const lightboxCloseButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: 20,
  right: 20,
  background: "rgba(255,255,255,0.1)",
  border: "none",
  color: "#fff",
  width: 44,
  height: 44,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

export default AdminDashboard;
