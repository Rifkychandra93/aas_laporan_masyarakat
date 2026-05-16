import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ImageOff,
  Calendar,
  Layers,
  ExternalLink,
  MessageSquare,
  Send,
  Trash2,
  Edit3,
} from "lucide-react";
import DashboardNavbar from "../../components/ui/DashboardNavbar";
import { getLaporanById, addComment, deleteLaporan, deleteComment } from "../../services/laporanService";
import type { Laporan } from "../../types/laporan.types";
import { useAuth } from "../../context/AuthContext";

const statusConfig: Record<
  string,
  { bg: string; border: string; color: string; label: string; Icon: any }
> = {
  pending: {
    bg: "#fffbeb",
    border: "#fde68a",
    color: "#d97706",
    label: "Menunggu Konfirmasi",
    Icon: Clock,
  },
  approved: {
    bg: "#f0fdf4",
    border: "#bbf7d0",
    color: "#16a34a",
    label: "Laporan Disetujui",
    Icon: CheckCircle2,
  },
  rejected: {
    bg: "#fff1f2",
    border: "#fecdd3",
    color: "#dc2626",
    label: "Laporan Ditolak",
    Icon: XCircle,
  },
};

const severityLabel: Record<string, { label: string; color: string; bg: string }> = {
  low:    { label: "Rendah",  color: "#16a34a", bg: "#f0fdf4" },
  medium: { label: "Sedang",  color: "#d97706", bg: "#fffbeb" },
  high:   { label: "Tinggi",  color: "#dc2626", bg: "#fff1f2" },
};

const DetailLaporanPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [laporan, setLaporan] = useState<Laporan | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgErr, setImgErr] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const data = await getLaporanById(id!);
      setLaporan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMaps = () => {
    if (laporan?.latitude && laporan?.longitude) {
      const url = `https://www.google.com/maps?q=${laporan.latitude},${laporan.longitude}`;
      window.open(url, "_blank");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;

    setSubmitting(true);
    try {
      await addComment(Number(id), newComment);
      setNewComment("");
      fetchDetail();
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan komentar");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("Hapus komentar ini?")) return;
    try {
      await deleteComment(commentId);
      fetchDetail();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus komentar");
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm("Apakah Anda yakin ingin menghapus laporan ini?")) return;

    setDeleting(true);
    try {
      await deleteLaporan(Number(id));
      alert("Laporan berhasil dihapus");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus laporan");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardNavbar />
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ height: 20, width: 160, background: "#e2e8f0", borderRadius: 8, marginBottom: "2rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem" }} className="skeleton-grid">
          <div style={{ height: 400, background: "#e2e8f0", borderRadius: 20 }} />
          <div style={{ height: 400, background: "#e2e8f0", borderRadius: 20 }} />
        </div>
      </div>
    </div>
  );

  if (!laporan) return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <DashboardNavbar />
      <div style={{ textAlign: "center", padding: "6rem 2rem", color: "#94a3b8" }}>
        <AlertTriangle size={36} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
        <h2 style={{ fontWeight: 700, color: "#334155" }}>Laporan tidak ditemukan</h2>
        <button onClick={() => navigate("/dashboard")} style={errorButtonStyle}>Kembali</button>
      </div>
    </div>
  );

  const status = statusConfig[laporan.status] ?? statusConfig.pending;
  const StatusIcon = status.Icon;
  const sev = severityLabel[laporan.severity] ?? { label: laporan.severity, color: "#64748b", bg: "#f1f5f9" };
  const isOwner = currentUser?.id === laporan.user?.id;

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <DashboardNavbar />

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "2rem 1.5rem 4rem" }} className="detail-container">

        <div style={{ marginBottom: "1.5rem" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={backButtonStyle}
          >
            <ArrowLeft size={15} /> Kembali ke Dashboard
          </button>
        </div>

        <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.25rem", alignItems: "start" }}>

          {/* ════════ LEFT ════════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={cardWrapperStyle}>
              {laporan.image && !imgErr ? (
                <img
                  src={`http://localhost:3000/uploads/${laporan.image}`}
                  alt={laporan.title}
                  onError={() => setImgErr(true)}
                  style={{ width: "100%", maxHeight: 380, objectFit: "cover", display: "block" }}
                />
              ) : (
                <div style={noImageStyle}>
                  <ImageOff size={32} />
                  <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Tidak ada gambar</span>
                </div>
              )}
            </div>

            <div style={contentCardStyle}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                {laporan.category && (
                  <Chip icon={<Layers size={12} />} label={laporan.category.name} color="#3b82f6" bg="#eff6ff" />
                )}
                <Chip icon={<AlertTriangle size={12} />} label={`Urgensi: ${sev.label}`} color={sev.color} bg={sev.bg} />
              </div>

              <h1 style={titleStyle}>{laporan.title}</h1>
              <div style={dividerStyle} />
              <p style={descStyle}>{laporan.description}</p>
            </div>

            {/* DISCUSSION */}
            <div style={contentCardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
                <MessageSquare size={20} color="#3b82f6" />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Diskusi Laporan</h3>
                <span style={commentCountStyle}>{laporan.comments?.length || 0}</span>
              </div>

              <form onSubmit={handleComment} style={{ position: "relative", marginBottom: "2rem" }}>
                <textarea
                  placeholder="Berikan tanggapan..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={textareaStyle}
                />
                <button type="submit" disabled={submitting || !newComment.trim()} style={sendButtonStyle}>
                  <Send size={14} /> {submitting ? "..." : "Kirim"}
                </button>
              </form>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {laporan.comments?.map((c) => (
                  <div key={c.id} style={commentItemStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                      <div style={avatarStyle}>{c.user.name.charAt(0).toUpperCase()}</div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155" }}>{c.user.name}</span>
                      <span style={{ fontSize: "0.7rem", color: "#94a3b8", marginLeft: "auto" }}>
                        {new Date(c.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                      </span>
                      {currentUser?.id === c.user.id && (
                        <button 
                          onClick={() => handleDeleteComment(c.id)}
                          style={{ background: "none", border: "none", padding: 0, color: "#94a3b8", cursor: "pointer", marginLeft: "0.5rem" }}
                          onMouseEnter={(e) => e.currentTarget.style.color = "#dc2626"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: "0.88rem", color: "#475569", margin: 0, lineHeight: 1.5 }}>{c.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} className="sidebar">
            
            <div style={sidebarCardStyle}>
              <p style={sidebarLabelStyle}>Status Laporan</p>
              <div style={{ ...statusBadgeStyle, background: status.bg, border: `1px solid ${status.border}` }}>
                <div style={statusIconWrapperStyle}><StatusIcon size={19} color={status.color} /></div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.9rem", color: status.color }}>{status.label}</div>
                  <div style={{ fontSize: "0.72rem", color: status.color, opacity: 0.7 }}>Diproses tim terkait</div>
                </div>
              </div>
            </div>

            <div style={sidebarCardStyle}>
              <p style={sidebarLabelStyle}>Lokasi Kejadian</p>
              <div style={coordinateBoxStyle}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#334155" }}>{laporan.latitude}, {laporan.longitude}</div>
              </div>
              <button onClick={handleOpenMaps} style={mapsButtonStyle}>
                <ExternalLink size={16} /> Lihat di Google Maps
              </button>
            </div>

            <div style={sidebarCardStyle}>
              <p style={sidebarLabelStyle}>Detail Laporan</p>
              <MetaRow icon={<User size={16} />} label="Pelapor" value={laporan.user?.name || "Anonim"} color="#3b82f6" colorBg="#eff6ff" />
              <div style={{ height: "0.75rem" }} />
              <MetaRow icon={<Calendar size={16} />} label="Tanggal" value={new Date(laporan.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} color="#f59e0b" colorBg="#fffbeb" />
            </div>

            {isOwner && (
              <div style={{ ...sidebarCardStyle, background: "#fff", border: "1px solid #e2e8f0" }}>
                <p style={sidebarLabelStyle}>Tindakan Saya</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <button
                    onClick={() => navigate(`/dashboard/laporan/edit/${laporan.id}`)}
                    style={editButtonStyle}
                  >
                    <Edit3 size={16} /> Edit Laporan
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    style={deleteButtonStyle}
                  >
                    <Trash2 size={16} /> {deleting ? "Menghapus..." : "Hapus Laporan"}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .main-grid, .skeleton-grid {
            grid-template-columns: 1fr !important;
          }
          .detail-container {
            padding: 1.5rem 1rem 3rem !important;
          }
          .sidebar {
            order: -1; /* Move status and actions to top on mobile */
          }
        }
      `}</style>
    </div>
  );
};

/* ── Styles ── */
const backButtonStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 1rem 0.45rem 0.75rem",
  borderRadius: 999, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: "0.82rem",
  fontWeight: 700, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};

const cardWrapperStyle: React.CSSProperties = { borderRadius: 20, overflow: "hidden", background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" };
const noImageStyle: React.CSSProperties = { height: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem", background: "linear-gradient(135deg,#eff6ff,#dbeafe)", color: "#93c5fd" };
const contentCardStyle: React.CSSProperties = { background: "#fff", borderRadius: 20, padding: "1.75rem", border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" };
const titleStyle: React.CSSProperties = { fontSize: "1.45rem", fontWeight: 800, color: "#0f172a", margin: "0 0 1rem", lineHeight: 1.3 };
const dividerStyle: React.CSSProperties = { height: 1, background: "#f1f5f9", marginBottom: "1.1rem" };
const descStyle: React.CSSProperties = { color: "#475569", fontSize: "0.95rem", lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" };
const commentCountStyle: React.CSSProperties = { fontSize: "0.75rem", color: "#94a3b8", background: "#f1f5f9", padding: "0.2rem 0.6rem", borderRadius: 999, fontWeight: 700 };
const textareaStyle: React.CSSProperties = { width: "100%", minHeight: 100, padding: "1rem 1rem 3rem", borderRadius: 14, border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "0.9rem", color: "#0f172a", fontFamily: "inherit", resize: "none", boxSizing: "border-box" };
const sendButtonStyle: React.CSSProperties = { position: "absolute", bottom: 10, right: 10, display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "#fff", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" };
const commentItemStyle: React.CSSProperties = { padding: "1rem", borderRadius: 14, background: "#f8fafc", border: "1px solid #f1f5f9" };
const avatarStyle: React.CSSProperties = { width: 24, height: 24, borderRadius: 6, background: "#dbeafe", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800 };
const sidebarCardStyle: React.CSSProperties = { background: "#fff", borderRadius: 20, padding: "1.5rem", border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" };
const sidebarLabelStyle: React.CSSProperties = { fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 0.85rem" };
const statusBadgeStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", borderRadius: 14 };
const statusIconWrapperStyle: React.CSSProperties = { width: 38, height: 38, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", flexShrink: 0 };
const coordinateBoxStyle: React.CSSProperties = { background: "#f8fafc", padding: "1rem", borderRadius: 14, border: "1px solid #f1f5f9", marginBottom: "1rem" };
const mapsButtonStyle: React.CSSProperties = { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: 12, border: "none", background: "#3b82f6", color: "#fff", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(59,130,246,0.25)" };
const editButtonStyle: React.CSSProperties = { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s" };
const deleteButtonStyle: React.CSSProperties = { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: 12, border: "none", background: "#fee2e2", color: "#dc2626", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s" };
const errorButtonStyle: React.CSSProperties = { marginTop: "1rem", padding: "0.6rem 1.4rem", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" };

const Chip = ({ icon, label, color, bg }: { icon: React.ReactNode; label: string; color: string; bg: string }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.3rem 0.75rem", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700, color, background: bg }}>{icon} {label}</div>
);

const MetaRow = ({ icon, label, value, color, colorBg }: { icon: React.ReactNode; label: string; value: string; color: string; colorBg: string; }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
    <div style={{ width: 34, height: 34, borderRadius: 9, background: colorBg, color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
      <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#334155", marginTop: "0.1rem", wordBreak: "break-all" }}>{value}</div>
    </div>
  </div>
);

export default DetailLaporanPage;
