import React, { useState } from 'react';
import { AlertTriangle, MessageSquareText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ComplaintRecord, ComplaintStatus } from '../../types';
import { formatDate } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AdminShell } from './AdminShell';

export const AdminComplaintsPage: React.FC = () => {
  const { state, updateComplaintStatus } = useApp();
  const [filter, setFilter] = useState<'All' | ComplaintStatus>('All');
  const [activeComplaint, setActiveComplaint] = useState<ComplaintRecord | null>(null);
  const [nextStatus, setNextStatus] = useState<ComplaintStatus>('Resolved');
  const [resolutionNote, setResolutionNote] = useState('');

  const filtered = state.complaints.filter((c) =>
    filter === 'All' ? true : c.status === filter
  );

  const openModal = (cmp: ComplaintRecord) => {
    setActiveComplaint(cmp);
    setNextStatus(cmp.status === 'Open' ? 'Investigating' : 'Resolved');
    setResolutionNote(cmp.resolutionNote ?? '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;
    updateComplaintStatus(activeComplaint.id, nextStatus, resolutionNote.trim());
    setActiveComplaint(null);
  };

  return (
    <AdminShell pageTitle="Complaints">
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
            {(['All', 'Open', 'Investigating', 'Resolved', 'Dismissed'] as const).map((tab) => (
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
          <p className="text-xs text-[#64748B] tabular-nums">
            {filtered.length} {filtered.length === 1 ? 'record' : 'records'}
          </p>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<AlertTriangle className="h-6 w-6" />}
            title="No complaints in this view"
            description="Submitted worker and employer disputes appear here for review."
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((cmp) => (
              <article
                key={cmp.id}
                className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base font-semibold text-[#0F172A]">
                      {cmp.subject}
                    </h3>
                    <StatusBadge status={cmp.status} />
                  </div>
                  <p className="text-xs text-[#64748B]">
                    Reported by <strong className="text-[#0F172A]">{cmp.reporterName}</strong> (
                    {cmp.reporterRole}) · {cmp.category} · {formatDate(cmp.createdAt)}
                  </p>
                  {cmp.relatedJobTitle && (
                    <p className="text-xs font-medium text-[#172554]">
                      Related Job: {cmp.relatedJobTitle}
                    </p>
                  )}
                  <p className="text-sm text-slate-600 pt-1">{cmp.description}</p>
                  {cmp.resolutionNote && (
                    <p className="mt-2 rounded-lg border border-slate-200 bg-[#F8FAFC] p-2.5 text-xs text-slate-700">
                      Resolution Note: {cmp.resolutionNote}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openModal(cmp)}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 shrink-0"
                >
                  <MessageSquareText className="h-3.5 w-3.5" />
                  Update Status
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={Boolean(activeComplaint)}
        onClose={() => setActiveComplaint(null)}
        title="Update Complaint Resolution"
        subtitle={activeComplaint?.subject}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="cmp-status" className="block text-xs font-medium text-slate-700">
              Resolution Status
            </label>
            <select
              id="cmp-status"
              value={nextStatus}
              onChange={(e) => setNextStatus(e.target.value as ComplaintStatus)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            >
              <option value="Open">Open</option>
              <option value="Investigating">Investigating</option>
              <option value="Resolved">Resolved</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>

          <div>
            <label htmlFor="cmp-note" className="block text-xs font-medium text-slate-700">
              Resolution Note
            </label>
            <textarea
              id="cmp-note"
              rows={3}
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Document actions taken or verification outcome..."
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveComplaint(null)}
              className="min-h-[40px] rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[40px] rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Save Resolution
            </button>
          </div>
        </form>
      </Modal>
    </AdminShell>
  );
};
