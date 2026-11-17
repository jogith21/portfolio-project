import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { UserRole } from './types';
import { ToastContainer } from './components/common/ToastContainer';
import { PublicLayout } from './layouts/PublicLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { InfoPage } from './pages/public/InfoPage';

// Worker Pages
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { FindJobsPage } from './pages/worker/FindJobsPage';
import { JobDetailsPage } from './pages/worker/JobDetailsPage';
import { MyApplicationsPage } from './pages/worker/MyApplicationsPage';
import { ActiveWorkPage } from './pages/worker/ActiveWorkPage';
import { WorkerPaymentHistoryPage } from './pages/worker/WorkerPaymentHistoryPage';
import { WorkerProfilePage } from './pages/worker/WorkerProfilePage';
import { HelpSupportPage } from './pages/worker/HelpSupportPage';

// Employer Pages
import { EmployerDashboard } from './pages/employer/EmployerDashboard';
import { PostJobPage } from './pages/employer/PostJobPage';
import { ManageJobsPage } from './pages/employer/ManageJobsPage';
import { FindWorkersPage } from './pages/employer/FindWorkersPage';
import { EmployerApplicationsPage } from './pages/employer/EmployerApplicationsPage';
import { ActiveWorkersPage } from './pages/employer/ActiveWorkersPage';
import { EmployerPaymentRecordsPage } from './pages/employer/EmployerPaymentRecordsPage';
import { EmployerProfilePage } from './pages/employer/EmployerProfilePage';

// Admin Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminWorkersPage } from './pages/admin/AdminWorkersPage';
import { AdminEmployersPage } from './pages/admin/AdminEmployersPage';
import { AdminVerificationPage } from './pages/admin/AdminVerificationPage';
import { AdminJobsPage } from './pages/admin/AdminJobsPage';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

const RoleGuard: React.FC<{ allowedRole: UserRole; children: React.ReactNode }> = ({
  allowedRole,
  children,
}) => {
  const { state } = useApp();
  if (!state.session) {
    return <Navigate to="/login" replace />;
  }
  if (state.session.role !== allowedRole) {
    const redirectMap: Record<UserRole, string> = {
      worker: '/worker',
      employer: '/employer',
      admin: '/admin',
    };
    return <Navigate to={redirectMap[state.session.role]} replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <LandingPage />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout>
                <LoginPage />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <InfoPage section="about" />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <InfoPage section="contact" />
              </PublicLayout>
            }
          />
          <Route
            path="/privacy"
            element={
              <PublicLayout>
                <InfoPage section="privacy" />
              </PublicLayout>
            }
          />
          <Route
            path="/terms"
            element={
              <PublicLayout>
                <InfoPage section="terms" />
              </PublicLayout>
            }
          />

          {/* Worker Routes */}
          <Route
            path="/worker"
            element={
              <RoleGuard allowedRole="worker">
                <WorkerDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/worker/jobs"
            element={
              <RoleGuard allowedRole="worker">
                <FindJobsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/worker/jobs/:jobId"
            element={
              <RoleGuard allowedRole="worker">
                <JobDetailsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/worker/applications"
            element={
              <RoleGuard allowedRole="worker">
                <MyApplicationsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/worker/active-work"
            element={
              <RoleGuard allowedRole="worker">
                <ActiveWorkPage />
              </RoleGuard>
            }
          />
          <Route
            path="/worker/payments"
            element={
              <RoleGuard allowedRole="worker">
                <WorkerPaymentHistoryPage />
              </RoleGuard>
            }
          />
          <Route
            path="/worker/profile"
            element={
              <RoleGuard allowedRole="worker">
                <WorkerProfilePage />
              </RoleGuard>
            }
          />
          <Route
            path="/worker/support"
            element={
              <RoleGuard allowedRole="worker">
                <HelpSupportPage />
              </RoleGuard>
            }
          />

          {/* Employer Routes */}
          <Route
            path="/employer"
            element={
              <RoleGuard allowedRole="employer">
                <EmployerDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/employer/post-job"
            element={
              <RoleGuard allowedRole="employer">
                <PostJobPage />
              </RoleGuard>
            }
          />
          <Route
            path="/employer/manage-jobs"
            element={
              <RoleGuard allowedRole="employer">
                <ManageJobsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/employer/find-workers"
            element={
              <RoleGuard allowedRole="employer">
                <FindWorkersPage />
              </RoleGuard>
            }
          />
          <Route
            path="/employer/applications"
            element={
              <RoleGuard allowedRole="employer">
                <EmployerApplicationsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/employer/active-workers"
            element={
              <RoleGuard allowedRole="employer">
                <ActiveWorkersPage />
              </RoleGuard>
            }
          />
          <Route
            path="/employer/payments"
            element={
              <RoleGuard allowedRole="employer">
                <EmployerPaymentRecordsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/employer/profile"
            element={
              <RoleGuard allowedRole="employer">
                <EmployerProfilePage />
              </RoleGuard>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <RoleGuard allowedRole="admin">
                <AdminOverviewPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/workers"
            element={
              <RoleGuard allowedRole="admin">
                <AdminWorkersPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/employers"
            element={
              <RoleGuard allowedRole="admin">
                <AdminEmployersPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/verification"
            element={
              <RoleGuard allowedRole="admin">
                <AdminVerificationPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <RoleGuard allowedRole="admin">
                <AdminJobsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <RoleGuard allowedRole="admin">
                <AdminComplaintsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <RoleGuard allowedRole="admin">
                <AdminReportsPage />
              </RoleGuard>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <RoleGuard allowedRole="admin">
                <AdminSettingsPage />
              </RoleGuard>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}
