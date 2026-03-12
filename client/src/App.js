import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Notices from './pages/Notices';
import CertificateVerification from './pages/CertificateVerification';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminNotices from './pages/admin/AdminNotices';
import AdminCertificates from './pages/admin/AdminCertificates';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/certificate" element={<CertificateVerification />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute role="admin">
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/courses" element={
                <ProtectedRoute role="admin">
                  <AdminCourses />
                </ProtectedRoute>
              } />
              <Route path="/admin/notices" element={
                <ProtectedRoute role="admin">
                  <AdminNotices />
                </ProtectedRoute>
              } />
              <Route path="/admin/certificates" element={
                <ProtectedRoute role="admin">
                  <AdminCertificates />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
