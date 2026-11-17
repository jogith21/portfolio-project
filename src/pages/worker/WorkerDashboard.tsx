import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  IndianRupee,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { JobListing } from '../../types';
import {
  calculateWorkerProfileCompletion,
  formatDate,
  formatINR,
} from '../../utils/formatters';
import { Modal } from '../../components/common/Modal';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { JobCard } from '../../components/worker/JobCard';
import { WorkerShell } from './WorkerShell';

export const WorkerDashboard: React.FC = () => {
  const { state, currentWorker, applyForJob } = useApp();
  const [applyModalJob, setApplyModalJob] = useState<JobListing | null>(null);
  const [coverNote, setCoverNote] = useState('');

  if (!currentWorker) return null;

  const profilePct = calculateWorkerProfileCompletion(currentWorker);

  const myApplications = state.applications.filter((a) => a.workerId === currentWorker.id);
  const myActiveWork = state.activeWork.filter(
    (w) => w.workerId === currentWorker.id && w.status !== 'Completed'
  );
  const myCompletedWork = state.activeWork.filter(
    (w) => w.workerId === currentWorker.id && w.status === 'Completed'
  );
  const myPayments = state.payments.filter((p) => p.workerId === currentWorker.id);
  const totalEarnings = myPayments.reduce((sum, p) => sum + p.amountPaid, 0);

  const appliedJobIds = new Set(myApplications.map((a) => a.jobId));

  const recommendedJobs = state.jobs
    .filter((j) => j.status === 'Active')
    .sort((a, b) => {
      const aMatch =
        (a.location === currentWorker.location ? 2 : 0) +
        (currentWorker.skills.includes(a.skillCategory) ? 2 : 0);
      const bMatch =
        (b.location === currentWorker.location ? 2 : 0) +
        (currentWorker.skills.includes(b.skillCategory) ? 2 : 0);
      return bMatch - aMatch;
    })
    .slice(0, 4);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalJob) return;
    const ok = applyForJob(applyModalJob.id, coverNote);
    if (ok) {
      setApplyModalJob(null);
      setCoverNote('');
    }
  };

  return (
    <WorkerShell pageTitle="Worker Dashboard">
      <div className="space-y-6">
        {/* Welcome & Profile Completion */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-[#172554] sm:text-2xl">
                Welcome back, {currentWorker.name}
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                {currentWorker.skills.join(' · ')} · {currentWorker.location} · Expected{' '}
                <span className="font-mono font-medium text-[#0F172A] tabular-nums">
                  {formatINR(currentWorker.expectedDailyWage)}/day
                </span>
              </p>
            </div>

            <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-[#F8FAFC] p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#0F172A] inline-flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-[#2563EB]" />
                  Profile Completion
                </span>
                <span className="font-mono font-semibold text-[#172554] tabular-nums">
                  {profilePct}%
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#10B981] transition-all"
                  style={{ width: `${profilePct}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-[#64748B]">
                  {profilePct === 100 ? 'Profile ready for top hires' : 'Add details to stand out'}
                </span>
                <Link to="/worker/profile" className="font-medium text-[#2563EB] hover:underline">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Applications"
            value={myApplications.length}
            sublabel={`${myApplications.filter((a) => a.status === 'Shortlisted').length} shortlisted`}
            icon={<ClipboardList className="h-5 w-5" />}
            accent="blue"
          />
          <StatCard
            label="Active Jobs"
            value={myActiveWork.length}
            sublabel="Current site assignments"
            icon={<Briefcase className="h-5 w-5" />}
            accent="navy"
          />
          <StatCard
            label="Completed Jobs"
            value={myCompletedWork.length + currentWorker.completedJobsCount}
            sublabel="Verified shift history"
            icon={<CheckCircle2 className="h-5 w-5" />}
            accent="emerald"
          />
          <StatCard
            label="Total Earnings Recorded"
            value={formatINR(totalEarnings)}
            sublabel="Logged in payment ledger"
            icon={<IndianRupee className="h-5 w-5" />}
            accent="emerald"
          />
        </section>

        {/* Recommended Nearby Jobs & Recent Application Updates */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <section className="xl:col-span-8 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg font-semibold text-[#0F172A]">
                Recommended Nearby Jobs
              </h3>
              <Link
                to="/worker/jobs"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
              >
                Explore all jobs
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {recommendedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  hasApplied={appliedJobIds.has(job.id)}
                  onApplyClick={(j) => {
                    setApplyModalJob(j);
                    setCoverNote(
                      `Experienced ${j.skillCategory.toLowerCase()} with ${currentWorker.experienceYears} years on similar sites.`
                    );
                  }}
                />
              ))}
            </div>
          </section>

          <section className="xl:col-span-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg font-semibold text-[#0F172A]">
                Recent Application Updates
              </h3>
              <Link
                to="/worker/applications"
                className="text-xs font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
              >
                View all
              </Link>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
              {myApplications.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#64748B]">
                  No applications submitted yet. Browse open shifts to apply.
                </div>
              ) : (
                myApplications.slice(0, 5).map((app) => {
                  const job = state.jobs.find((j) => j.id === app.jobId);
                  return (
                    <div key={app.id} className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#0F172A] truncate">
                            {job?.title ?? 'Job Assignment'}
                          </p>
                          <p className="mt-0.5 text-xs text-[#64748B] truncate">
                            {job?.employerName ?? 'Employer'} · Updated {formatDate(app.updatedAt)}
                          </p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>

      <Modal
        isOpen={Boolean(applyModalJob)}
        onClose={() => setApplyModalJob(null)}
        title="Apply for Shift"
        subtitle={applyModalJob ? `${applyModalJob.title} · ${applyModalJob.employerName}` : undefined}
      >
        {applyModalJob && (
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-3.5 text-xs text-slate-600 space-y-1">
              <p>
                <span className="font-medium text-[#0F172A]">Location:</span> {applyModalJob.location}
              </p>
              <p>
                <span className="font-medium text-[#0F172A]">Compensation:</span>{' '}
                {formatINR(applyModalJob.wageAmount)}{' '}
                {applyModalJob.paymentType === 'Daily Wage' ? '/ day' : 'fixed'} ({applyModalJob.duration})
              </p>
            </div>
            <div>
              <label htmlFor="dash-cover-note" className="block text-xs font-medium text-slate-700">
                Note to Employer (Experience & Availability)
              </label>
              <textarea
                id="dash-cover-note"
                rows={3}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
                placeholder="Share relevant site experience and start date..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setApplyModalJob(null)}
                className="min-h-[40px] rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[40px] rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Submit Application
              </button>
            </div>
          </form>
        )}
      </Modal>
    </WorkerShell>
  );
};
