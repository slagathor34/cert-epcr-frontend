import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { EPCRFormPagePDF } from './pages/EPCRFormPagePDF';
import { EPCRFormPageSimple } from './pages/EPCRFormPageSimple';
import { UserManagement } from './pages/UserManagement';
import MemberManagement from './pages/MemberManagement';
import MemberProfile from './pages/MemberProfile';
import MemberForm from './components/members/MemberForm';
import { initializeMockData } from './services/recordService';

function App() {
  // Initialize mock data on app start
  useEffect(() => {
    initializeMockData().catch(console.error);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/epcr/new" element={
            <ProtectedRoute requiredPermission="create_reports">
              <Layout>
                <EPCRFormPagePDF />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/epcr/pdf" element={
            <ProtectedRoute>
              <Layout>
                <EPCRFormPagePDF />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/epcr/simple" element={
            <ProtectedRoute>
              <Layout>
                <EPCRFormPageSimple />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/epcr/:id" element={
            <ProtectedRoute>
              <Layout>
                <EPCRFormPagePDF />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/epcr/:id/edit" element={
            <ProtectedRoute requiredPermission="edit_own_reports">
              <Layout>
                <EPCRFormPagePDF />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute requiredPermission="manage_users">
              <Layout>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Member Management Routes */}
          <Route path="/members" element={
            <ProtectedRoute>
              <Layout>
                <MemberManagement />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/members/new" element={
            <ProtectedRoute requiredPermission="manage_users">
              <Layout>
                <MemberForm />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/members/:id" element={
            <ProtectedRoute>
              <Layout>
                <MemberProfile />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/members/:id/edit" element={
            <ProtectedRoute requiredPermission="manage_users">
              <Layout>
                <MemberForm />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
