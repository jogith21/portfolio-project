import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, HardHat, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { loginAsDemo, state } = useApp();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('worker');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [error, setError] = useState('');

  const routeByRole: Record<UserRole, string> = {
    worker: '/worker',
    employer: '/employer',
    admin: '/admin',
  };

  const handleQuickDemo = (role: UserRole, userId?: string) => {
    loginAsDemo(role, userId);
    navigate(routeByRole[role]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      setError('Enter any demo phone number or email address to continue.');
      return;
    }
    setError('');
    loginAsDemo(selectedRole);
    navigate(routeByRole[selectedRole]);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-sm font-medium text-[#2563EB]">Demo Access & Role Switcher</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#172554]">
          Sign in to WorkConnect
        </h1>
        <p className="mt-2 text-sm text-[#64748B] sm:text-base">
          Choose a role below for instant demonstration access. All jobs, applications, and payment
          records sync across dashboards via local browser storage.
        </p>
      </div>

      {/* Instant Role Cards */}
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
              <HardHat className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold text-[#0F172A]">
              Worker Demo
            </h2>
            <p className="mt-1 text-xs font-medium text-[#64748B]">
              {state.workers[0]?.name} · {state.workers[0]?.skills.join(', ')}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
              Search nearby daily-wage jobs, submit applications, confirm completed shifts, and
              review your wage ledger.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemo('worker', state.workers[0]?.id)}
            className="mt-6 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Enter Worker Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#172554]/10 text-[#172554]">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold text-[#0F172A]">
              Employer Demo
            </h2>
            <p className="mt-1 text-xs font-medium text-[#64748B]">
              {state.employers[0]?.companyName}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
              Post new jobs, shortlist or accept applicants, find local tradespeople, and record
              wage settlements.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemo('employer', state.employers[0]?.id)}
            className="mt-6 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-[#172554] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1e3a8a]"
          >
            Enter Employer Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold text-[#0F172A]">
              Admin Demo
            </h2>
            <p className="mt-1 text-xs font-medium text-[#64748B]">
              Arvind Nair · Platform Operations
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
              Verify employer businesses, moderate reported job listings, resolve complaints, and
              review platform reports.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            className="mt-6 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] transition-colors hover:bg-slate-50"
          >
            Enter Admin Console
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Standard Role Sign-In Form */}
      <div className="mt-10 mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="font-display text-base font-semibold text-[#0F172A]">
          Or continue with credentials
        </h3>
        <p className="mt-1 text-xs text-[#64748B]">
          No external authentication required in demo mode.
        </p>

        <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="login-role" className="block text-xs font-medium text-slate-700">
              Account Role
            </label>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5 rounded-lg bg-slate-100 p-1">
              {(['worker', 'employer', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`min-h-[36px] rounded-md text-xs font-medium capitalize transition-colors ${
                    selectedRole === r
                      ? 'bg-white text-[#172554] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="login-identifier" className="block text-xs font-medium text-slate-700">
              Mobile Number or Work Email
            </label>
            <input
              id="login-identifier"
              type="text"
              value={phoneOrEmail}
              onChange={(e) => {
                setPhoneOrEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder={
                selectedRole === 'worker'
                  ? '+91 98452 11840'
                  : selectedRole === 'employer'
                  ? 'priya@apexbuildcraft.in'
                  : 'ops@workconnect.in'
              }
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none"
            />
            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            className="inline-flex min-h-[42px] w-full items-center justify-center rounded-lg bg-[#172554] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1e3a8a]"
          >
            Continue to {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Workspace
          </button>
        </form>
      </div>
    </div>
  );
};
