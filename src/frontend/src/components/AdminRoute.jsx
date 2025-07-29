
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const token = localStorage.getItem('accessToken');
  const userString = localStorage.getItem('user');
  
  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userString);


  if (user.role !== 'ADMIN') {

    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;