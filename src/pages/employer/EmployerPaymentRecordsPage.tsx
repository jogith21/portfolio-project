import React, { useState } from 'react';
import { Edit3, IndianRupee } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentRecord } from '../../types';
import { formatDate, formatINR } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmployerShell } from './EmployerShell';

export const EmployerPaymentRecordsPage: React.FC = () => {
  const { state, currentEmployer, recordPayment } = useApp();

  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [referenceNote, setReferenceNote] = useState('');

  if (!currentEmployer) return null;

  const myPayments = state.payments.filter((p) => p.employerId === currentEmployer.id);
  const totalAgreed = myPayments.reduce((s, p) => s + p.agreedAmount, 0);
  const totalPaid = myPayments.reduce((s, p) => s + p.amountPaid, 0);
  const totalOutstanding = myPayments.reduce((s, p) => s + p.outstandingAmount, 0);

  const openModal = (rec: PaymentRecord) => {
    setEditingPayment(rec);
    setAmountPaid(String(rec.amountPaid));
    setPaymentDate(rec.paymentDate || new Date().toISOString().split('T')[0]);
    setReferenceNote(rec.referenceNote || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;
    recordPayment(editingPayment.id, {
      amountPaid: Number(amountPaid) || 0,
      paymentDate,
      referenceNote: referenceNote.trim() || 'Settlement updated by employer',
    });
    setEditingPayment(null);
  };

  return (
    <EmployerShell pageTitle="Payment Records">
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-xs text-[#64748B]">
          Record agreed wages, cash/UPI/bank settlements, and payment dates for transparent worker
          acknowledgement. No live payment processing occurs here.
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Agreed Payroll"
            value={formatINR(totalAgreed)}
            icon={<IndianRupee className="h-5 w-5" />}
            accent="navy"
          />
          <StatCard
            label="Total Recorded Paid"
            value={formatINR(totalPaid)}
            icon={<IndianRupee className="h-5 w-5" />}
            accent="emerald"
          />
          <StatCard
            label="Outstanding Payables"
            value={formatINR(totalOutstanding)}
            icon={<IndianRupee className="h-5 w-5" />}
            accent="amber"
          />
        </div>

        {myPayments.length === 0 ? (
          <EmptyState
            icon={<IndianRupee className="h-6 w-6" />}
            title="No payment records yet"
            description="Hire an applicant to automatically generate a structured payment ledger entry."
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                  <tr>
                    <th className="px-5 py-3.5">Worker & Job</th>
                    <th className="px-5 py-3.5 text-right">Agreed</th>
                    <th className="px-5 py-3.5 text-right">Paid</th>
                    <th className="px-5 py-3.5 text-right">Outstanding</th>
                    <th className="px-5 py-3.5">Payment Date</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Worker Ack.</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myPayments.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#0F172A]">{rec.workerName}</p>
                        <p className="text-xs text-[#64748B]">{rec.jobTitle}</p>
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
                      <td className="px-5 py-4 text-xs text-slate-600 whitespace-nowrap">
                        {rec.workerAcknowledged ? 'Acknowledged' : 'Pending Ack.'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => openModal(rec)}
                          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Record Payment
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={Boolean(editingPayment)}
        onClose={() => setEditingPayment(null)}
        title="Record Wage Payment"
        subtitle={
          editingPayment
            ? `${editingPayment.workerName} · Agreed ${formatINR(editingPayment.agreedAmount)}`
            : undefined
        }
      >
        {editingPayment && (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="pay-amt" className="block text-xs font-medium text-slate-700">
                Cumulative Amount Paid (₹) (Max {formatINR(editingPayment.agreedAmount)})
              </label>
              <input
                id="pay-amt"
                type="number"
                min={0}
                max={editingPayment.agreedAmount}
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm tabular-nums focus:border-[#2563EB] focus:outline-none"
              />
              <p className="mt-1 text-xs text-[#64748B] tabular-nums">
                Remaining outstanding:{' '}
                {formatINR(Math.max(0, editingPayment.agreedAmount - (Number(amountPaid) || 0)))}
              </p>
            </div>

            <div>
              <label htmlFor="pay-date" className="block text-xs font-medium text-slate-700">
                Payment Date
              </label>
              <input
                id="pay-date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm tabular-nums focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="pay-note" className="block text-xs font-medium text-slate-700">
                Settlement Note (Cash / UPI Ref / Milestone)
              </label>
              <input
                id="pay-note"
                type="text"
                value={referenceNote}
                onChange={(e) => setReferenceNote(e.target.value)}
                placeholder="e.g., Paid via UPI ref #8412"
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingPayment(null)}
                className="min-h-[40px] rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[40px] rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Save Payment Record
              </button>
            </div>
          </form>
        )}
      </Modal>
    </EmployerShell>
  );
};
