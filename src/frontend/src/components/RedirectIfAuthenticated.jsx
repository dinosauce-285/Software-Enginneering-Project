// src/components/RedirectIfAuthenticated.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RedirectIfAuthenticated = () => {
  const token = localStorage.getItem('accessToken');


  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default RedirectIfAuthenticated;