import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

// Patient App Components
import Welcome from '@/components/patient/Welcome';
import DoctorSearch from '@/components/patient/DoctorSearch';
import DoctorProfile from '@/components/patient/DoctorProfile';
import AppointmentBooking from '@/components/patient/AppointmentBooking';
import PaymentConfirmation from '@/components/patient/PaymentConfirmation';
import VideoConsultation from '@/components/patient/VideoConsultation';
import PrescriptionDownload from '@/components/patient/PrescriptionDownload';
import PatientDashboard from '@/components/patient/PatientDashboard';
import EditProfile from '@/components/patient/EditProfile';

// Doctor Dashboard Components
import DoctorSignup from '@/components/doctor/DoctorSignup';
import DoctorAvailability from '@/components/doctor/DoctorAvailability';
import DoctorConsultation from '@/components/doctor/DoctorConsultation';
import DoctorEarnings from '@/components/doctor/DoctorEarnings';
import DoctorDashboard from './components/doctor/DoctorDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Public Route Component (for non-authenticated users)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background medical-pattern font-sans">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <PublicRoute>
                <Welcome />
              </PublicRoute>
            } />
            <Route path="/doctor-signup" element={
              <PublicRoute>
                <DoctorSignup />
              </PublicRoute>
            } />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <PatientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile/edit" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute>
                <DoctorSearch />
              </ProtectedRoute>
            } />
            <Route path="/doctor/:id" element={
              <ProtectedRoute>
                <DoctorProfile />
              </ProtectedRoute>
            } />
            <Route path="/booking/:doctorId" element={
              <ProtectedRoute>
                <AppointmentBooking />
              </ProtectedRoute>
            } />
            <Route path="/payment" element={
              <ProtectedRoute>
                <PaymentConfirmation />
              </ProtectedRoute>
            } />
            <Route path="/consultation/:id" element={
              <ProtectedRoute>
                <VideoConsultation />
              </ProtectedRoute>
            } />
            <Route path="/prescription/:id" element={
              <ProtectedRoute>
                <PrescriptionDownload />
              </ProtectedRoute>
            } />

            {/* Doctor Dashboard Routes */}
            <Route path="/doctor-availability" element={
              <ProtectedRoute>
                <DoctorAvailability />
              </ProtectedRoute>
            } />
            <Route path="/doctor-consultation/:id" element={
              <ProtectedRoute>
                <DoctorConsultation />
              </ProtectedRoute>
            } />
            <Route path="/doctor-earnings" element={
              <ProtectedRoute>
                <DoctorEarnings />
              </ProtectedRoute>
            } />
            <Route path="/doctor/dashboard" element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </motion.div>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;