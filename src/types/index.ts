export type UserRole = 'worker' | 'employer' | 'admin';

export type SkillCategory =
  | 'Electrician'
  | 'Plumber'
  | 'Painter'
  | 'Construction'
  | 'Carpenter'
  | 'Cleaner';

export type JobPaymentType = 'Daily Wage' | 'Fixed Payment';

export type JobStatus = 'Active' | 'Paused' | 'Closed' | 'Deactivated';

export type ApplicationStatus = 'Pending' | 'Shortlisted' | 'Accepted' | 'Rejected';

export type WorkStatus = 'In Progress' | 'Awaiting Confirmation' | 'Completed';

export type PaymentStatus = 'Pending' | 'Partial' | 'Paid';

export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected';

export type ComplaintStatus = 'Open' | 'Investigating' | 'Resolved' | 'Dismissed';

export type AccountStatus = 'Active' | 'Suspended';

export interface WorkerProfile {
  id: string;
  name: string;
  phone: string;
  location: string;
  avatarUrl: string;
  skills: SkillCategory[];
  experienceYears: number;
  expectedDailyWage: number;
  availability: 'Available Immediately' | 'Available Next Week' | 'Currently Busy';
  preferredLanguage: string;
  bio: string;
  workHistory: string[];
  completedJobsCount: number;
  rating: number;
  accountStatus: AccountStatus;
  joinedAt: string;
}

export interface EmployerProfile {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  location: string;
  industry: string;
  registrationNumber: string;
  avatarUrl: string;
  verified: boolean;
  verificationStatus: VerificationStatus;
  accountStatus: AccountStatus;
  joinedAt: string;
}

export interface JobListing {
  id: string;
  employerId: string;
  employerName: string;
  employerVerified: boolean;
  title: string;
  description: string;
  skillCategory: SkillCategory;
  location: string;
  paymentType: JobPaymentType;
  wageAmount: number;
  workingHours: string;
  startDate: string;
  duration: string;
  vacancies: number;
  requirements: string[];
  responsibilities: string[];
  status: JobStatus;
  reported: boolean;
  reportReason?: string;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  employerId: string;
  status: ApplicationStatus;
  coverNote: string;
  appliedAt: string;
  updatedAt: string;
}

export interface ActiveWorkRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  workerId: string;
  workerName: string;
  employerId: string;
  employerName: string;
  employerPhone: string;
  location: string;
  agreedWage: number;
  paymentType: JobPaymentType;
  startDate: string;
  endDate: string;
  duration: string;
  status: WorkStatus;
  workerConfirmed: boolean;
  employerConfirmed: boolean;
}

export interface PaymentRecord {
  id: string;
  activeWorkId: string;
  jobId: string;
  jobTitle: string;
  workerId: string;
  workerName: string;
  employerId: string;
  employerName: string;
  agreedAmount: number;
  amountPaid: number;
  outstandingAmount: number;
  paymentDate: string;
  paymentStatus: PaymentStatus;
  workerAcknowledged: boolean;
  referenceNote: string;
}

export interface VerificationRequest {
  id: string;
  employerId: string;
  companyName: string;
  contactName: string;
  location: string;
  documentType: string;
  documentNumber: string;
  submittedAt: string;
  status: VerificationStatus;
  adminNote?: string;
}

export interface ComplaintRecord {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterRole: 'worker' | 'employer';
  subject: string;
  category: 'Payment Dispute' | 'Job Listing Issue' | 'Safety Concern' | 'Account Support';
  description: string;
  relatedJobTitle?: string;
  status: ComplaintStatus;
  createdAt: string;
  resolutionNote?: string;
}

export interface AppNotification {
  id: string;
  targetRole: UserRole;
  targetUserId?: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

export interface PlatformSettings {
  minDailyWageThreshold: number;
  requireEmployerVerificationForPosting: boolean;
  autoFlagDuplicateListings: boolean;
  supportHelpline: string;
  maintenanceMode: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}

export interface AuthSession {
  role: UserRole;
  userId: string;
  displayName: string;
}

export interface WorkConnectState {
  session: AuthSession | null;
  workers: WorkerProfile[];
  employers: EmployerProfile[];
  jobs: JobListing[];
  applications: JobApplication[];
  activeWork: ActiveWorkRecord[];
  payments: PaymentRecord[];
  verificationRequests: VerificationRequest[];
  complaints: ComplaintRecord[];
  notifications: AppNotification[];
  settings: PlatformSettings;
}
