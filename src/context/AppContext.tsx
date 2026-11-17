import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { storageService } from '../services/storageService';
import {
  AccountStatus,
  ActiveWorkRecord,
  AppNotification,
  ApplicationStatus,
  ComplaintRecord,
  ComplaintStatus,
  EmployerProfile,
  JobApplication,
  JobListing,
  JobStatus,
  PaymentRecord,
  PlatformSettings,
  ToastMessage,
  UserRole,
  WorkConnectState,
  WorkerProfile,
} from '../types';
import { addDaysToIsoDate, extractDaysFromDuration } from '../utils/formatters';

interface AppContextValue {
  state: WorkConnectState;
  currentWorker: WorkerProfile | null;
  currentEmployer: EmployerProfile | null;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
  loginAsDemo: (role: UserRole, specificUserId?: string) => void;
  logout: () => void;
  resetDemoData: () => void;

  // Worker actions
  applyForJob: (jobId: string, coverNote: string) => boolean;
  updateWorkerProfile: (updates: Partial<WorkerProfile>) => void;
  confirmWorkCompletionByWorker: (activeWorkId: string) => void;
  acknowledgePaymentByWorker: (paymentId: string) => void;
  submitSupportComplaint: (payload: {
    subject: string;
    category: ComplaintRecord['category'];
    description: string;
    relatedJobTitle?: string;
  }) => void;

  // Employer actions
  postJob: (jobInput: Omit<JobListing, 'id' | 'employerId' | 'employerName' | 'employerVerified' | 'status' | 'reported' | 'createdAt'>) => JobListing | null;
  updateJob: (jobId: string, updates: Partial<JobListing>) => void;
  deleteJob: (jobId: string) => void;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => void;
  confirmWorkCompletionByEmployer: (activeWorkId: string) => void;
  recordPayment: (
    paymentId: string,
    payload: { amountPaid: number; paymentDate: string; referenceNote: string }
  ) => void;
  updateEmployerProfile: (updates: Partial<EmployerProfile>) => void;
  requestEmployerVerification: (documentType: string, documentNumber: string) => void;
  contactWorkerInquiry: (workerId: string, message: string) => void;

  // Admin actions
  setWorkerAccountStatus: (workerId: string, status: AccountStatus) => void;
  setEmployerAccountStatus: (employerId: string, status: AccountStatus) => void;
  reviewVerificationRequest: (requestId: string, decision: 'Verified' | 'Rejected', adminNote: string) => void;
  moderateJobListing: (jobId: string, status: JobStatus) => void;
  updateComplaintStatus: (complaintId: string, status: ComplaintStatus, resolutionNote: string) => void;
  updatePlatformSettings: (updates: Partial<PlatformSettings>) => void;

  // Notifications
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WorkConnectState>(() => storageService.loadState());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    storageService.saveState(state);
  }, [state]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { ...toast, id }]);
      window.setTimeout(() => {
        dismissToast(id);
      }, 4200);
    },
    [dismissToast]
  );

  const pushNotification = (
    notifications: AppNotification[],
    notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>
  ): AppNotification[] => {
    const entry: AppNotification = {
      ...notification,
      id: `not-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: 'Just now',
      read: false,
    };
    return [entry, ...notifications];
  };

  const loginAsDemo = useCallback(
    (role: UserRole, specificUserId?: string) => {
      setState((prev) => {
        if (role === 'worker') {
          const worker =
            prev.workers.find((w) => w.id === specificUserId) ?? prev.workers[0];
          return {
            ...prev,
            session: {
              role: 'worker',
              userId: worker.id,
              displayName: worker.name,
            },
          };
        }
        if (role === 'employer') {
          const employer =
            prev.employers.find((e) => e.id === specificUserId) ?? prev.employers[0];
          return {
            ...prev,
            session: {
              role: 'employer',
              userId: employer.id,
              displayName: employer.contactName,
            },
          };
        }
        return {
          ...prev,
          session: {
            role: 'admin',
            userId: 'adm-1',
            displayName: 'Arvind Nair',
          },
        };
      });
      const roleLabels: Record<UserRole, string> = {
        worker: 'Worker',
        employer: 'Employer',
        admin: 'Admin',
      };
      addToast({
        type: 'success',
        title: `Signed in as ${roleLabels[role]}`,
        description: 'Demo workspace loaded with live local persistence.',
      });
    },
    [addToast]
  );

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, session: null }));
    addToast({
      type: 'info',
      title: 'Signed out',
      description: 'You have returned to the public site.',
    });
  }, [addToast]);

  const resetDemoData = useCallback(() => {
    const fresh = storageService.resetDemoData();
    setState((prev) => ({ ...fresh, session: prev.session }));
    addToast({
      type: 'info',
      title: 'Demo data restored',
      description: 'All sample jobs, applications, and payments were reset.',
    });
  }, [addToast]);

  const currentWorker = useMemo(() => {
    if (state.session?.role !== 'worker') return null;
    return state.workers.find((w) => w.id === state.session?.userId) ?? state.workers[0] ?? null;
  }, [state.session, state.workers]);

  const currentEmployer = useMemo(() => {
    if (state.session?.role !== 'employer') return null;
    return (
      state.employers.find((e) => e.id === state.session?.userId) ?? state.employers[0] ?? null
    );
  }, [state.session, state.employers]);

  const applyForJob = useCallback(
    (jobId: string, coverNote: string): boolean => {
      if (!currentWorker) {
        addToast({
          type: 'warning',
          title: 'Sign in as a Worker',
          description: 'Use Worker demo access to submit job applications.',
        });
        return false;
      }
      const existing = state.applications.find(
        (a) => a.jobId === jobId && a.workerId === currentWorker.id
      );
      if (existing) {
        addToast({
          type: 'info',
          title: 'Already applied',
          description: 'You have already submitted an application for this job.',
        });
        return false;
      }
      const job = state.jobs.find((j) => j.id === jobId);
      if (!job) return false;

      const today = new Date().toISOString().split('T')[0];
      const newApp: JobApplication = {
        id: `app-${Date.now()}`,
        jobId: job.id,
        workerId: currentWorker.id,
        employerId: job.employerId,
        status: 'Pending',
        coverNote: coverNote.trim() || `Available to start on ${job.startDate}.`,
        appliedAt: today,
        updatedAt: today,
      };

      setState((prev) => ({
        ...prev,
        applications: [newApp, ...prev.applications],
        notifications: pushNotification(prev.notifications, {
          targetRole: 'employer',
          targetUserId: job.employerId,
          title: 'New Application Received',
          message: `${currentWorker.name} applied for ${job.title}.`,
          link: '/employer/applications',
        }),
      }));

      addToast({
        type: 'success',
        title: 'Application submitted',
        description: `Sent to ${job.employerName}. Track status under My Applications.`,
      });
      return true;
    },
    [currentWorker, state.applications, state.jobs, addToast]
  );

  const updateWorkerProfile = useCallback(
    (updates: Partial<WorkerProfile>) => {
      if (!currentWorker) return;
      setState((prev) => ({
        ...prev,
        workers: prev.workers.map((w) =>
          w.id === currentWorker.id ? { ...w, ...updates } : w
        ),
        session:
          updates.name && prev.session?.role === 'worker'
            ? { ...prev.session, displayName: updates.name }
            : prev.session,
      }));
      addToast({
        type: 'success',
        title: 'Profile updated',
        description: 'Your worker profile changes are saved.',
      });
    },
    [currentWorker, addToast]
  );

  const confirmWorkCompletionByWorker = useCallback(
    (activeWorkId: string) => {
      setState((prev) => {
        const target = prev.activeWork.find((a) => a.id === activeWorkId);
        if (!target) return prev;
        const completedNow = target.employerConfirmed;
        return {
          ...prev,
          activeWork: prev.activeWork.map((item) =>
            item.id === activeWorkId
              ? {
                  ...item,
                  workerConfirmed: true,
                  status: completedNow ? 'Completed' : 'Awaiting Confirmation',
                }
              : item
          ),
          notifications: pushNotification(prev.notifications, {
            targetRole: 'employer',
            targetUserId: target.employerId,
            title: 'Work Completion Confirmed',
            message: `${target.workerName} confirmed completion for ${target.jobTitle}.`,
            link: '/employer/active-workers',
          }),
        };
      });
      addToast({
        type: 'success',
        title: 'Completion recorded',
        description: 'Employer has been notified to finalize completion.',
      });
    },
    [addToast]
  );

  const acknowledgePaymentByWorker = useCallback(
    (paymentId: string) => {
      setState((prev) => ({
        ...prev,
        payments: prev.payments.map((p) =>
          p.id === paymentId ? { ...p, workerAcknowledged: true } : p
        ),
      }));
      addToast({
        type: 'success',
        title: 'Payment acknowledged',
        description: 'Payment record has been marked as acknowledged by you.',
      });
    },
    [addToast]
  );

  const submitSupportComplaint = useCallback(
    (payload: {
      subject: string;
      category: ComplaintRecord['category'];
      description: string;
      relatedJobTitle?: string;
    }) => {
      const role = state.session?.role === 'employer' ? 'employer' : 'worker';
      const reporterId =
        role === 'employer'
          ? currentEmployer?.id ?? 'emp-1'
          : currentWorker?.id ?? 'wrk-1';
      const reporterName =
        role === 'employer'
          ? currentEmployer?.companyName ?? 'Employer'
          : currentWorker?.name ?? 'Worker';

      const newComplaint: ComplaintRecord = {
        id: `cmp-${Date.now()}`,
        reporterId,
        reporterName,
        reporterRole: role,
        subject: payload.subject,
        category: payload.category,
        description: payload.description,
        relatedJobTitle: payload.relatedJobTitle,
        status: 'Open',
        createdAt: new Date().toISOString().split('T')[0],
      };

      setState((prev) => ({
        ...prev,
        complaints: [newComplaint, ...prev.complaints],
        notifications: pushNotification(prev.notifications, {
          targetRole: 'admin',
          title: 'New Support Complaint',
          message: `${reporterName} reported: ${payload.subject}`,
          link: '/admin/complaints',
        }),
      }));

      addToast({
        type: 'success',
        title: 'Support ticket submitted',
        description: 'Our operations team has logged your request.',
      });
    },
    [state.session, currentEmployer, currentWorker, addToast]
  );

  const postJob = useCallback(
    (
      jobInput: Omit<
        JobListing,
        'id' | 'employerId' | 'employerName' | 'employerVerified' | 'status' | 'reported' | 'createdAt'
      >
    ): JobListing | null => {
      if (!currentEmployer) return null;
      const newJob: JobListing = {
        ...jobInput,
        id: `job-${Date.now()}`,
        employerId: currentEmployer.id,
        employerName: currentEmployer.companyName,
        employerVerified: currentEmployer.verified,
        status: 'Active',
        reported: false,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setState((prev) => ({
        ...prev,
        jobs: [newJob, ...prev.jobs],
        notifications: pushNotification(prev.notifications, {
          targetRole: 'worker',
          title: 'New Job Posted Nearby',
          message: `${currentEmployer.companyName} is hiring for ${newJob.title} (${newJob.location}).`,
          link: `/worker/jobs/${newJob.id}`,
        }),
      }));

      addToast({
        type: 'success',
        title: 'Job published',
        description: 'Your listing is now live in the worker job marketplace.',
      });
      return newJob;
    },
    [currentEmployer, addToast]
  );

  const updateJob = useCallback(
    (jobId: string, updates: Partial<JobListing>) => {
      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.map((j) => (j.id === jobId ? { ...j, ...updates } : j)),
      }));
      addToast({
        type: 'success',
        title: 'Job listing updated',
      });
    },
    [addToast]
  );

  const deleteJob = useCallback(
    (jobId: string) => {
      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.filter((j) => j.id !== jobId),
        applications: prev.applications.filter((a) => a.jobId !== jobId),
      }));
      addToast({
        type: 'info',
        title: 'Job deleted',
        description: 'The job listing has been removed.',
      });
    },
    [addToast]
  );

  const updateApplicationStatus = useCallback(
    (applicationId: string, status: ApplicationStatus) => {
      setState((prev) => {
        const app = prev.applications.find((a) => a.id === applicationId);
        if (!app) return prev;
        const job = prev.jobs.find((j) => j.id === app.jobId);
        const worker = prev.workers.find((w) => w.id === app.workerId);
        const employer = prev.employers.find((e) => e.id === app.employerId);
        const today = new Date().toISOString().split('T')[0];

        const updatedApps = prev.applications.map((a) =>
          a.id === applicationId ? { ...a, status, updatedAt: today } : a
        );

        let updatedActiveWork = prev.activeWork;
        let updatedPayments = prev.payments;

        if (status === 'Accepted' && job && worker && employer) {
          const alreadyActive = prev.activeWork.some(
            (aw) => aw.jobId === job.id && aw.workerId === worker.id
          );
          if (!alreadyActive) {
            const days = extractDaysFromDuration(job.duration);
            const endDate = addDaysToIsoDate(job.startDate, days);
            const activeWorkId = `act-${Date.now()}`;
            const agreedTotal =
              job.paymentType === 'Daily Wage' ? job.wageAmount * days : job.wageAmount;

            const newActive: ActiveWorkRecord = {
              id: activeWorkId,
              jobId: job.id,
              jobTitle: job.title,
              workerId: worker.id,
              workerName: worker.name,
              employerId: employer.id,
              employerName: employer.companyName,
              employerPhone: employer.phone,
              location: job.location,
              agreedWage: job.wageAmount,
              paymentType: job.paymentType,
              startDate: job.startDate,
              endDate,
              duration: job.duration,
              status: 'In Progress',
              workerConfirmed: false,
              employerConfirmed: false,
            };

            const newPayment: PaymentRecord = {
              id: `pay-${Date.now()}`,
              activeWorkId,
              jobId: job.id,
              jobTitle: job.title,
              workerId: worker.id,
              workerName: worker.name,
              employerId: employer.id,
              employerName: employer.companyName,
              agreedAmount: agreedTotal,
              amountPaid: 0,
              outstandingAmount: agreedTotal,
              paymentDate: today,
              paymentStatus: 'Pending',
              workerAcknowledged: false,
              referenceNote: 'Hiring record created upon offer acceptance',
            };

            updatedActiveWork = [newActive, ...prev.activeWork];
            updatedPayments = [newPayment, ...prev.payments];
          }
        }

        const nextNotifications = pushNotification(prev.notifications, {
          targetRole: 'worker',
          targetUserId: app.workerId,
          title: `Application ${status}`,
          message: `Your application for ${job?.title ?? 'a job'} is now ${status}.`,
          link: status === 'Accepted' ? '/worker/active-work' : '/worker/applications',
        });

        return {
          ...prev,
          applications: updatedApps,
          activeWork: updatedActiveWork,
          payments: updatedPayments,
          notifications: nextNotifications,
        };
      });

      addToast({
        type: status === 'Rejected' ? 'info' : 'success',
        title: `Applicant ${status.toLowerCase()}`,
        description:
          status === 'Accepted'
            ? 'Active hiring & payment ledger records were created automatically.'
            : undefined,
      });
    },
    [addToast]
  );

  const confirmWorkCompletionByEmployer = useCallback(
    (activeWorkId: string) => {
      setState((prev) => {
        const target = prev.activeWork.find((a) => a.id === activeWorkId);
        if (!target) return prev;
        return {
          ...prev,
          activeWork: prev.activeWork.map((item) =>
            item.id === activeWorkId
              ? {
                  ...item,
                  employerConfirmed: true,
                  workerConfirmed: true,
                  status: 'Completed',
                }
              : item
          ),
          workers: prev.workers.map((w) =>
            w.id === target.workerId
              ? { ...w, completedJobsCount: w.completedJobsCount + 1 }
              : w
          ),
          notifications: pushNotification(prev.notifications, {
            targetRole: 'worker',
            targetUserId: target.workerId,
            title: 'Job Marked Completed',
            message: `${target.employerName} marked ${target.jobTitle} as Completed.`,
            link: '/worker/payments',
          }),
        };
      });
      addToast({
        type: 'success',
        title: 'Work marked completed',
        description: 'Worker completion record has been updated.',
      });
    },
    [addToast]
  );

  const recordPayment = useCallback(
    (
      paymentId: string,
      payload: { amountPaid: number; paymentDate: string; referenceNote: string }
    ) => {
      setState((prev) => {
        const target = prev.payments.find((p) => p.id === paymentId);
        if (!target) return prev;
        const clampedPaid = Math.max(0, Math.min(payload.amountPaid, target.agreedAmount));
        const outstanding = Math.max(0, target.agreedAmount - clampedPaid);
        const paymentStatus: PaymentRecord['paymentStatus'] =
          outstanding === 0 ? 'Paid' : clampedPaid > 0 ? 'Partial' : 'Pending';

        return {
          ...prev,
          payments: prev.payments.map((p) =>
            p.id === paymentId
              ? {
                  ...p,
                  amountPaid: clampedPaid,
                  outstandingAmount: outstanding,
                  paymentDate: payload.paymentDate,
                  paymentStatus,
                  referenceNote: payload.referenceNote,
                }
              : p
          ),
          notifications: pushNotification(prev.notifications, {
            targetRole: 'worker',
            targetUserId: target.workerId,
            title: 'Payment Record Updated',
            message: `${target.employerName} updated payment status to ${paymentStatus} for ${target.jobTitle}.`,
            link: '/worker/payments',
          }),
        };
      });
      addToast({
        type: 'success',
        title: 'Payment record saved',
        description: 'Ledger balances and acknowledgement status updated.',
      });
    },
    [addToast]
  );

  const updateEmployerProfile = useCallback(
    (updates: Partial<EmployerProfile>) => {
      if (!currentEmployer) return;
      setState((prev) => ({
        ...prev,
        employers: prev.employers.map((e) =>
          e.id === currentEmployer.id ? { ...e, ...updates } : e
        ),
        jobs: updates.companyName
          ? prev.jobs.map((j) =>
              j.employerId === currentEmployer.id
                ? { ...j, employerName: updates.companyName! }
                : j
            )
          : prev.jobs,
        session:
          updates.contactName && prev.session?.role === 'employer'
            ? { ...prev.session, displayName: updates.contactName }
            : prev.session,
      }));
      addToast({
        type: 'success',
        title: 'Employer profile updated',
      });
    },
    [currentEmployer, addToast]
  );

  const requestEmployerVerification = useCallback(
    (documentType: string, documentNumber: string) => {
      if (!currentEmployer) return;
      setState((prev) => ({
        ...prev,
        employers: prev.employers.map((e) =>
          e.id === currentEmployer.id
            ? { ...e, verificationStatus: 'Pending', registrationNumber: documentNumber }
            : e
        ),
        verificationRequests: [
          {
            id: `ver-${Date.now()}`,
            employerId: currentEmployer.id,
            companyName: currentEmployer.companyName,
            contactName: currentEmployer.contactName,
            location: currentEmployer.location,
            documentType,
            documentNumber,
            submittedAt: new Date().toISOString().split('T')[0],
            status: 'Pending',
          },
          ...prev.verificationRequests.filter((v) => v.employerId !== currentEmployer.id),
        ],
        notifications: pushNotification(prev.notifications, {
          targetRole: 'admin',
          title: 'Employer Verification Submitted',
          message: `${currentEmployer.companyName} submitted ${documentType} for review.`,
          link: '/admin/verification',
        }),
      }));
      addToast({
        type: 'success',
        title: 'Verification request submitted',
        description: 'Admins will review your business registration details.',
      });
    },
    [currentEmployer, addToast]
  );

  const contactWorkerInquiry = useCallback(
    (workerId: string, message: string) => {
      const worker = state.workers.find((w) => w.id === workerId);
      if (!worker || !currentEmployer) return;
      setState((prev) => ({
        ...prev,
        notifications: pushNotification(prev.notifications, {
          targetRole: 'worker',
          targetUserId: workerId,
          title: 'Work Inquiry from Employer',
          message: `${currentEmployer.companyName}: "${message}"`,
          link: '/worker/jobs',
        }),
      }));
      addToast({
        type: 'success',
        title: `Message sent to ${worker.name}`,
        description: 'The worker received your direct job inquiry.',
      });
    },
    [state.workers, currentEmployer, addToast]
  );

  const setWorkerAccountStatus = useCallback(
    (workerId: string, status: AccountStatus) => {
      setState((prev) => ({
        ...prev,
        workers: prev.workers.map((w) =>
          w.id === workerId ? { ...w, accountStatus: status } : w
        ),
      }));
      addToast({
        type: 'info',
        title: `Worker account ${status.toLowerCase()}`,
      });
    },
    [addToast]
  );

  const setEmployerAccountStatus = useCallback(
    (employerId: string, status: AccountStatus) => {
      setState((prev) => ({
        ...prev,
        employers: prev.employers.map((e) =>
          e.id === employerId ? { ...e, accountStatus: status } : e
        ),
      }));
      addToast({
        type: 'info',
        title: `Employer account ${status.toLowerCase()}`,
      });
    },
    [addToast]
  );

  const reviewVerificationRequest = useCallback(
    (requestId: string, decision: 'Verified' | 'Rejected', adminNote: string) => {
      setState((prev) => {
        const req = prev.verificationRequests.find((r) => r.id === requestId);
        if (!req) return prev;
        const isVerified = decision === 'Verified';
        return {
          ...prev,
          verificationRequests: prev.verificationRequests.map((r) =>
            r.id === requestId ? { ...r, status: decision, adminNote } : r
          ),
          employers: prev.employers.map((e) =>
            e.id === req.employerId
              ? { ...e, verified: isVerified, verificationStatus: decision }
              : e
          ),
          jobs: prev.jobs.map((j) =>
            j.employerId === req.employerId ? { ...j, employerVerified: isVerified } : j
          ),
          notifications: pushNotification(prev.notifications, {
            targetRole: 'employer',
            targetUserId: req.employerId,
            title: `Verification ${decision}`,
            message: isVerified
              ? `${req.companyName} is now a Verified Employer on WorkConnect.`
              : `Verification was not approved: ${adminNote || 'Check submitted details.'}`,
            link: '/employer/profile',
          }),
        };
      });
      addToast({
        type: decision === 'Verified' ? 'success' : 'warning',
        title: `Verification ${decision.toLowerCase()}`,
      });
    },
    [addToast]
  );

  const moderateJobListing = useCallback(
    (jobId: string, status: JobStatus) => {
      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.map((j) =>
          j.id === jobId
            ? { ...j, status, reported: status === 'Active' ? false : j.reported }
            : j
        ),
      }));
      addToast({
        type: status === 'Deactivated' ? 'warning' : 'success',
        title: `Job listing ${status.toLowerCase()}`,
      });
    },
    [addToast]
  );

  const updateComplaintStatus = useCallback(
    (complaintId: string, status: ComplaintStatus, resolutionNote: string) => {
      setState((prev) => ({
        ...prev,
        complaints: prev.complaints.map((c) =>
          c.id === complaintId ? { ...c, status, resolutionNote } : c
        ),
      }));
      addToast({
        type: 'success',
        title: `Complaint marked ${status.toLowerCase()}`,
      });
    },
    [addToast]
  );

  const updatePlatformSettings = useCallback(
    (updates: Partial<PlatformSettings>) => {
      setState((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...updates },
      }));
      addToast({
        type: 'success',
        title: 'Platform settings saved',
      });
    },
    [addToast]
  );

  const markNotificationRead = useCallback((notificationId: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => {
      const role = prev.session?.role;
      return {
        ...prev,
        notifications: prev.notifications.map((n) =>
          !role || n.targetRole === role ? { ...n, read: true } : n
        ),
      };
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        currentWorker,
        currentEmployer,
        toasts,
        addToast,
        dismissToast,
        loginAsDemo,
        logout,
        resetDemoData,
        applyForJob,
        updateWorkerProfile,
        confirmWorkCompletionByWorker,
        acknowledgePaymentByWorker,
        submitSupportComplaint,
        postJob,
        updateJob,
        deleteJob,
        updateApplicationStatus,
        confirmWorkCompletionByEmployer,
        recordPayment,
        updateEmployerProfile,
        requestEmployerVerification,
        contactWorkerInquiry,
        setWorkerAccountStatus,
        setEmployerAccountStatus,
        reviewVerificationRequest,
        moderateJobListing,
        updateComplaintStatus,
        updatePlatformSettings,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
