import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, RefreshCw, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { BrandLogo } from '../components/common/BrandLogo';
import { NotificationDropdown } from '../components/common/NotificationDropdown';

export interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  end?: boolean;
}

interface DashboardLayoutProps {
  role: UserRole;
  pageTitle: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  role,
  pageTitle,
  navItems,
  children,
}) => {
  const { state, currentWorker, currentEmployer, logout, resetDemoData } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const roleLabels: Record<UserRole, string> = {
    worker: 'Worker Workspace',
    employer: 'Employer Workspace',
    admin: 'Admin Console',
  };

  const displayName =
    role === 'worker'
      ? currentWorker?.name ?? 'Worker'
      : role === 'employer'
      ? currentEmployer?.companyName ?? 'Employer'
      : state.session?.displayName ?? 'Arvind Nair';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = (
    <div className="flex h-full flex-col bg-[#172554] text-white">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <Link to="/" onClick={() => setSidebarOpen(false)}>
          <BrandLogo light />
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
          className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-5 py-4 border-b border-white/10">
        <p className="text-xs font-medium text-blue-200/80">{roleLabels[role]}</p>
        <p className="mt-0.5 font-display text-sm font-semibold text-white truncate">
          {displayName}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex min-h-[42px] items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-[#2563EB] text-white'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3 space-y-1">
        <button
          type="button"
          onClick={resetDemoData}
          className="flex min-h-[40px] w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <RefreshCw className="h-4 w-4 shrink-0" />
          <span>Reset Demo Data</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-[42px] w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-200 transition-colors hover:bg-red-500/15 hover:text-white"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px]"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-64 max-w-[82vw] h-full shadow-xl">
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:pl-64 min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="text-xs text-[#64748B] truncate">{roleLabels[role]}</p>
              <h1 className="font-display text-base font-semibold text-[#0F172A] truncate sm:text-lg">
                {pageTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/login"
              className="hidden sm:inline-flex min-h-[38px] items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap"
            >
              Switch Role
            </Link>
            <NotificationDropdown />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
