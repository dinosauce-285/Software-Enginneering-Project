// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const token = localStorage.getItem('accessToken');
  const userString = localStorage.getItem('user');
  
  // 1. Kiểm tra xem có đăng nhập không
  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }

  // 2. Phân tích chuỗi JSON để lấy object user
  const user = JSON.parse(userString);

  // 3. Kiểm tra xem có phải là ADMIN không
  if (user.role !== 'ADMIN') {
    // Nếu không phải admin, chuyển hướng họ về dashboard của user thường
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Nếu là admin, cho phép truy cập
  return <Outlet />;
};

export default AdminRoute;