import React from 'react';
import {
  Briefcase,
  ClipboardList,
  FileCheck2,
  HelpCircle,
  IndianRupee,
  LayoutDashboard,
  Search,
  UserCircle,
} from 'lucide-react';
import { DashboardLayout, NavItem } from '../../layouts/DashboardLayout';

interface WorkerShellProps {
  pageTitle: string;
  children: React.ReactNode;
}

const workerNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/worker', icon: <LayoutDashboard className="h-4 w-4" />, end: true },
  { label: 'Find Jobs', to: '/worker/jobs', icon: <Search className="h-4 w-4" /> },
  { label: 'My Applications', to: '/worker/applications', icon: <ClipboardList className="h-4 w-4" /> },
  { label: 'Active Work', to: '/worker/active-work', icon: <Briefcase className="h-4 w-4" /> },
  { label: 'Payment History', to: '/worker/payments', icon: <IndianRupee className="h-4 w-4" /> },
  { label: 'My Profile', to: '/worker/profile', icon: <UserCircle className="h-4 w-4" /> },
  { label: 'Help & Support', to: '/worker/support', icon: <HelpCircle className="h-4 w-4" /> },
];

export const WorkerShell: React.FC<WorkerShellProps> = ({ pageTitle, children }) => {
  return (
    <DashboardLayout role="worker" pageTitle={pageTitle} navItems={workerNavItems}>
      {children}
    </DashboardLayout>
  );
};

export { FileCheck2 };
