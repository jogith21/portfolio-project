import React from 'react';
import {
  Briefcase,
  Building2,
  ClipboardCheck,
  FilePlus2,
  IndianRupee,
  LayoutDashboard,
  ListChecks,
  Users,
} from 'lucide-react';
import { DashboardLayout, NavItem } from '../../layouts/DashboardLayout';

interface EmployerShellProps {
  pageTitle: string;
  children: React.ReactNode;
}

const employerNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/employer', icon: <LayoutDashboard className="h-4 w-4" />, end: true },
  { label: 'Post a Job', to: '/employer/post-job', icon: <FilePlus2 className="h-4 w-4" /> },
  { label: 'Manage Jobs', to: '/employer/manage-jobs', icon: <ListChecks className="h-4 w-4" /> },
  { label: 'Find Workers', to: '/employer/find-workers', icon: <Users className="h-4 w-4" /> },
  { label: 'Applications', to: '/employer/applications', icon: <ClipboardCheck className="h-4 w-4" /> },
  { label: 'Active Workers', to: '/employer/active-workers', icon: <Briefcase className="h-4 w-4" /> },
  { label: 'Payment Records', to: '/employer/payments', icon: <IndianRupee className="h-4 w-4" /> },
  { label: 'Employer Profile', to: '/employer/profile', icon: <Building2 className="h-4 w-4" /> },
];

export const EmployerShell: React.FC<EmployerShellProps> = ({ pageTitle, children }) => {
  return (
    <DashboardLayout role="employer" pageTitle={pageTitle} navItems={employerNavItems}>
      {children}
    </DashboardLayout>
  );
};
