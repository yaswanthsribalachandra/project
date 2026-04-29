import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdminLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/admin/login", {
        email: adminEmail,
        password: adminPassword,
      });

      localStorage.setItem("admin_token", res.data.token);
      localStorage.setItem("admin_email", adminEmail);
      navigate("/login-success");
    } catch {
      setError("Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sentient-viewport">
      {/* Full-screen moving background elements */}
      <div className="ambient-bg">
        <div className="glow-sphere sphere-1"></div>
        <div className="glow-sphere sphere-2"></div>
        <div className="glow-sphere sphere-3"></div>
      </div>

      <div className="login-container">
        <div className="admin-login-card">
          <div className="brand-header">
            <span className="system-status">○ Systems Online: Secure Access</span>
            <h1>SENTIENTART</h1>
            <p>Emotion-to-Image Admin Portal</p>
          </div>

          <div className="input-field">
            <input
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder=" "
            />
            <label>Admin Email</label>
            <div className="focus-line"></div>
          </div>

          <div className="input-field">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder=" "
            />
            <label>Password</label>
            <div className="focus-line"></div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <span>Reveal Credentials</span>
            </label>
            <button 
              className="forgot-link"
              onClick={() => navigate(`/admin/forgot-password?email=${encodeURIComponent(adminEmail)}`)}
            >
              Forgot?
            </button>
          </div>

          {error && <div className="error-alert">⚠️ {error}</div>}

          <button className="submit-btn" onClick={handleAdminLogin} disabled={loading}>
            {loading ? "AUTHENTICATING..." : "ANALYZE & ACCESS"}
          </button>

          <div className="card-footer">
            <button onClick={() => navigate("/admin/register")}>Create Admin Account</button>
          </div>
        </div>
      </div>

      <style>{`
        /* Core Reset to ensure full screen coverage */
        .sentient-viewport {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100svh;
          background-color: #0b0e14;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* Full Screen Animated Background */
        .ambient-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 0;
        }

        .glow-sphere {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.2;
          animation: drift 15s infinite alternate ease-in-out;
        }

        .sphere-1 { width: 40vw; height: 40vw; background: #7b61ff; top: -10%; left: -10%; }
        .sphere-2 { width: 50vw; height: 50vw; background: #ef6b73; bottom: -15%; right: -10%; animation-delay: -7s; }
        .sphere-3 { width: 30vw; height: 30vw; background: #7b61ff; top: 40%; right: 10%; opacity: 0.1; animation-duration: 20s; }

        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(100px, 50px) scale(1.1); }
        }

        /* Centered Login Card */
        .login-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px; /* Perfect laptop card size */
          padding: 20px;
        }

        .admin-login-card {
          background: rgba(22, 26, 35, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 48px;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
        }

        .system-status {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #10b981;
          display: block;
          margin-bottom: 8px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .brand-header h1 {
          color: #ffffff;
          font-size: 28px;
          font-weight: 800;
          margin: 0;
          letter-spacing: 4px;
        }

        .brand-header p {
          color: #94a3b8;
          font-size: 14px;
          margin: 8px 0 40px 0;
        }

        /* Minimalist Input Lines */
        .input-field {
          position: relative;
          margin-bottom: 35px;
        }

        .input-field input {
          width: 100%;
          padding: 12px 0;
          font-size: 16px;
          color: #ffffff;
          background: transparent;
          border: none;
          outline: none;
        }

        .input-field .focus-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-field input:focus ~ .focus-line {
          background: #7b61ff;
          height: 2px;
          box-shadow: 0 2px 10px rgba(123, 97, 255, 0.3);
        }

        .input-field label {
          position: absolute;
          top: 12px;
          left: 0;
          color: #64748b;
          pointer-events: none;
          transition: 0.3s ease;
        }

        .input-field input:focus ~ label,
        .input-field input:not(:placeholder-shown) ~ label {
          top: -20px;
          font-size: 12px;
          color: #7b61ff;
          font-weight: 600;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #94a3b8;
          cursor: pointer;
        }

        .forgot-link {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 13px;
          cursor: pointer;
          transition: 0.2s;
        }

        .forgot-link:hover { color: #ffffff; }

        .submit-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          background: #7b61ff;
          color: white;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 20px rgba(123, 97, 255, 0.2);
        }

        .submit-btn:hover {
          background: #6a4df4;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(123, 97, 255, 0.3);
        }

        .submit-btn:active { transform: translateY(0); }

        .error-alert {
          color: #ef6b73;
          font-size: 13px;
          margin-bottom: 20px;
          text-align: center;
          background: rgba(239, 107, 115, 0.1);
          padding: 8px;
          border-radius: 6px;
        }

        .card-footer {
          margin-top: 32px;
          text-align: center;
        }

        .card-footer button {
          background: none;
          border: none;
          color: #64748b;
          font-size: 13px;
          text-decoration: underline;
          cursor: pointer;
          transition: 0.2s;
        }

        .card-footer button:hover { color: #ffffff; }
      `}</style>
    </div>
  );
}

// import React from "react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";

// export default function Login() {
//   const navigate = useNavigate();
//   const [adminEmail, setAdminEmail] = useState("");
//   const [adminPassword, setAdminPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleAdminLogin = async () => {
//     setError("");
//     setLoading(true);
//     try {
//       const res = await api.post("/auth/admin/login", {
//         email: adminEmail,
//         password: adminPassword,
//       });

//       localStorage.setItem("admin_token", res.data.token);
//       localStorage.setItem("admin_email", adminEmail);
//       navigate("/login-success");
//     } catch {
//       setError("Invalid admin credentials");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="admin-login-page">
//         <div className="admin-login-card">
//           <h2>Admin Login</h2>
//           <p>Sign in with your admin account.</p>

//           <input
//             type="email"
//             placeholder="Admin Email"
//             value={adminEmail}
//             onChange={(e) => setAdminEmail(e.target.value)}
//           />

//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Password"
//             value={adminPassword}
//             onChange={(e) => setAdminPassword(e.target.value)}
//           />

//           <label className="show-password">
//             <input
//               type="checkbox"
//               checked={showPassword}
//               onChange={(e) => setShowPassword(e.target.checked)}
//             />
//             Show password
//           </label>

//           {error && <div className="error">{error}</div>}

//           <button onClick={handleAdminLogin} disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>

//           <div className="links">
//             <button onClick={() => navigate("/admin/register")}>Register Admin</button>
//             <button
//               onClick={() =>
//                 navigate(
//                   `/admin/forgot-password?email=${encodeURIComponent(adminEmail)}`
//                 )
//               }
//             >
//               Forgot Password
//             </button>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         .admin-login-page {
//           min-height: 100vh;
//           display: grid;
//           place-items: center;
//           background: linear-gradient(135deg, #f7f8fc, #edf2ff);
//           padding: 24px;
//         }

//         .admin-login-card {
//           width: 100%;
//           max-width: 420px;
//           background: #ffffff;
//           border-radius: 12px;
//           padding: 24px;
//           box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
//           display: grid;
//           gap: 12px;
//         }

//         .admin-login-card h2 {
//           margin: 0;
//           color: #b42318;
//         }

//         .admin-login-card p {
//           margin: 0 0 8px;
//           color: #475467;
//         }

//         .admin-login-card input {
//           border: 1px solid #d0d5dd;
//           border-radius: 8px;
//           padding: 10px 12px;
//           font-size: 14px;
//         }

//         .show-password {
//           display: flex;
//           gap: 8px;
//           align-items: center;
//           font-size: 14px;
//           color: #344054;
//         }

//         .error {
//           color: #b42318;
//           font-size: 14px;
//         }

//         .admin-login-card button {
//           border: none;
//           border-radius: 8px;
//           padding: 10px 12px;
//           font-weight: 600;
//           cursor: pointer;
//           background: #b42318;
//           color: #fff;
//         }

//         .admin-login-card button:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//         }

//         .links {
//           display: grid;
//           gap: 8px;
//         }
//       `}</style>
//     </>
//   );
// }
