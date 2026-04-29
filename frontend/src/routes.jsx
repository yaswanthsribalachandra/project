import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/auths/Login";
import AdminRegister from "./components/auths/AdminRegister";
import AdminForgotPassword from "./components/auths/AdminForgotPassword";
import AdminOtpVerification from "./components/auths/AdminOtpVerification";
import AdminResetPassword from "./components/auths/AdminResetPassword";
import LoginSuccess from "./components/auth/loginsuccess";
import HowItWorks from "./components/auth/HowItWorks";
import Creators from "./components/auth/Creators";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/verify-otp" element={<AdminOtpVerification />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/creators" element={<Creators />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
