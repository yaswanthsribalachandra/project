import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const email = new URLSearchParams(useLocation().search).get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/admin/reset-password", {
        email,
        new_password: password,
      });
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.detail || "Password reset failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-viewport">
      <div className="rp-ambient-bg">
        <div className="rp-glow rp-glow-1"></div>
        <div className="rp-glow rp-glow-2"></div>
        <div className="rp-glow rp-glow-3"></div>
      </div>

      <div className="rp-shell">
        <aside className="rp-info-card">
          <span className="rp-chip">CREDENTIAL UPDATE</span>
          <h2>Create a New Password</h2>
          <p>
            Choose a strong password for <strong>{email || "your account"}</strong>
            to complete the recovery process.
          </p>
          <ul className="rp-rules">
            <li>Use at least 8 characters</li>
            <li>Mix letters, numbers, and symbols</li>
            <li>Avoid reused passwords</li>
          </ul>
        </aside>

        <section className="rp-form-card">
          <div className="rp-header">
            <span className="rp-status">STEP 3 OF 3</span>
            <h1>Reset Password</h1>
            <p>Finalize secure account access.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="rp-input-field">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
              />
              <label>New Password</label>
              <button
                className="rp-visibility-btn"
                type="button"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              <div className="rp-focus-line"></div>
            </div>

            <div className="rp-input-field">
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder=" "
              />
              <label>Confirm Password</label>
              <button
                className="rp-visibility-btn"
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
              <div className="rp-focus-line"></div>
            </div>

            {error && <div className="rp-error">{error}</div>}

            <button className="rp-submit-btn" type="submit" disabled={loading}>
              {loading ? "UPDATING..." : "RESET PASSWORD"}
            </button>
          </form>

          <div className="rp-footer">
            <button onClick={() => navigate("/login")}>Back to Login</button>
          </div>
        </section>
      </div>

      <style>{`
        .rp-viewport {
          width: 100%;
          min-height: 100svh;
          position: relative;
          overflow: hidden;
          background: #0b0e14;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: "Inter", -apple-system, sans-serif;
        }

        .rp-ambient-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .rp-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(110px);
          opacity: 0.2;
          animation: rp-drift 18s infinite alternate ease-in-out;
        }

        .rp-glow-1 { width: 38vw; height: 38vw; top: -10%; left: -12%; background: #7b61ff; }
        .rp-glow-2 { width: 44vw; height: 44vw; right: -12%; bottom: -18%; background: #ef6b73; animation-delay: -8s; }
        .rp-glow-3 { width: 26vw; height: 26vw; top: 42%; right: 14%; background: #4ecbff; opacity: 0.12; animation-duration: 22s; }

        @keyframes rp-drift {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(80px, 45px) scale(1.1); }
        }

        .rp-shell {
          position: relative;
          z-index: 2;
          width: min(980px, 100%);
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 24px;
        }

        .rp-info-card,
        .rp-form-card {
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(14px);
        }

        .rp-info-card {
          background: linear-gradient(145deg, rgba(123, 97, 255, 0.24), rgba(33, 41, 70, 0.78));
          padding: 32px;
          color: #e7ebff;
        }

        .rp-chip {
          display: inline-block;
          font-family: "Courier New", monospace;
          letter-spacing: 1.4px;
          font-size: 11px;
          color: #8be0ff;
          margin-bottom: 16px;
        }

        .rp-info-card h2 {
          margin: 0 0 10px;
          color: #fff;
          font-size: clamp(1.5rem, 2vw, 2rem);
        }

        .rp-info-card p {
          margin: 0;
          color: #c7d0ef;
          line-height: 1.7;
        }

        .rp-rules {
          margin: 20px 0 0;
          padding-left: 18px;
          color: #d8e0ff;
          line-height: 1.8;
        }

        .rp-form-card {
          background: rgba(22, 26, 35, 0.82);
          padding: 36px;
        }

        .rp-header {
          margin-bottom: 28px;
        }

        .rp-status {
          display: block;
          color: #10b981;
          letter-spacing: 1.4px;
          font-family: "Courier New", monospace;
          font-size: 11px;
          margin-bottom: 8px;
        }

        .rp-header h1 {
          margin: 0;
          color: #fff;
          font-size: 30px;
          letter-spacing: 2px;
        }

        .rp-header p {
          margin: 8px 0 0;
          color: #95a3c2;
        }

        .rp-input-field {
          position: relative;
          margin-bottom: 24px;
        }

        .rp-input-field input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #fff;
          padding: 12px 52px 12px 0;
          font-size: 16px;
        }

        .rp-input-field label {
          position: absolute;
          left: 0;
          top: 12px;
          color: #64748b;
          transition: 0.25s ease;
          pointer-events: none;
        }

        .rp-visibility-btn {
          position: absolute;
          right: 0;
          top: 9px;
          border: 0;
          background: none;
          color: #9fb0d6;
          cursor: pointer;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 700;
          padding: 4px 0;
        }

        .rp-focus-line {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
          transition: 0.3s ease;
        }

        .rp-input-field input:focus ~ label,
        .rp-input-field input:not(:placeholder-shown) ~ label {
          top: -18px;
          font-size: 12px;
          color: #7b61ff;
          font-weight: 600;
        }

        .rp-input-field input:focus ~ .rp-focus-line {
          height: 2px;
          background: #7b61ff;
          box-shadow: 0 2px 12px rgba(123, 97, 255, 0.35);
        }

        .rp-error {
          margin-bottom: 16px;
          background: rgba(239, 107, 115, 0.15);
          color: #ff8e95;
          border: 1px solid rgba(239, 107, 115, 0.35);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
        }

        .rp-submit-btn {
          width: 100%;
          border: 0;
          border-radius: 12px;
          padding: 15px;
          cursor: pointer;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1.4px;
          background: linear-gradient(120deg, #7b61ff, #6a4df4);
          box-shadow: 0 12px 25px rgba(123, 97, 255, 0.3);
          transition: 0.25s ease;
        }

        .rp-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 34px rgba(123, 97, 255, 0.35);
        }

        .rp-submit-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
          transform: none;
        }

        .rp-footer {
          margin-top: 22px;
          text-align: center;
        }

        .rp-footer button {
          background: none;
          border: none;
          color: #8f9cb7;
          text-decoration: underline;
          font-size: 13px;
          cursor: pointer;
        }

        .rp-footer button:hover {
          color: #fff;
        }

        @media (max-width: 900px) {
          .rp-shell {
            grid-template-columns: 1fr;
          }

          .rp-info-card,
          .rp-form-card {
            padding: 28px;
          }
        }
      `}</style>
    </div>
  );
}
