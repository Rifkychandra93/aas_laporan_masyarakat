import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, FileText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo1.png";

const Spinner = () => (
  <span className="spinner-wrap">
    <span className="spinner spinner-sm" />
    <span className="spinner-txt">Memproses...</span>
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

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [alert, setAlert]       = useState<{ type: "success"|"error"; message: string } | null>(null);
  const [errors, setErrors]     = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim())            e.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Format email tidak valid";
    if (!password)                e.password = "Password wajib diisi";
    else if (password.length < 6) e.password = "Password minimal 6 karakter";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAlert(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ email, password });
      setAlert({ type: "success", message: "Login berhasil! Mengalihkan..." });
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Login gagal. Periksa email dan password Anda.";
      setAlert({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-topbar">
        <img
          src={logo}
          alt="Report.in Logo"
          style={{
            width: "72px",
            height: "72px",
            objectFit: "contain",
            marginRight: "-1rem",
          }}
        />
        <a href = "/" className="auth-topbar-name">
          Report<span>.in</span>
        </a>
      </div>

      <div className="auth-card">
        <div className="auth-head">
          <span className="auth-head-badge">
            <FileText size={11} /> Platform Laporan
          </span>
          <h1>Masuk ke Akun</h1>
          <p>Silakan masukkan email dan password Anda</p>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <form id="login-form" onSubmit={handleSubmit} className="auth-form" noValidate>
          <Field
            id="login-email" label="Email" type="email" icon={Mail}
            placeholder="contoh@email.com" value={email}
            onChange={e => setEmail(e.target.value)} error={errors.email}
            autoComplete="email" disabled={loading}
          />
          <Field
            id="login-password" label="Password" type="password" icon={Lock}
            placeholder="Masukkan password" value={password}
            onChange={e => setPassword(e.target.value)} error={errors.password}
            autoComplete="current-password" disabled={loading}
          />

          <div className="auth-forgot">
            <Link to="/forgot-password">Lupa password?</Link>
          </div>

          <button id="login-submit-btn" type="submit" className="auth-btn" disabled={loading}>
            {loading ? <Spinner /> : "Masuk Sekarang"}
          </button>
        </form>

        <p className="auth-switch">
          Belum punya akun?{" "}
          <Link to="/register" id="goto-register-link">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
