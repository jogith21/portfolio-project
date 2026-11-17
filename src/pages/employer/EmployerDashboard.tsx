import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  ClipboardCheck,
  FilePlus2,
  ListChecks,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatINR } from '../../utils/formatters';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmployerShell } from './EmployerShell';

export const EmployerDashboard: React.FC = () => {
  const { state, currentEmployer } = useApp();

  if (!currentEmployer) return null;

  const myJobs = state.jobs.filter((j) => j.employerId === currentEmployer.id);
  const activeJobs = myJobs.filter((j) => j.status === 'Active');
  const myApps = state.applications.filter((a) => a.employerId === currentEmployer.id);
  const myHired = state.activeWork.filter((w) => w.employerId === currentEmployer.id);

  return (
    <EmployerShell pageTitle="Employer Dashboard">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-display text-xl font-bold text-[#172554] sm:text-2xl">
                {currentEmployer.companyName}
              </h2>
              <StatusBadge status={currentEmployer.verified ? 'Verified' : currentEmployer.verificationStatus} />
            </div>
            <p className="mt-1 text-sm text-[#64748B]">
              {currentEmployer.contactName} · {currentEmployer.location} · {currentEmployer.industry}
            </p>
          </div>

          <Link
            to="/employer/post-job"
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap self-start sm:self-center"
          >
            <FilePlus2 className="h-4 w-4" />
            Post New Job
          </Link>
        </section>

        {/* KPI Grid */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Jobs Posted"
            value={myJobs.length}
            sublabel="All-time listings"
            icon={<ListChecks className="h-5 w-5" />}
            accent="navy"
          />
          <StatCard
            label="Active Job Listings"
            value={activeJobs.length}
            sublabel="Open for applications"
            icon={<Briefcase className="h-5 w-5" />}
            accent="blue"
          />
          <StatCard
            label="Total Applicants"
            value={myApps.length}
            sublabel={`${myApps.filter((a) => a.status === 'Pending').length} awaiting review`}
            icon={<ClipboardCheck className="h-5 w-5" />}
            accent="amber"
          />
          <StatCard
            label="Workers Hired"
            value={myHired.length}
            sublabel="Active & completed contracts"
            icon={<Users className="h-5 w-5" />}
            accent="emerald"
          />
        </section>

        {/* Recent Applications & Recently Posted Jobs */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[#0F172A]">
                Recent Applications
              </h3>
              <Link
                to="/employer/applications"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
              >
                Review all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
              {myApps.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#64748B]">
                  No applications received yet.
                </div>
              ) : (
                myApps.slice(0, 5).map((app) => {
                  const worker = state.workers.find((w) => w.id === app.workerId);
                  const job = state.jobs.find((j) => j.id === app.jobId);
                  return (
                    <div key={app.id} className="p-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0F172A] truncate">
                          {worker?.name ?? 'Worker'}
                        </p>
                        <p className="text-xs text-[#64748B] truncate">
                          Applied for {job?.title ?? 'Job'} · {formatDate(app.appliedAt)}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[#0F172A]">
                Recently Posted Jobs
              </h3>
              <Link
                to="/employer/manage-jobs"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
              >
                Manage jobs
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
              {myJobs.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#64748B]">
                  No jobs posted yet. Click Post New Job to publish your first shift.
                </div>
              ) : (
                myJobs.slice(0, 5).map((job) => {
                  const appCount = state.applications.filter((a) => a.jobId === job.id).length;
                  return (
                    <div key={job.id} className="p-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0F172A] truncate">{job.title}</p>
                        <p className="text-xs text-[#64748B] tabular-nums">
                          {job.location} · {formatINR(job.wageAmount)} · {appCount} applicants
                        </p>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </EmployerShell>
  );
};
