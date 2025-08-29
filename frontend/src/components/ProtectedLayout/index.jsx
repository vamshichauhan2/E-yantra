import React from 'react';
import AdminHeader from '../admin/components/Header/adminheader';
import { Outlet } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

const ProtectedLayout = () => (
  <ProtectedRoute>
    <>
      <AdminHeader />
      <Outlet />
    </>
  </ProtectedRoute>
);

export default ProtectedLayout;
