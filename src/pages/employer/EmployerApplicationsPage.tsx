import React, { useState } from 'react';
import { Check, ClipboardCheck, Eye, Star, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../hooks/useConfirm';
import { ApplicationStatus, WorkerProfile } from '../../types';
import { formatDate, formatINR } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { SafeImage } from '../../components/common/SafeImage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmployerShell } from './EmployerShell';

export const EmployerApplicationsPage: React.FC = () => {
  const { state, currentEmployer, updateApplicationStatus } = useApp();
  const { confirmState, requestConfirm, closeConfirm, handleConfirm } = useConfirm();

  const [statusFilter, setStatusFilter] = useState<'All' | ApplicationStatus>('All');
  const [inspectWorker, setInspectWorker] = useState<WorkerProfile | null>(null);

  if (!currentEmployer) return null;

  const myApps = state.applications.filter((a) => a.employerId === currentEmployer.id);
  const filteredApps = myApps.filter((a) =>
    statusFilter === 'All' ? true : a.status === statusFilter
  );

  return (
    <EmployerShell pageTitle="Applications">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
            {(['All', 'Pending', 'Shortlisted', 'Accepted', 'Rejected'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`min-h-[36px] rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  statusFilter === tab
                    ? 'bg-white text-[#172554] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#64748B] tabular-nums">
            {filteredApps.length} {filteredApps.length === 1 ? 'applicant' : 'applicants'}
          </p>
        </div>

        {filteredApps.length === 0 ? (
          <EmptyState
            icon={<ClipboardCheck className="h-6 w-6" />}
            title="No applications in this queue"
            description="Applications submitted by workers for your posted shifts will appear here."
          />
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => {
              const worker = state.workers.find((w) => w.id === app.workerId);
              const job = state.jobs.find((j) => j.id === app.jobId);
              if (!worker || !job) return null;

              return (
                <article
                  key={app.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        {worker.avatarUrl ? (
                          <SafeImage
                            src={worker.avatarUrl}
                            alt={worker.name}
                            className="h-full w-full object-cover"
                            fallbackLabel={worker.name.slice(0, 2)}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-display text-sm font-bold text-[#172554]">
                            {worker.name
                              .split(' ')
                              .map((p) => p[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display text-base font-semibold text-[#0F172A]">
                          {worker.name}
                        </h3>
                        <p className="text-xs text-[#64748B]">
                          {worker.skills.join(' · ')} · {worker.experienceYears} yrs exp ·{' '}
                          {worker.location}
                        </p>
                        <p className="mt-1 text-xs font-medium text-[#172554]">
                          Applied for: {job.title} ({formatINR(job.wageAmount)})
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={app.status} />
                      <span className="text-[11px] text-[#64748B] tabular-nums">
                        Applied {formatDate(app.appliedAt)}
                      </span>
                    </div>
                  </div>

                  <p className="rounded-lg border border-slate-100 bg-[#F8FAFC] p-3 text-xs leading-relaxed text-slate-700">
                    “{app.coverNote}”
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => setInspectWorker(worker)}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Worker Profile
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                      {app.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-100"
                        >
                          <Star className="h-3.5 w-3.5" />
                          Shortlist
                        </button>
                      )}

                      {app.status !== 'Accepted' && app.status !== 'Rejected' && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              requestConfirm({
                                title: 'Accept & Hire Applicant',
                                description: `Hire ${worker.name} for "${job.title}" at ${formatINR(job.wageAmount)}? This creates an active work record and payment ledger.`,
                                confirmLabel: 'Accept & Hire',
                                variant: 'primary',
                                onConfirm: () => updateApplicationStatus(app.id, 'Accepted'),
                              })
                            }
                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#10B981] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Accept
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              requestConfirm({
                                title: 'Reject Application',
                                description: `Decline ${worker.name}'s application for "${job.title}"?`,
                                confirmLabel: 'Reject Application',
                                variant: 'danger',
                                onConfirm: () => updateApplicationStatus(app.id, 'Rejected'),
                              })
                            }
                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                          >
                            <X className="h-3.5 w-3.5" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={Boolean(inspectWorker)}
        onClose={() => setInspectWorker(null)}
        title={inspectWorker?.name ?? 'Worker Profile'}
        subtitle={inspectWorker ? `${inspectWorker.skills.join(' · ')} · ${inspectWorker.location}` : undefined}
      >
        {inspectWorker && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 text-xs">
              <div>
                <p className="text-[#64748B]">Experience</p>
                <p className="mt-0.5 font-semibold text-[#0F172A] tabular-nums">
                  {inspectWorker.experienceYears} years
                </p>
              </div>
              <div>
                <p className="text-[#64748B]">Expected Wage</p>
                <p className="mt-0.5 font-mono font-semibold text-[#172554] tabular-nums">
                  {formatINR(inspectWorker.expectedDailyWage)} / day
                </p>
              </div>
              <div>
                <p className="text-[#64748B]">Phone</p>
                <p className="mt-0.5 font-medium text-[#0F172A] tabular-nums">
                  {inspectWorker.phone}
                </p>
              </div>
              <div>
                <p className="text-[#64748B]">Preferred Language</p>
                <p className="mt-0.5 font-medium text-[#0F172A]">
                  {inspectWorker.preferredLanguage}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#0F172A]">Summary</p>
              <p className="mt-1 text-xs leading-relaxed text-[#64748B]">{inspectWorker.bio}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#0F172A]">Completed Work History</p>
              <ul className="mt-1.5 space-y-1 text-xs text-slate-600 list-disc pl-4">
                {inspectWorker.workHistory.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        confirmState={confirmState}
        onCancel={closeConfirm}
        onConfirm={handleConfirm}
      />
    </EmployerShell>
  );
};
