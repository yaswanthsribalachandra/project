import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    profession: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (form.password.length < 4) {
      setError("Password must be at least 4 characters.");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/admin/register", form);
      alert("Admin registered successfully");
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sentient-viewport">
      {/* FULL SCREEN BACKGROUND ELEMENTS */}
      <div className="ambient-bg">
        <div className="glow-sphere sphere-1"></div>
        <div className="glow-sphere sphere-2"></div>
        <div className="glow-sphere sphere-3"></div>
      </div>

      <div className="content-container">
        <div className="admin-register-card">
          <div className="brand-header">
            <span className="system-status">○ Initialize Admin Profile</span>
            <h1>SENTIENTART</h1>
            <p>Create credentials to manage generative art assets.</p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="row-grid">
              <div className="input-group">
                <input
                  type="text"
                  required
                  value={form.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  placeholder=" "
                />
                <label>First Name</label>
                <div className="focus-line"></div>
              </div>

              <div className="input-group">
                <input
                  type="text"
                  required
                  value={form.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  placeholder=" "
                />
                <label>Last Name</label>
                <div className="focus-line"></div>
              </div>
            </div>

            <div className="input-group">
              <input
                type="text"
                required
                value={form.profession}
                onChange={(e) => handleChange("profession", e.target.value)}
                placeholder=" "
              />
              <label>Profession / Role</label>
              <div className="focus-line"></div>
            </div>

            <div className="input-group">
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder=" "
              />
              <label>Email Address</label>
              <div className="focus-line"></div>
            </div>

            <div className="row-grid">
              <div className="input-group">
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder=" "
                />
                <label>Password</label>
                <div className="focus-line"></div>
              </div>

              <div className="input-group">
                <input
                  type="password"
                  required
                  value={form.confirm_password}
                  onChange={(e) => handleChange("confirm_password", e.target.value)}
                  placeholder=" "
                />
                <label>Confirm</label>
                <div className="focus-line"></div>
              </div>
            </div>

            {error && <div className="error-alert">⚠️ {error}</div>}

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "PROCESSING..." : "REGISTER ADMIN"}
            </button>
          </form>

          <div className="card-footer">
            <button onClick={() => navigate("/login")}>Existing User? Back to Login</button>
          </div>
        </div>
      </div>

      <style>{`
        /* FORCING FULL SCREEN VIEWPORT */
        .sentient-viewport {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100svh;
          background-color: #0b0e14;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', -apple-system, sans-serif;
          overflow-x: hidden;
        }

        /* BACKGROUND ELEMENTS */
        .ambient-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .glow-sphere {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
          animation: drift 20s infinite alternate ease-in-out;
        }

        .sphere-1 { width: 50vw; height: 50vw; background: #7b61ff; top: -10%; left: -5%; }
        .sphere-2 { width: 60vw; height: 60vw; background: #ef6b73; bottom: -15%; right: -5%; animation-delay: -10s; }
        .sphere-3 { width: 30vw; height: 30vw; background: #7b61ff; top: 40%; right: 10%; opacity: 0.05; }

        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(60px, 40px) scale(1.1); }
        }

        /* CONTENT POSITIONING */
        .content-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 550px;
          padding: 40px 20px;
        }

        .admin-register-card {
          background: rgba(22, 26, 35, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 28px;
          padding: 50px;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
        }

        /* TYPOGRAPHY */
        .system-status {
          font-family: monospace;
          font-size: 11px;
          color: #10b981;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: block;
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
          margin: 10px 0 40px 0;
          line-height: 1.5;
        }

        /* GRID FOR COMPACT FORM */
        .row-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
        }

        /* MINIMALIST LINE INPUTS */
        .input-group {
          position: relative;
          margin-bottom: 35px;
        }

        .input-group input {
          width: 100%;
          padding: 10px 0;
          font-size: 15px;
          color: #ffffff;
          background: transparent;
          border: none;
          outline: none;
        }

        .input-group .focus-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          transition: 0.4s ease;
        }

        .input-group input:focus ~ .focus-line {
          background: #ef6b73;
          height: 2px;
          box-shadow: 0 2px 10px rgba(239, 107, 115, 0.3);
        }

        .input-group label {
          position: absolute;
          top: 10px;
          left: 0;
          color: #64748b;
          pointer-events: none;
          transition: 0.3s ease;
        }

        .input-group input:focus ~ label,
        .input-group input:not(:placeholder-shown) ~ label {
          top: -18px;
          font-size: 11px;
          color: #ef6b73;
          font-weight: 600;
          text-transform: uppercase;
        }

        /* BUTTONS */
        .submit-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 14px;
          background: #ef6b73;
          color: white;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
          box-shadow: 0 10px 20px rgba(239, 107, 115, 0.2);
        }

        .submit-btn:hover {
          background: #f05a64;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(239, 107, 115, 0.3);
        }

        .error-alert {
          color: #ef6b73;
          font-size: 13px;
          text-align: center;
          margin-bottom: 25px;
          background: rgba(239, 107, 115, 0.1);
          padding: 10px;
          border-radius: 8px;
        }

        .card-footer {
          margin-top: 30px;
          text-align: center;
        }

        .card-footer button {
          background: none;
          border: none;
          color: #64748b;
          font-size: 13px;
          cursor: pointer;
          text-decoration: underline;
        }

        .card-footer button:hover { color: #ffffff; }

        /* SCALING FOR SMALLER LAPTOPS */
        @media (max-width: 768px) {
          .row-grid { grid-template-columns: 1fr; gap: 0; }
          .admin-register-card { padding: 30px; }
        }
      `}</style>
    </div>
  );
}

// import React from "react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";

// export default function AdminRegister() {
//   const navigate = useNavigate();
//   const [error, setError] = useState("");
//   const [form, setForm] = useState({
//     first_name: "",
//     last_name: "",
//     profession: "",
//     email: "",
//     password: "",
//     confirm_password: "",
//   });

//   const handleChange = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");

//     const payload = {
//       first_name: form.first_name.trim(),
//       last_name: form.last_name.trim(),
//       profession: form.profession.trim(),
//       email: form.email.trim(),
//       password: form.password,
//       confirm_password: form.confirm_password,
//     };

//     if (payload.password.length < 4) {
//       setError("Password must be at least 4 characters.");
//       return;
//     }

//     if (payload.password !== payload.confirm_password) {
//       setError("Passwords do not match.");
//       return;
//     }

//     try {
//       await api.post("/auth/admin/register", payload);
//       alert("Admin registered successfully");
//       navigate("/login");
//     } catch (err) {
//       const detail = err?.response?.data?.detail;
//       if (Array.isArray(detail)) {
//         setError(detail.map((d) => d.msg).join(", "));
//       } else if (typeof detail === "string") {
//         setError(detail);
//       } else {
//         setError("Registration failed");
//       }
//     }
//   };

//   return (
//     <div className="container-fluid min-vh-100 d-flex align-items-center bg-light">
//       <div className="row w-100 justify-content-center">
//         <div className="col-md-4">
//           <div className="card shadow-lg border-0">
//             <div className="card-body p-4">
//               <h3 className="text-center fw-bold mb-4 text-danger">Admin Registration</h3>

//               <form onSubmit={handleRegister}>
//                 <div className="mb-3">
//                   <input
//                     className="form-control border-0 border-bottom rounded-0"
//                     placeholder="First Name"
//                     value={form.first_name}
//                     onChange={(e) => handleChange("first_name", e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <input
//                     className="form-control border-0 border-bottom rounded-0"
//                     placeholder="Last Name"
//                     value={form.last_name}
//                     onChange={(e) => handleChange("last_name", e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <input
//                     className="form-control border-0 border-bottom rounded-0"
//                     placeholder="Profession"
//                     value={form.profession}
//                     onChange={(e) => handleChange("profession", e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <input
//                     type="email"
//                     className="form-control border-0 border-bottom rounded-0"
//                     placeholder="Email"
//                     value={form.email}
//                     onChange={(e) => handleChange("email", e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <input
//                     type="password"
//                     className="form-control border-0 border-bottom rounded-0"
//                     placeholder="Password"
//                     value={form.password}
//                     onChange={(e) => handleChange("password", e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <input
//                     type="password"
//                     className="form-control border-0 border-bottom rounded-0"
//                     placeholder="Confirm Password"
//                     value={form.confirm_password}
//                     onChange={(e) => handleChange("confirm_password", e.target.value)}
//                     required
//                   />
//                 </div>

//                 <button className="btn btn-danger w-100 fw-bold" type="submit">
//                   Register
//                 </button>
//               </form>

//               {error && <div className="text-danger mt-3">{error}</div>}

//               <button
//                 className="btn btn-outline-secondary w-100 mt-3"
//                 onClick={() => navigate("/login")}
//               >
//                 Back to Login
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
