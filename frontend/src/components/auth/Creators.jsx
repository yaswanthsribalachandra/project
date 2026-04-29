import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Creators() {
  const [showSecret, setShowSecret] = useState(false);
  const [safeMode, setSafeMode] = useState(false);

  useEffect(() => {
    setSafeMode(localStorage.getItem("safe_mode") === "true");
  }, []);

  const toggleSafeMode = () => {
    const next = !safeMode;
    setSafeMode(next);
    localStorage.setItem("safe_mode", String(next));
  };

  return (
    <>
      <div className="cr-page">
        <Link to="/login-success" className="cr-back-link">
          Back
        </Link>

        <button className="cr-secret-btn" onClick={() => setShowSecret(true)} aria-label="Secret Settings" />

        <div className="cr-profile-card">
          <div className="cr-avatar">A</div>
          <h1>Your Name</h1>
          <span className="cr-role">Lead Developer and AI Architect</span>
          <p>
            A 22-year-old developer passionate about Python, full-stack web development,
            and the intersection of human emotion and artificial intelligence.
          </p>

          <div className="cr-socials">
            <a href="#" aria-label="GitHub">GitHub</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
            <a href="#" aria-label="Website">Website</a>
          </div>
        </div>

        {showSecret && (
          <div className="cr-modal-overlay" onClick={() => setShowSecret(false)}>
            <div className="cr-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Secret Mode</h3>
              <p>Use local safe emotion images instead of Hugging Face generation.</p>
              <button
                className={`cr-toggle ${safeMode ? "on" : "off"}`}
                onClick={toggleSafeMode}
              >
                {safeMode ? "ON" : "OFF"}
              </button>
              <button className="cr-close" onClick={() => setShowSecret(false)}>Close</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .cr-page {
          font-family: Inter, Arial, sans-serif;
          background: #0f111a;
          color: #e0e0e0;
          min-height: 100vh;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          padding: 24px;
        }

        .cr-back-link {
          position: absolute;
          top: 28px;
          left: 28px;
          color: #00e5ff;
          text-decoration: none;
          font-weight: 600;
        }

        .cr-secret-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 0;
          background: rgba(255, 255, 255, 0.18);
          cursor: pointer;
        }

        .cr-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: grid;
          place-items: center;
          z-index: 50;
        }

        .cr-modal {
          width: min(420px, 90vw);
          background: #161a2b;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          padding: 20px;
          text-align: center;
        }

        .cr-modal h3 {
          margin: 0 0 8px;
          font-family: Poppins, Arial, sans-serif;
        }

        .cr-modal p {
          margin: 0 0 14px;
          color: #b6bbca;
          font-size: 0.9rem;
        }

        .cr-toggle {
          width: 100%;
          height: 42px;
          border-radius: 10px;
          border: 0;
          color: #fff;
          font-weight: 700;
          cursor: pointer;
          margin-bottom: 10px;
        }

        .cr-toggle.on { background: linear-gradient(45deg, #2bb673, #1f9d63); }
        .cr-toggle.off { background: linear-gradient(45deg, #7c4dff, #5f39d8); }

        .cr-close {
          width: 100%;
          height: 38px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: transparent;
          color: #fff;
          cursor: pointer;
        }

        .cr-profile-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          max-width: 420px;
          backdrop-filter: blur(10px);
        }

        .cr-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(45deg, #7c4dff, #00e5ff);
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.8rem;
          color: #fff;
          border: 4px solid #0f111a;
          font-family: Poppins, Arial, sans-serif;
          font-weight: 700;
        }

        .cr-profile-card h1 {
          font-family: Poppins, Arial, sans-serif;
          margin: 10px 0;
          font-size: 1.8rem;
        }

        .cr-role {
          color: #00e5ff;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 2px;
          margin-bottom: 20px;
          display: block;
        }

        .cr-profile-card p {
          font-size: 0.9rem;
          color: #aaa;
          margin-bottom: 25px;
        }

        .cr-socials a {
          color: #fff;
          margin: 0 10px;
          font-size: 1rem;
          transition: 0.3s;
          text-decoration: none;
        }

        .cr-socials a:hover {
          color: #00e5ff;
        }
      `}</style>
    </>
  );
}
