import React from 'react';
import {
  AlertTriangle,
  BarChart3,
  Building2,
  ClipboardList,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { DashboardLayout, NavItem } from '../../layouts/DashboardLayout';

interface AdminShellProps {
  pageTitle: string;
  children: React.ReactNode;
}

const adminNavItems: NavItem[] = [
  { label: 'Overview', to: '/admin', icon: <LayoutDashboard className="h-4 w-4" />, end: true },
  { label: 'Workers', to: '/admin/workers', icon: <Users className="h-4 w-4" /> },
  { label: 'Employers', to: '/admin/employers', icon: <Building2 className="h-4 w-4" /> },
  { label: 'Employer Verification', to: '/admin/verification', icon: <ShieldCheck className="h-4 w-4" /> },
  { label: 'Job Listings', to: '/admin/jobs', icon: <ClipboardList className="h-4 w-4" /> },
  { label: 'Complaints', to: '/admin/complaints', icon: <AlertTriangle className="h-4 w-4" /> },
  { label: 'Reports', to: '/admin/reports', icon: <BarChart3 className="h-4 w-4" /> },
  { label: 'Settings', to: '/admin/settings', icon: <Settings className="h-4 w-4" /> },
];

export const AdminShell: React.FC<AdminShellProps> = ({ pageTitle, children }) => {
  return (
    <DashboardLayout role="admin" pageTitle={pageTitle} navItems={adminNavItems}>
      {children}
    </DashboardLayout>
  );
};
