import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { EPCRFormPage } from './pages/EPCRFormPage';
import { EPCRFormPagePDF } from './pages/EPCRFormPagePDF';
import { EPCRFormPageSimple } from './pages/EPCRFormPageSimple';
import { initializeMockData } from './services/recordService';

function App() {
  // Initialize mock data on app start
  useEffect(() => {
    initializeMockData().catch(console.error);
  }, []);
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/epcr/new" element={<EPCRFormPagePDF />} />
          <Route path="/epcr/pdf" element={<EPCRFormPagePDF />} />
          <Route path="/epcr/simple" element={<EPCRFormPageSimple />} />
          <Route path="/epcr/:id" element={<EPCRFormPagePDF />} />
          <Route path="/epcr/:id/edit" element={<EPCRFormPagePDF />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
