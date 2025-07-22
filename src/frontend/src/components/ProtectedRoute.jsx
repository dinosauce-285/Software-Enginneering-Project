// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Kiểm tra xem có accessToken trong localStorage không
  const token = localStorage.getItem('accessToken');

  // Nếu có token, cho phép truy cập vào các trang con (dùng <Outlet />)
  // Nếu không có token, chuyển hướng người dùng về trang đăng nhập
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;