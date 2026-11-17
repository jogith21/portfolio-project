import React, { useState } from 'react';
import { Check, ShieldCheck, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VerificationRequest } from '../../types';
import { formatDate } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminShell } from './AdminShell';

export const AdminVerificationPage: React.FC = () => {
  const { state, reviewVerificationRequest } = useApp();
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Verified' | 'Rejected'>('All');
  const [rejectTarget, setRejectTarget] = useState<VerificationRequest | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const filtered = state.verificationRequests.filter((r) =>
    filter === 'All' ? true : r.status === filter
  );

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectTarget) return;
    reviewVerificationRequest(
      rejectTarget.id,
      'Rejected',
      rejectNote.trim() || 'Document number could not be validated.'
    );
    setRejectTarget(null);
    setRejectNote('');
  };

  return (
    <AdminShell pageTitle="Employer Verification">
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
            {(['All', 'Pending', 'Verified', 'Rejected'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`min-h-[34px] rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  filter === tab
                    ? 'bg-white text-[#172554] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#64748B]">
            Approving an employer immediately displays a Verified badge across all their job listings.
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<ShieldCheck className="h-6 w-6" />}
            title="No verification requests"
            description="No employer verification requests match this filter."
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((req) => (
              <article
                key={req.id}
                className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-display text-base font-semibold text-[#0F172A]">
                      {req.companyName}
                    </h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-xs text-[#64748B]">
                    Contact: {req.contactName} · {req.location} · Submitted {formatDate(req.submittedAt)}
                  </p>
                  <p className="text-xs font-mono text-[#172554] pt-1">
                    {req.documentType}: <strong>{req.documentNumber}</strong>
                  </p>
                  {req.adminNote && (
                    <p className="text-xs text-slate-600 pt-1">Admin Note: {req.adminNote}</p>
                  )}
                </div>

                {req.status === 'Pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        reviewVerificationRequest(
                          req.id,
                          'Verified',
                          'Business registration verified by Admin.'
                        )
                      }
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#10B981] px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRejectTarget(req);
                        setRejectNote('');
                      }}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        title="Reject Verification Request"
        subtitle={rejectTarget?.companyName}
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <div>
            <label htmlFor="reject-reason" className="block text-xs font-medium text-slate-700">
              Reason for Rejection (Sent to Employer)
            </label>
            <textarea
              id="reject-reason"
              rows={3}
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="e.g., GSTIN number mismatch with registered company name..."
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setRejectTarget(null)}
              className="min-h-[40px] rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[40px] rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </Modal>
    </AdminShell>
  );
};
