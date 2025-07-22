// src/components/RedirectIfAuthenticated.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RedirectIfAuthenticated = () => {
  // 1. Kiểm tra xem người dùng đã có "vé" (accessToken) trong ví chưa.
  const token = localStorage.getItem('accessToken');

  // 2. Nếu CÓ vé, chuyển hướng họ ngay đến trang dashboard.
  //    Nếu KHÔNG có vé, cho phép họ ở lại các trang công khai (Login, Signup, LandingPage).
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default RedirectIfAuthenticated;