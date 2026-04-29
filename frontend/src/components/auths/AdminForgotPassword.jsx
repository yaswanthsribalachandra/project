import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const emailParam = new URLSearchParams(location.search).get("email");
    if (emailParam) setEmail(emailParam);
  }, [location]);

  const handleContinue = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/admin/forgot-password", { email });
      navigate(`/admin/verify-otp?email=${encodeURIComponent(email)}`);
    } catch {
      setError("Unable to send OTP. Please check the email and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-viewport">
      <div className="fp-ambient-bg">
        <div className="fp-glow fp-glow-1"></div>
        <div className="fp-glow fp-glow-2"></div>
        <div className="fp-glow fp-glow-3"></div>
      </div>

      <div className="fp-shell">
        <aside className="fp-info-card">
          <span className="fp-chip">SECURE RECOVERY</span>
          <h2>Reset Admin Access</h2>
          <p>
            Start the recovery flow by requesting a one-time passcode on your
            registered admin email.
          </p>
          <div className="fp-tip">
            Use the same email you used during admin registration.
          </div>
        </aside>

        <section className="fp-form-card">
          <div className="fp-header">
            <span className="fp-status">STEP 1 OF 3</span>
            <h1>Forgot Password</h1>
            <p>We will send a one-time password to continue.</p>
          </div>

          <form onSubmit={handleContinue}>
            <div className="fp-input-field">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
              />
              <label>Admin Email</label>
              <div className="fp-focus-line"></div>
            </div>

            {error && <div className="fp-error">{error}</div>}

            <button className="fp-submit-btn" type="submit" disabled={loading}>
              {loading ? "SENDING OTP..." : "SEND OTP"}
            </button>
          </form>

          <div className="fp-footer">
            <button onClick={() => navigate("/login")}>Back to Login</button>
          </div>
        </section>
      </div>

      <style>{`
        .fp-viewport {
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

        .fp-ambient-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .fp-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(110px);
          opacity: 0.2;
          animation: fp-drift 18s infinite alternate ease-in-out;
        }

        .fp-glow-1 { width: 38vw; height: 38vw; top: -10%; left: -12%; background: #7b61ff; }
        .fp-glow-2 { width: 44vw; height: 44vw; right: -12%; bottom: -18%; background: #ef6b73; animation-delay: -8s; }
        .fp-glow-3 { width: 26vw; height: 26vw; top: 42%; right: 18%; background: #4ecbff; opacity: 0.12; animation-duration: 22s; }

        @keyframes fp-drift {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(80px, 45px) scale(1.1); }
        }

        .fp-shell {
          position: relative;
          z-index: 2;
          width: min(980px, 100%);
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 24px;
        }

        .fp-info-card,
        .fp-form-card {
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(14px);
        }

        .fp-info-card {
          background: linear-gradient(145deg, rgba(123, 97, 255, 0.24), rgba(33, 41, 70, 0.78));
          padding: 32px;
          color: #e7ebff;
        }

        .fp-chip {
          display: inline-block;
          font-family: "Courier New", monospace;
          letter-spacing: 1.4px;
          font-size: 11px;
          color: #8be0ff;
          margin-bottom: 16px;
        }

        .fp-info-card h2 {
          margin: 0 0 10px;
          color: #fff;
          font-size: clamp(1.5rem, 2vw, 2rem);
          letter-spacing: 0.4px;
        }

        .fp-info-card p {
          margin: 0;
          color: #c7d0ef;
          line-height: 1.7;
        }

        .fp-tip {
          margin-top: 24px;
          padding: 14px;
          border-radius: 12px;
          color: #dfe7ff;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          font-size: 14px;
        }

        .fp-form-card {
          background: rgba(22, 26, 35, 0.82);
          padding: 36px;
        }

        .fp-header {
          margin-bottom: 28px;
        }

        .fp-status {
          display: block;
          color: #10b981;
          letter-spacing: 1.4px;
          font-family: "Courier New", monospace;
          font-size: 11px;
          margin-bottom: 8px;
        }

        .fp-header h1 {
          margin: 0;
          color: #fff;
          font-size: 30px;
          letter-spacing: 2px;
        }

        .fp-header p {
          margin: 8px 0 0;
          color: #95a3c2;
        }

        .fp-input-field {
          position: relative;
          margin-bottom: 24px;
        }

        .fp-input-field input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #fff;
          padding: 12px 0;
          font-size: 16px;
        }

        .fp-input-field label {
          position: absolute;
          left: 0;
          top: 12px;
          color: #64748b;
          transition: 0.25s ease;
          pointer-events: none;
        }

        .fp-focus-line {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
          transition: 0.3s ease;
        }

        .fp-input-field input:focus ~ label,
        .fp-input-field input:not(:placeholder-shown) ~ label {
          top: -18px;
          font-size: 12px;
          color: #7b61ff;
          font-weight: 600;
        }

        .fp-input-field input:focus ~ .fp-focus-line {
          height: 2px;
          background: #7b61ff;
          box-shadow: 0 2px 12px rgba(123, 97, 255, 0.35);
        }

        .fp-error {
          margin-bottom: 16px;
          background: rgba(239, 107, 115, 0.15);
          color: #ff8e95;
          border: 1px solid rgba(239, 107, 115, 0.35);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
        }

        .fp-submit-btn {
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

        .fp-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 34px rgba(123, 97, 255, 0.35);
        }

        .fp-submit-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
          transform: none;
        }

        .fp-footer {
          margin-top: 22px;
          text-align: center;
        }

        .fp-footer button {
          background: none;
          border: none;
          color: #8f9cb7;
          text-decoration: underline;
          font-size: 13px;
          cursor: pointer;
        }

        .fp-footer button:hover {
          color: #fff;
        }

        @media (max-width: 900px) {
          .fp-shell {
            grid-template-columns: 1fr;
          }

          .fp-info-card,
          .fp-form-card {
            padding: 28px;
          }
        }
      `}</style>
    </div>
  );
}
