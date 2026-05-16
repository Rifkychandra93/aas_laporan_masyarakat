import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import DashboardNavbar from "../../components/ui/DashboardNavbar";
import { createLaporan } from "../../services/laporanService";

const SEVERITY_OPTIONS = [
  { value: "low",    label: "Rendah",   color: "#22c55e", bg: "#f0fdf4" },
  { value: "medium", label: "Sedang",   color: "#f59e0b", bg: "#fffbeb" },
  { value: "high",   label: "Tinggi",   color: "#ef4444", bg: "#fff1f2" },
];

const CATEGORY_OPTIONS = [
  { id: 1, name: "Infrastruktur" },
  { id: 2, name: "Lingkungan" },
  { id: 3, name: "Keamanan" },
  { id: 4, name: "Sosial" },
  { id: 5, name: "Lainnya" },
];

const CreateLaporanPage = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    latitude: "",
    longitude: "",
    severity: "low",
    categoryId: "1",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const getLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((prev) => ({
        ...prev,
        latitude: pos.coords.latitude.toFixed(6),
        longitude: pos.coords.longitude.toFixed(6),
      }));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Judul dan deskripsi wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("latitude", form.latitude || "0");
      fd.append("longitude", form.longitude || "0");
      fd.append("severity", form.severity);
      fd.append("categoryId", form.categoryId);
      if (imageFile) fd.append("image", imageFile);

      await createLaporan(fd);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Gagal membuat laporan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <DashboardNavbar />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* BACK + TITLE */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 36, height: 36, borderRadius: 10, border: "1px solid #e2e8f0",
              background: "#fff", cursor: "pointer", color: "#475569",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#fff";
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Buat Laporan
            </h1>
            <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: 0, marginTop: "0.15rem" }}>
              Laporkan masalah di sekitar kamu
            </p>
          </div>
        </div>

        {/* SUCCESS STATE */}
        {success && (
          <div style={{
            background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14,
            padding: "1.25rem 1.5rem", marginBottom: "1.5rem",
            display: "flex", alignItems: "center", gap: "0.75rem",
          }}>
            <CheckCircle2 size={20} color="#16a34a" />
            <div>
              <p style={{ fontWeight: 700, color: "#15803d", margin: 0, fontSize: "0.9rem" }}>
                Laporan berhasil dibuat!
              </p>
              <p style={{ color: "#4ade80", margin: 0, fontSize: "0.78rem" }}>
                Mengalihkan ke dashboard…
              </p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div style={{
            background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 14,
            padding: "1rem 1.25rem", marginBottom: "1.25rem",
            display: "flex", alignItems: "center", gap: "0.7rem",
          }}>
            <AlertTriangle size={18} color="#f43f5e" />
            <p style={{ color: "#be123c", margin: 0, fontSize: "0.85rem", fontWeight: 600 }}>
              {error}
            </p>
          </div>
        )}

        {/* FORM CARD */}
        <form onSubmit={handleSubmit}>
          <div style={{
            background: "#fff", borderRadius: 18, border: "1px solid #e2e8f0",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden",
          }}>

            {/* ── SECTION: INFO DASAR ── */}
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #f1f5f9" }}>
              <SectionLabel icon={<FileText size={15} />} title="Informasi Laporan" />

              <Field label="Judul Laporan">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Contoh: Jalan rusak di RT 05"
                  style={inputStyle}
                  required
                />
              </Field>

              <Field label="Deskripsi">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Jelaskan masalah secara singkat dan jelas…"
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
                  required
                />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                <Field label="Kategori">
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Tingkat Urgensi">
                  <select
                    name="severity"
                    value={form.severity}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    {SEVERITY_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            {/* ── SECTION: LOKASI ── */}
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #f1f5f9" }}>
              <SectionLabel icon={<MapPin size={15} />} title="Lokasi Kejadian" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", marginBottom: "0.75rem" }}>
                <Field label="Latitude">
                  <input
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    placeholder="-6.200000"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Longitude">
                  <input
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    placeholder="106.816666"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <button
                type="button"
                onClick={getLocation}
                style={{
                  display: "flex", alignItems: "center", gap: "0.45rem",
                  fontSize: "0.8rem", fontWeight: 600, color: "#3b82f6",
                  background: "#eff6ff", border: "1px solid #bfdbfe",
                  borderRadius: 8, padding: "0.45rem 0.9rem",
                  cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#dbeafe"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#eff6ff"; }}
              >
                <MapPin size={13} /> Gunakan lokasi saat ini
              </button>
            </div>

            {/* ── SECTION: FOTO ── */}
            <div style={{ padding: "1.5rem" }}>
              <SectionLabel icon={<Upload size={15} />} title="Foto Pendukung" />

              {imagePreview ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={imagePreview}
                    alt="preview"
                    style={{
                      width: "100%", maxHeight: 220, objectFit: "cover",
                      borderRadius: 12, border: "1px solid #e2e8f0",
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      position: "absolute", top: 8, right: 8,
                      width: 28, height: 28, borderRadius: "50%",
                      background: "rgba(0,0,0,0.55)", border: "none",
                      color: "#fff", cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: "2px dashed #cbd5e1", borderRadius: 12, padding: "2rem",
                    textAlign: "center", cursor: "pointer", background: "#f8fafc",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#93c5fd";
                    (e.currentTarget as HTMLDivElement).style.background = "#eff6ff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#cbd5e1";
                    (e.currentTarget as HTMLDivElement).style.background = "#f8fafc";
                  }}
                >
                  <Upload size={22} color="#94a3b8" style={{ margin: "0 auto 0.5rem" }} />
                  <p style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600, margin: 0 }}>
                    Klik untuk upload foto
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: "0.25rem 0 0" }}>
                    JPG, PNG, WEBP — maks. 5 MB
                  </p>
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImage}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* SUBMIT */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "0.7rem 1.4rem", borderRadius: 10, fontSize: "0.875rem",
                fontWeight: 600, border: "1px solid #e2e8f0", background: "#fff",
                color: "#475569", cursor: "pointer", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading || success}
              style={{
                padding: "0.7rem 1.75rem", borderRadius: 10, fontSize: "0.875rem",
                fontWeight: 700, border: "none",
                background: loading || success ? "#93c5fd" : "linear-gradient(135deg,#3b82f6,#2563eb)",
                color: "#fff", cursor: loading || success ? "default" : "pointer",
                display: "flex", alignItems: "center", gap: "0.5rem",
                boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
                transition: "opacity 0.15s",
              }}
            >
              {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
              {loading ? "Mengirim…" : success ? "Berhasil!" : "Kirim Laporan"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #93c5fd !important;
          box-shadow: 0 0 0 3px rgba(147,197,253,0.25);
        }
      `}</style>
    </div>
  );
};

/* ── Helper components ── */
const SectionLabel = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem" }}>
    <span style={{ color: "#3b82f6" }}>{icon}</span>
    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {title}
    </span>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: "0.875rem" }}>
    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#475569", marginBottom: "0.35rem" }}>
      {label}
    </label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.85rem",
  borderRadius: 9,
  border: "1px solid #e2e8f0",
  fontSize: "0.875rem",
  color: "#0f172a",
  background: "#fff",
  boxSizing: "border-box",
  transition: "border-color 0.15s, box-shadow 0.15s",
  fontFamily: "inherit",
};

export default CreateLaporanPage;
