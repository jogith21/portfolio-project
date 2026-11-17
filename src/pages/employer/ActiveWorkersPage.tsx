import React from 'react';
import { Briefcase, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../hooks/useConfirm';
import { formatDate, formatINR } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmployerShell } from './EmployerShell';

export const ActiveWorkersPage: React.FC = () => {
  const { state, currentEmployer, confirmWorkCompletionByEmployer } = useApp();
  const { confirmState, requestConfirm, closeConfirm, handleConfirm } = useConfirm();

  if (!currentEmployer) return null;

  const myWorkers = state.activeWork.filter((w) => w.employerId === currentEmployer.id);

  return (
    <EmployerShell pageTitle="Active Workers">
      <div className="space-y-6">
        {myWorkers.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-6 w-6" />}
            title="No active workers hired yet"
            description="When you accept a worker's application, their ongoing work assignment and completion status will appear here."
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                  <tr>
                    <th className="px-5 py-3.5">Worker & Job</th>
                    <th className="px-5 py-3.5">Schedule</th>
                    <th className="px-5 py-3.5">Agreed Wage</th>
                    <th className="px-5 py-3.5">Completion Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myWorkers.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#0F172A]">{item.workerName}</p>
                        <p className="text-xs text-[#64748B]">{item.jobTitle}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 tabular-nums whitespace-nowrap">
                        {formatDate(item.startDate)} – {formatDate(item.endDate)} ({item.duration})
                      </td>
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-[#172554] tabular-nums whitespace-nowrap">
                        {formatINR(item.agreedWage)}{' '}
                        <span className="font-sans font-normal text-[#64748B]">
                          {item.paymentType === 'Daily Wage' ? '/day' : 'fixed'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        {item.status !== 'Completed' ? (
                          <button
                            type="button"
                            onClick={() =>
                              requestConfirm({
                                title: 'Mark Work as Completed',
                                description: `Confirm that ${item.workerName} has completed "${item.jobTitle}"?`,
                                confirmLabel: 'Mark Completed',
                                variant: 'primary',
                                onConfirm: () => confirmWorkCompletionByEmployer(item.id),
                              })
                            }
                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-[#10B981] px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 whitespace-nowrap"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Mark Completed
                          </button>
                        ) : (
                          <span className="text-xs font-medium text-emerald-700 whitespace-nowrap">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        confirmState={confirmState}
        onCancel={closeConfirm}
        onConfirm={handleConfirm}
      />
    </EmployerShell>
  );
};
