import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Calendar, CheckCircle2, MapPin, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../hooks/useConfirm';
import { formatDate, formatINR } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { WorkerShell } from './WorkerShell';

export const ActiveWorkPage: React.FC = () => {
  const { state, currentWorker, confirmWorkCompletionByWorker } = useApp();
  const { confirmState, requestConfirm, closeConfirm, handleConfirm } = useConfirm();
  const navigate = useNavigate();

  if (!currentWorker) return null;

  const myWork = state.activeWork.filter((w) => w.workerId === currentWorker.id);

  return (
    <WorkerShell pageTitle="Active Work">
      <div className="space-y-6">
        {myWork.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-6 w-6" />}
            title="No active work assignments"
            description="Once an employer accepts your job application, your active assignment and completion tracker will appear here."
            actionLabel="Browse Open Jobs"
            onAction={() => navigate('/worker/jobs')}
          />
        ) : (
          <div className="space-y-4">
            {myWork.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-[#64748B]">
                      {item.employerName} · {item.duration}
                    </p>
                    <h2 className="mt-1 font-display text-lg font-semibold text-[#172554]">
                      {item.jobTitle}
                    </h2>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-[#64748B]">Agreed Wage</p>
                    <p className="mt-1 font-mono text-base font-bold text-[#0F172A] tabular-nums">
                      {formatINR(item.agreedWage)}{' '}
                      <span className="text-xs font-normal text-[#64748B]">
                        {item.paymentType === 'Daily Wage' ? '/ day' : 'fixed'}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#64748B]">Work Schedule</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#0F172A] tabular-nums">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {formatDate(item.startDate)} – {formatDate(item.endDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#64748B]">Site Location</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#0F172A]">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#64748B]">Employer Contact</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#0F172A] tabular-nums">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {item.employerPhone}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div className="text-xs text-[#64748B]">
                    <span>
                      Worker confirmation:{' '}
                      <strong className="text-[#0F172A]">
                        {item.workerConfirmed ? 'Confirmed' : 'Pending'}
                      </strong>
                    </span>
                    <span className="mx-2" aria-hidden="true">
                      ·
                    </span>
                    <span>
                      Employer confirmation:{' '}
                      <strong className="text-[#0F172A]">
                        {item.employerConfirmed ? 'Confirmed' : 'Pending'}
                      </strong>
                    </span>
                  </div>

                  {!item.workerConfirmed ? (
                    <button
                      type="button"
                      onClick={() =>
                        requestConfirm({
                          title: 'Confirm Work Completion',
                          description: `Confirm that you have completed your assigned work for "${item.jobTitle}"? This notifies ${item.employerName} to finalize completion.`,
                          confirmLabel: 'Confirm Completion',
                          variant: 'primary',
                          onConfirm: () => confirmWorkCompletionByWorker(item.id),
                        })
                      }
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#10B981] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-600 whitespace-nowrap"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Confirm Work Completion
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      {item.employerConfirmed
                        ? 'Completed & verified by both parties'
                        : 'Awaiting employer sign-off'}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        confirmState={confirmState}
        onCancel={closeConfirm}
        onConfirm={handleConfirm}
      />
    </WorkerShell>
  );
};
