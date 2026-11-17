import React from 'react';
import { CheckCircle2, IndianRupee } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatINR } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { WorkerShell } from './WorkerShell';

export const WorkerPaymentHistoryPage: React.FC = () => {
  const { state, currentWorker, acknowledgePaymentByWorker } = useApp();

  if (!currentWorker) return null;

  const myPayments = state.payments.filter((p) => p.workerId === currentWorker.id);
  const totalAgreed = myPayments.reduce((s, p) => s + p.agreedAmount, 0);
  const totalPaid = myPayments.reduce((s, p) => s + p.amountPaid, 0);
  const totalOutstanding = myPayments.reduce((s, p) => s + p.outstandingAmount, 0);

  return (
    <WorkerShell pageTitle="Payment History">
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs text-[#64748B]">
          Transparent Wage Ledger: Amounts shown below reflect confirmed shift agreements and
          employer-recorded settlements (cash, UPI, or bank transfer). WorkConnect does not process
          live fund transfers.
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Agreed Wages"
            value={formatINR(totalAgreed)}
            icon={<IndianRupee className="h-5 w-5" />}
            accent="navy"
          />
          <StatCard
            label="Total Amount Paid"
            value={formatINR(totalPaid)}
            icon={<IndianRupee className="h-5 w-5" />}
            accent="emerald"
          />
          <StatCard
            label="Outstanding Balance"
            value={formatINR(totalOutstanding)}
            icon={<IndianRupee className="h-5 w-5" />}
            accent="amber"
          />
        </div>

        {myPayments.length === 0 ? (
          <EmptyState
            icon={<IndianRupee className="h-6 w-6" />}
            title="No payment records yet"
            description="Payment ledgers are created automatically when an employer accepts your job application."
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                  <tr>
                    <th className="px-5 py-3.5">Job Title & Employer</th>
                    <th className="px-5 py-3.5 text-right">Agreed</th>
                    <th className="px-5 py-3.5 text-right">Paid</th>
                    <th className="px-5 py-3.5 text-right">Outstanding</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Acknowledgement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myPayments.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#0F172A]">{rec.jobTitle}</p>
                        <p className="text-xs text-[#64748B]">{rec.employerName}</p>
                        {rec.referenceNote && (
                          <p className="mt-0.5 text-[11px] text-slate-500">{rec.referenceNote}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right font-mono text-xs font-medium text-[#0F172A] tabular-nums whitespace-nowrap">
                        {formatINR(rec.agreedAmount)}
                      </td>
                      <td className="px-5 py-4 text-right font-mono text-xs font-semibold text-emerald-700 tabular-nums whitespace-nowrap">
                        {formatINR(rec.amountPaid)}
                      </td>
                      <td className="px-5 py-4 text-right font-mono text-xs font-semibold text-amber-700 tabular-nums whitespace-nowrap">
                        {formatINR(rec.outstandingAmount)}
                      </td>
                      <td className="px-5 py-4 text-xs text-[#64748B] tabular-nums whitespace-nowrap">
                        {formatDate(rec.paymentDate)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={rec.paymentStatus} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        {rec.workerAcknowledged ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 whitespace-nowrap">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Acknowledged
                          </span>
                        ) : rec.amountPaid > 0 ? (
                          <button
                            type="button"
                            onClick={() => acknowledgePaymentByWorker(rec.id)}
                            className="min-h-[36px] rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 whitespace-nowrap"
                          >
                            Acknowledge
                          </button>
                        ) : (
                          <span className="text-xs text-[#64748B]">Awaiting payment</span>
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
    </WorkerShell>
  );
};
