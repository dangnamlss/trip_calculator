import { useState } from "react";
import {
  loginWithEmail,
  loginWithGoogle,
  loginWithFacebook,
  resetPassword,
  getFirebaseErrorMessage,
} from "../../firebase/firebaseAuth";

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
    background: "#f5f4fb",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    border: "0.5px solid #e0dff0",
    borderRadius: "20px",
    padding: "2.5rem 2rem",
    width: "100%",
    maxWidth: "420px",
    position: "relative",
    overflow: "hidden",
  },
  topBar: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: "3px",
    background: "linear-gradient(90deg, #534AB7, #1D9E75, #D4537E)",
    borderRadius: "20px 20px 0 0",
  },
  logo: {
    display: "flex", alignItems: "center", gap: "10px", marginBottom: "2rem",
  },
  logoIcon: {
    width: "36px", height: "36px", borderRadius: "10px",
    background: "#534AB7", display: "flex", alignItems: "center",
    justifyContent: "center", flexShrink: 0,
  },
  logoText: {
    fontFamily: "'Syne', sans-serif", fontSize: "18px",
    fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.5px",
  },
  heading: {
    fontSize: "24px", fontWeight: 700, color: "#1a1a2e",
    marginBottom: "0.4rem", letterSpacing: "-0.5px",
  },
  subheading: { fontSize: "14px", color: "#6b6b8a", marginBottom: "2rem" },
  field: { marginBottom: "1.25rem" },
  label: {
    display: "block", fontSize: "13px", fontWeight: 500,
    textAlign: "left",
    color: "#6b6b8a", marginBottom: "0.4rem",
  },
  inputWrapper: { position: "relative" },
  input: {
    width: "100%", padding: "10px 40px 10px 38px", fontSize: "14px",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif", borderRadius: "8px",
    border: "0.5px solid #c8c6e0", background: "#f8f7fd", color: "#1a1a2e",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputFocus: {
    borderColor: "#534AB7",
    boxShadow: "0 0 0 3px rgba(83,74,183,0.12)",
    background: "#fff",
  },
  inputError: {
    borderColor: "#e24b4a",
    boxShadow: "0 0 0 3px rgba(226,75,74,0.1)",
  },
  inputIcon: {
    position: "absolute", left: "12px", top: "50%",
    transform: "translateY(-50%)", width: "16px",
    color: "#9999bb", pointerEvents: "none",
  },
  toggleBtn: {
    position: "absolute", right: "12px", top: "50%",
    transform: "translateY(-50%)", background: "none", border: "none",
    cursor: "pointer", color: "#9999bb", display: "flex",
    alignItems: "center", padding: 0,
  },
  errorMsg: { fontSize: "12px", color: "#e24b4a", marginTop: "4px" },
  globalError: {
    background: "#fcebeb", border: "0.5px solid #e24b4a",
    borderRadius: "8px", padding: "10px 14px", fontSize: "13px",
    color: "#a32d2d", marginBottom: "1.25rem",
    display: "flex", alignItems: "center", gap: "8px",
  },
  options: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "1.5rem", fontSize: "13px",
  },
  remember: {
    display: "flex", alignItems: "center", gap: "6px",
    color: "#6b6b8a", cursor: "pointer", userSelect: "none",
  },
  forgot: {
    color: "#534AB7", textDecoration: "none", fontWeight: 500,
    cursor: "pointer", background: "none", border: "none",
    fontSize: "13px", fontFamily: "inherit",
  },
  btnLogin: {
    width: "100%", padding: "11px", background: "#534AB7", color: "#fff",
    border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 500,
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif", cursor: "pointer",
    letterSpacing: "0.02em", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "8px", transition: "background 0.18s",
  },
  btnLoginDisabled: { background: "#a09cd8", cursor: "not-allowed" },
  divider: {
    display: "flex", alignItems: "center", gap: "12px",
    margin: "1.5rem 0", fontSize: "12px", color: "#aaa",
  },
  dividerLine: { flex: 1, height: "0.5px", background: "#e0dff0" },
  socialGrid: {
    display: "grid", gridTemplateColumns: "1",
    gap: "10px", marginBottom: "1.5rem",
  },
  btnSocial: {
    padding: "9px 12px", border: "0.5px solid #c8c6e0",
    borderRadius: "8px", background: "#fff",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif", fontSize: "13px",
    color: "#1a1a2e", cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", gap: "8px",
    transition: "background 0.15s",
  },
  signupRow: { textAlign: "center", fontSize: "13px", color: "#6b6b8a" },
  signupLink: {
    color: "#534AB7", fontWeight: 500, cursor: "pointer",
    background: "none", border: "none", fontSize: "13px", fontFamily: "inherit",
  },
  successBanner: {
    background: "#eaf3de", border: "0.5px solid #639922",
    borderRadius: "8px", padding: "10px 14px", fontSize: "13px",
    color: "#3B6D11", marginBottom: "1.25rem",
    display: "flex", alignItems: "center", gap: "8px",
  },
};

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9z" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IconEye({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
function IconSpinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function LoginPage() {
  const [form, setForm] = useState({ email: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(""); // "google" | "facebook"
  const [success, setSuccess] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setGlobalError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email không hợp lệ.";
    }
    if (!form.password) newErrors.password = "Vui lòng nhập mật khẩu.";
    return newErrors;
  };

  // ---- Email/Password login via Firebase ----
  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setGlobalError("");
    try {
      await loginWithEmail(form.email, form.password, remember);
      setSuccess(true);
      // TODO: navigate("/home") hoặc gọi props.onSuccess(user)
    } catch (err) {
      setGlobalError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ---- Google login ----
  const handleGoogle = async () => {
    setSocialLoading("google");
    setGlobalError("");
    try {
      await loginWithGoogle();
      setSuccess(true);
    } catch (err) {
      setGlobalError(getFirebaseErrorMessage(err.code));
    } finally {
      setSocialLoading("");
    }
  };


  // ---- Forgot password ----
  const handleForgot = async () => {
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors((p) => ({ ...p, email: "Nhập email hợp lệ để đặt lại mật khẩu." }));
      return;
    }
    try {
      await resetPassword(form.email);
      setResetSent(true);
    } catch (err) {
      setGlobalError(getFirebaseErrorMessage(err.code));
    }
  };

  const inputStyle = (name) => ({
    ...styles.input,
    ...(focused[name] ? styles.inputFocus : {}),
    ...(errors[name] ? styles.inputError : {}),
  });

  const isAnyLoading = loading || !!socialLoading;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topBar} />

        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span style={styles.logoText}>Nexora</span>
        </div>

        <h1 style={styles.heading}>Đăng nhập</h1>
        <p style={styles.subheading}>Chào mừng trở lại! Vui lòng nhập thông tin của bạn.</p>

        {/* Banners */}
        {success && (
          <div style={styles.successBanner}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Đăng nhập thành công! Đang chuyển hướng...
          </div>
        )}
        {resetSent && (
          <div style={styles.successBanner}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Email đặt lại mật khẩu đã được gửi!
          </div>
        )}
        {globalError && (
          <div style={styles.globalError}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {globalError}
          </div>
        )}

        {/* Email */}
        <div style={styles.field}>
          <label style={styles.label} htmlFor="email">Email</label>
          <div style={styles.inputWrapper}>
            <span style={styles.inputIcon}><IconUser /></span>
            <input
              id="email" name="email" type="email"
              placeholder="Nhập địa chỉ email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocused((p) => ({ ...p, email: true }))}
              onBlur={() => setFocused((p) => ({ ...p, email: false }))}
              style={inputStyle("email")}
              disabled={isAnyLoading}
            />
          </div>
          {errors.email && <p style={styles.errorMsg}>{errors.email}</p>}
        </div>

        {/* Password */}
        <div style={styles.field}>
          <label style={styles.label} htmlFor="password">Mật khẩu</label>
          <div style={styles.inputWrapper}>
            <span style={styles.inputIcon}><IconLock /></span>
            <input
              id="password" name="password"
              type={showPw ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocused((p) => ({ ...p, password: true }))}
              onBlur={() => setFocused((p) => ({ ...p, password: false }))}
              style={inputStyle("password")}
              disabled={isAnyLoading}
            />
            <button style={styles.toggleBtn} onClick={() => setShowPw((v) => !v)} type="button" aria-label="Hiện/ẩn mật khẩu">
              <IconEye open={showPw} />
            </button>
          </div>
          {errors.password && <p style={styles.errorMsg}>{errors.password}</p>}
        </div>

        {/* Options */}
        <div style={styles.options}>
          <label style={styles.remember}>
            <input
              type="checkbox" checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ accentColor: "#534AB7", width: "15px", height: "15px", cursor: "pointer" }}
            />
            Ghi nhớ đăng nhập
          </label>
          <button style={styles.forgot} onClick={handleForgot} type="button">
            Quên mật khẩu?
          </button>
        </div>

        {/* Submit */}
        <button
          style={{ ...styles.btnLogin, ...(isAnyLoading ? styles.btnLoginDisabled : {}) }}
          onClick={handleSubmit}
          disabled={isAnyLoading}
          type="button"
        >
          {loading ? (
            <><IconSpinner /> Đang xử lý...</>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Đăng nhập
            </>
          )}
        </button>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />hoặc tiếp tục với<div style={styles.dividerLine} />
        </div>

        {/* Social buttons */}
        <div style={styles.socialGrid}>
          <button
            style={{ ...styles.btnSocial, ...(socialLoading === "google" ? { opacity: 0.7 } : {}) }}
            onClick={handleGoogle} disabled={isAnyLoading} type="button"
          >
            {socialLoading === "google" ? <IconSpinner /> : (
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Google
          </button>
        </div>

        {/* Sign up */}
        <div style={styles.signupRow}>
          Chưa có tài khoản?{" "}
          <button style={styles.signupLink} type="button">Đăng ký ngay</button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 480px) { .social-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}