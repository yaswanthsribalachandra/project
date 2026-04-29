import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminOtpVerification() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const emailParam = new URLSearchParams(location.search).get("email");
    if (emailParam) setEmail(emailParam);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/admin/verify-otp", { email, otp });
      navigate(`/admin/reset-password?email=${encodeURIComponent(email)}`);
    } catch {
      setError("Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-viewport">
      <div className="otp-ambient-bg">
        <div className="otp-glow otp-glow-1"></div>
        <div className="otp-glow otp-glow-2"></div>
        <div className="otp-glow otp-glow-3"></div>
      </div>

      <div className="otp-shell">
        <aside className="otp-info-card">
          <span className="otp-chip">TOKEN VERIFICATION</span>
          <h2>Enter One-Time Passcode</h2>
          <p>
            We sent a secure code to <strong>{email || "your email"}</strong>.
            Enter it below to continue password recovery.
          </p>
          <div className="otp-tip">
            If you did not receive it, go back and request another OTP.
          </div>
        </aside>

        <section className="otp-form-card">
          <div className="otp-header">
            <span className="otp-status">STEP 2 OF 3</span>
            <h1>Verify OTP</h1>
            <p>Only valid for a limited time.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="otp-input-field">
              <input
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder=" "
                inputMode="numeric"
                autoComplete="one-time-code"
              />
              <label>One-Time Password</label>
              <div className="otp-focus-line"></div>
            </div>

            {error && <div className="otp-error">{error}</div>}

            <button className="otp-submit-btn" type="submit" disabled={loading}>
              {loading ? "VERIFYING..." : "VERIFY OTP"}
            </button>
          </form>

          <div className="otp-footer">
            <button
              onClick={() =>
                navigate(`/admin/forgot-password?email=${encodeURIComponent(email)}`)
              }
            >
              Back to Forgot Password
            </button>
          </div>
        </section>
      </div>

      <style>{`
        .otp-viewport {
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

        .otp-ambient-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .otp-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(110px);
          opacity: 0.2;
          animation: otp-drift 18s infinite alternate ease-in-out;
        }

        .otp-glow-1 { width: 38vw; height: 38vw; top: -12%; left: -8%; background: #7b61ff; }
        .otp-glow-2 { width: 44vw; height: 44vw; right: -12%; bottom: -16%; background: #ef6b73; animation-delay: -9s; }
        .otp-glow-3 { width: 26vw; height: 26vw; top: 38%; right: 16%; background: #4ecbff; opacity: 0.12; animation-duration: 22s; }

        @keyframes otp-drift {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(85px, 50px) scale(1.1); }
        }

        .otp-shell {
          position: relative;
          z-index: 2;
          width: min(980px, 100%);
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 24px;
        }

        .otp-info-card,
        .otp-form-card {
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(14px);
        }

        .otp-info-card {
          background: linear-gradient(145deg, rgba(123, 97, 255, 0.24), rgba(33, 41, 70, 0.78));
          padding: 32px;
          color: #e7ebff;
        }

        .otp-chip {
          display: inline-block;
          font-family: "Courier New", monospace;
          letter-spacing: 1.4px;
          font-size: 11px;
          color: #8be0ff;
          margin-bottom: 16px;
        }

        .otp-info-card h2 {
          margin: 0 0 10px;
          color: #fff;
          font-size: clamp(1.5rem, 2vw, 2rem);
        }

        .otp-info-card p {
          margin: 0;
          color: #c7d0ef;
          line-height: 1.7;
        }

        .otp-tip {
          margin-top: 24px;
          padding: 14px;
          border-radius: 12px;
          color: #dfe7ff;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          font-size: 14px;
        }

        .otp-form-card {
          background: rgba(22, 26, 35, 0.82);
          padding: 36px;
        }

        .otp-header {
          margin-bottom: 28px;
        }

        .otp-status {
          display: block;
          color: #10b981;
          letter-spacing: 1.4px;
          font-family: "Courier New", monospace;
          font-size: 11px;
          margin-bottom: 8px;
        }

        .otp-header h1 {
          margin: 0;
          color: #fff;
          font-size: 30px;
          letter-spacing: 2px;
        }

        .otp-header p {
          margin: 8px 0 0;
          color: #95a3c2;
        }

        .otp-input-field {
          position: relative;
          margin-bottom: 24px;
        }

        .otp-input-field input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #fff;
          padding: 12px 0;
          font-size: 22px;
          letter-spacing: 6px;
          font-weight: 700;
        }

        .otp-input-field label {
          position: absolute;
          left: 0;
          top: 12px;
          color: #64748b;
          transition: 0.25s ease;
          pointer-events: none;
          letter-spacing: 0;
          font-size: 16px;
          font-weight: 400;
        }

        .otp-focus-line {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
          transition: 0.3s ease;
        }

        .otp-input-field input:focus ~ label,
        .otp-input-field input:not(:placeholder-shown) ~ label {
          top: -18px;
          font-size: 12px;
          color: #7b61ff;
          font-weight: 600;
        }

        .otp-input-field input:focus ~ .otp-focus-line {
          height: 2px;
          background: #7b61ff;
          box-shadow: 0 2px 12px rgba(123, 97, 255, 0.35);
        }

        .otp-error {
          margin-bottom: 16px;
          background: rgba(239, 107, 115, 0.15);
          color: #ff8e95;
          border: 1px solid rgba(239, 107, 115, 0.35);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13px;
        }

        .otp-submit-btn {
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

        .otp-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 34px rgba(123, 97, 255, 0.35);
        }

        .otp-submit-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
          transform: none;
        }

        .otp-footer {
          margin-top: 22px;
          text-align: center;
        }

        .otp-footer button {
          background: none;
          border: none;
          color: #8f9cb7;
          text-decoration: underline;
          font-size: 13px;
          cursor: pointer;
        }

        .otp-footer button:hover {
          color: #fff;
        }

        @media (max-width: 900px) {
          .otp-shell {
            grid-template-columns: 1fr;
          }

          .otp-info-card,
          .otp-form-card {
            padding: 28px;
          }
        }
      `}</style>
    </div>
  );
}
