import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Flag,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SKILL_CATEGORIES } from '../../data/mockData';
import { ActivityChart } from '../../components/admin/ActivityChart';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminShell } from './AdminShell';

export const AdminOverviewPage: React.FC = () => {
  const { state } = useApp();

  const totalWorkers = state.workers.length;
  const totalEmployers = state.employers.length;
  const verifiedEmployers = state.employers.filter((e) => e.verified).length;
  const activeJobs = state.jobs.filter((j) => j.status === 'Active').length;
  const successfulHires = state.activeWork.length;
  const reportedListings = state.jobs.filter((j) => j.reported && j.status === 'Active').length;
  const pendingComplaints = state.complaints.filter(
    (c) => c.status === 'Open' || c.status === 'Investigating'
  ).length;

  const categoryStats = SKILL_CATEGORIES.map((cat) => ({
    label: cat,
    count: state.jobs.filter((j) => j.skillCategory === cat).length,
  }));

  const weeklyActivity = [
    { day: 'Mon', applications: 12, hires: 4 },
    { day: 'Tue', applications: 18, hires: 6 },
    { day: 'Wed', applications: 15, hires: 5 },
    { day: 'Thu', applications: 22, hires: 8 },
    { day: 'Fri', applications: 26, hires: 9 },
    { day: 'Sat', applications: 19, hires: 7 },
    { day: 'Sun', applications: Math.max(8, state.applications.length * 3), hires: Math.max(3, state.activeWork.length * 2) },
  ];

  const pendingVerifications = state.verificationRequests.filter((v) => v.status === 'Pending');

  return (
    <AdminShell pageTitle="Overview">
      <div className="space-y-6">
        {/* 7 Required Platform KPIs */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Workers"
            value={totalWorkers}
            sublabel={`${state.workers.filter((w) => w.accountStatus === 'Active').length} active profiles`}
            icon={<Users className="h-5 w-5" />}
            accent="blue"
          />
          <StatCard
            label="Total Employers"
            value={totalEmployers}
            sublabel="Registered contractors & SMEs"
            icon={<Building2 className="h-5 w-5" />}
            accent="navy"
          />
          <StatCard
            label="Verified Employers"
            value={verifiedEmployers}
            sublabel={`${Math.round((verifiedEmployers / Math.max(1, totalEmployers)) * 100)}% verified rate`}
            icon={<ShieldCheck className="h-5 w-5" />}
            accent="emerald"
          />
          <StatCard
            label="Active Jobs"
            value={activeJobs}
            sublabel={`${state.jobs.length} total listings`}
            icon={<Briefcase className="h-5 w-5" />}
            accent="blue"
          />
          <StatCard
            label="Successful Hires"
            value={successfulHires}
            sublabel="Active & completed contracts"
            icon={<CheckCircle2 className="h-5 w-5" />}
            accent="emerald"
          />
          <StatCard
            label="Reported Listings"
            value={reportedListings}
            sublabel="Flagged for review"
            icon={<Flag className="h-5 w-5" />}
            accent="red"
          />
          <StatCard
            label="Pending Complaints"
            value={pendingComplaints}
            sublabel="Open support & disputes"
            icon={<AlertTriangle className="h-5 w-5" />}
            accent="amber"
          />
        </section>

        {/* Platform Activity Charts */}
        <ActivityChart categoryStats={categoryStats} weeklyActivity={weeklyActivity} />

        {/* Action Queues */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-[#0F172A]">
                Pending Verification Requests
              </h3>
              <Link
                to="/admin/verification"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
              >
                Review queue
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {pendingVerifications.length === 0 ? (
                <p className="py-6 text-center text-xs text-[#64748B]">
                  All employer verification requests are processed.
                </p>
              ) : (
                pendingVerifications.map((req) => (
                  <div key={req.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">
                        {req.companyName}
                      </p>
                      <p className="text-xs text-[#64748B] font-mono truncate">
                        {req.documentType} · {req.documentNumber}
                      </p>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-base font-semibold text-[#0F172A]">
                Recent Complaints & Moderation
              </h3>
              <Link
                to="/admin/complaints"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
              >
                Manage complaints
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {state.complaints.slice(0, 4).map((cmp) => (
                <div key={cmp.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0F172A] truncate">{cmp.subject}</p>
                    <p className="text-xs text-[#64748B] truncate">
                      {cmp.reporterName} ({cmp.reporterRole}) · {cmp.category}
                    </p>
                  </div>
                  <StatusBadge status={cmp.status} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
};
