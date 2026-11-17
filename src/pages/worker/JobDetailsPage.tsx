import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatINR } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { WorkerShell } from './WorkerShell';

export const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { state, currentWorker, applyForJob } = useApp();
  const [applyOpen, setApplyOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');

  const job = state.jobs.find((j) => j.id === jobId);
  const employer = job ? state.employers.find((e) => e.id === job.employerId) : undefined;
  const existingApp =
    job && currentWorker
      ? state.applications.find((a) => a.jobId === job.id && a.workerId === currentWorker.id)
      : undefined;

  if (!job) {
    return (
      <WorkerShell pageTitle="Job Details">
        <EmptyState
          icon={<Building2 className="h-6 w-6" />}
          title="Job listing not found"
          description="This shift may have been removed or closed by the employer."
          actionLabel="Back to Find Jobs"
          onAction={() => window.history.back()}
        />
      </WorkerShell>
    );
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = applyForJob(job.id, coverNote);
    if (ok) {
      setApplyOpen(false);
      setCoverNote('');
    }
  };

  return (
    <WorkerShell pageTitle="Job Details">
      <div className="space-y-6">
        <Link
          to="/worker/jobs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563EB] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Find Jobs
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Job Details */}
          <div className="lg:col-span-8 space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                    <span className="font-medium text-[#0F172A]">{job.employerName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{job.skillCategory}</span>
                    <span aria-hidden="true">·</span>
                    <span>Posted {formatDate(job.createdAt)}</span>
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-bold text-[#172554]">
                    {job.title}
                  </h2>
                </div>
                <StatusBadge status={job.employerVerified ? 'Verified' : 'Unverified'} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-[#64748B]">Wage Rate</p>
                  <p className="mt-1 font-display text-lg font-bold text-[#172554] tabular-nums">
                    {formatINR(job.wageAmount)}
                  </p>
                  <p className="text-[11px] text-[#64748B]">{job.paymentType}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Duration</p>
                  <p className="mt-1 text-sm font-semibold text-[#0F172A] tabular-nums">
                    {job.duration}
                  </p>
                  <p className="text-[11px] text-[#64748B]">Starts {formatDate(job.startDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Working Hours</p>
                  <p className="mt-1 text-sm font-semibold text-[#0F172A]">{job.workingHours}</p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Vacancies</p>
                  <p className="mt-1 text-sm font-semibold text-[#0F172A] tabular-nums">
                    {job.vacancies} {job.vacancies === 1 ? 'worker' : 'workers'}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <h3 className="font-display text-base font-semibold text-[#0F172A]">
                    Job Description
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                    {job.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-base font-semibold text-[#0F172A]">
                    Site Responsibilities
                  </h3>
                  <ul className="mt-2.5 space-y-2">
                    {job.responsibilities.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-base font-semibold text-[#0F172A]">
                    Required Skills & Eligibility
                  </h3>
                  <ul className="mt-2.5 space-y-2">
                    {job.requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Employer Info & Apply CTA */}
          <div className="lg:col-span-4 space-y-5">
            <section className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
              <h3 className="font-display text-base font-semibold text-[#0F172A]">
                Apply for this Role
              </h3>
              {existingApp ? (
                <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#64748B]">Application Status</span>
                    <StatusBadge status={existingApp.status} />
                  </div>
                  <p className="text-xs text-[#64748B]">
                    Submitted on {formatDate(existingApp.appliedAt)}.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setCoverNote(
                      currentWorker
                        ? `Experienced ${job.skillCategory.toLowerCase()} with ${currentWorker.experienceYears} years on site.`
                        : ''
                    );
                    setApplyOpen(true);
                  }}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Apply Now
                </button>
              )}

              <div className="border-t border-slate-100 pt-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Start Date: {formatDate(job.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{job.workingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{job.vacancies} openings</span>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-[#0F172A]">
                  Employer Information
                </h3>
                <StatusBadge status={job.employerVerified ? 'Verified' : 'Unverified'} />
              </div>
              <p className="text-sm font-semibold text-[#172554]">{job.employerName}</p>
              {employer && (
                <div className="space-y-1.5 text-xs text-[#64748B]">
                  <p>Contact: {employer.contactName}</p>
                  <p>Industry: {employer.industry}</p>
                  <p>Location: {employer.location}</p>
                  <p className="font-mono">Reg ID: {employer.registrationNumber}</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <Modal
        isOpen={applyOpen}
        onClose={() => setApplyOpen(false)}
        title="Submit Job Application"
        subtitle={job.title}
      >
        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label htmlFor="detail-cover-note" className="block text-xs font-medium text-slate-700">
              Note to {job.employerName}
            </label>
            <textarea
              id="detail-cover-note"
              rows={4}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setApplyOpen(false)}
              className="min-h-[40px] rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[40px] rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Confirm Application
            </button>
          </div>
        </form>
      </Modal>
    </WorkerShell>
  );
};
