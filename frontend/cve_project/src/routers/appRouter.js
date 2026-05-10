import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CVEPage from '../pages/cvePages';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cves/list" replace />} />
      <Route path="/cves/list" element={<CVEPage />} />
      <Route path="/cves/:id" element={<CVEPage />} />
    </Routes>
  );
};

export default AppRouter;
