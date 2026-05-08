import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, FileText } from "lucide-react";
import { registerUser } from "../../services/authService";

const Spinner = ({ text = "Memproses..." }) => (
  <span className="spinner-wrap">
    <span className="spinner spinner-sm" />
    <span className="spinner-txt">{text}</span>
  </span>
);

const Alert = ({ type, message, onClose }: { type: "success"|"error"; message: string; onClose: () => void }) => (
  <div className={`alert alert-${type}`} role="alert">
    <span className="alert-icon">{type === "success" ? "✓" : "✕"}</span>
    <p className="alert-message">{message}</p>
    <button className="alert-close" onClick={onClose} aria-label="Tutup">✕</button>
  </div>
);

const Field = ({
  id, label, type = "text", icon: Icon, placeholder, value, onChange, error, disabled, autoComplete,
}: {
  id: string; label: string; type?: string; icon: typeof Mail;
  placeholder?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; disabled?: boolean; autoComplete?: string;
}) => {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className={`field-input${error ? " field-err" : ""}`}>
        <span className="field-icon"><Icon size={16} /></span>
        <input
          id={id}
          type={isPass ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
        />
        {isPass && (
          <button type="button" className="field-toggle" onClick={() => setShow(p => !p)} aria-label="Toggle password">
            {show ? "🔓" : "🔒"}
          </button>
        )}
      </div>
      {error && <span className="field-err-msg">{error}</span>}
    </div>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [alert, setAlert]       = useState<{ type: "success"|"error"; message: string } | null>(null);
  const [errors, setErrors]     = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});

  const getStrength = (pw: string) => {
    if (!pw) return { level: 0, label: "", color: "" };
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    const map = [
      { level: 1, label: "Lemah",  color: "#ef4444" },
      { level: 2, label: "Cukup",  color: "#f97316" },
      { level: 3, label: "Baik",   color: "#5b9cf6" },
      { level: 4, label: "Kuat",   color: "#10b981" },
    ];
    return map[s - 1] ?? { level: 0, label: "", color: "" };
  };
  const str = getStrength(password);

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim())              e.name = "Nama wajib diisi";
    else if (name.trim().length < 3) e.name = "Minimal 3 karakter";
    if (!email.trim())             e.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Format email tidak valid";
    if (!password)                 e.password = "Password wajib diisi";
    else if (password.length < 6)  e.password = "Minimal 6 karakter";
    if (!confirm)                  e.confirm = "Konfirmasi password wajib diisi";
    else if (password !== confirm) e.confirm = "Password tidak cocok";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAlert(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await registerUser({ name: name.trim(), email, password });
      setAlert({ type: "success", message: "Akun berhasil dibuat! Silakan login." });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Registrasi gagal. Silakan coba lagi.";
      setAlert({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-topbar">
        <div className="auth-topbar-icon"><FileText size={18} /></div>
        <span className="auth-topbar-name">
          Report<span>.in</span>
        </span>
      </div>

      <div className="auth-card auth-card-wide">
        <div className="auth-head">
          <span className="auth-head-badge">
            <FileText size={11} /> Daftar Akun
          </span>
          <h1>Buat Akun Baru</h1>
          <p>Isi data di bawah untuk mendaftar</p>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <form id="register-form" onSubmit={handleSubmit} className="auth-form" noValidate>
          <Field
            id="register-name" label="Nama Lengkap" icon={User}
            placeholder="Nama lengkap Anda" value={name}
            onChange={e => setName(e.target.value)} error={errors.name}
            autoComplete="name" disabled={loading}
          />
          <Field
            id="register-email" label="Email" type="email" icon={Mail}
            placeholder="contoh@email.com" value={email}
            onChange={e => setEmail(e.target.value)} error={errors.email}
            autoComplete="email" disabled={loading}
          />
          <Field
            id="register-password" label="Password" type="password" icon={Lock}
            placeholder="Minimal 6 karakter" value={password}
            onChange={e => setPassword(e.target.value)} error={errors.password}
            autoComplete="new-password" disabled={loading}
          />

          {password && (
            <div className="strength" aria-live="polite">
              <div className="strength-bars">
                {[1,2,3,4].map(l => (
                  <div key={l} className="strength-bar"
                    style={{ backgroundColor: l <= str.level ? str.color : undefined }} />
                ))}
              </div>
              <span className="strength-lbl" style={{ color: str.color }}>{str.label}</span>
            </div>
          )}

          <Field
            id="register-confirm" label="Konfirmasi Password" type="password" icon={Lock}
            placeholder="Ulangi password" value={confirm}
            onChange={e => setConfirm(e.target.value)} error={errors.confirm}
            autoComplete="new-password" disabled={loading}
          />

          <p className="auth-terms">
            Dengan mendaftar, Anda menyetujui{" "}
            <Link to="/terms">Syarat & Ketentuan</Link> dan{" "}
            <Link to="/privacy">Kebijakan Privasi</Link> kami.
          </p>

          <button id="register-submit-btn" type="submit" className="auth-btn" disabled={loading}>
            {loading ? <Spinner text="Membuat akun..." /> : "Daftar Sekarang"}
          </button>
        </form>

        <p className="auth-switch">
          Sudah punya akun?{" "}
          <Link to="/login" id="goto-login-link">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
