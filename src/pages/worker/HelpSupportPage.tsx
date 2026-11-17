import React, { useState } from 'react';
import { PhoneCall, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ComplaintRecord } from '../../types';
import { formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { WorkerShell } from './WorkerShell';

export const HelpSupportPage: React.FC = () => {
  const { state, currentWorker, submitSupportComplaint, addToast } = useApp();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<ComplaintRecord['category']>('Payment Dispute');
  const [relatedJobTitle, setRelatedJobTitle] = useState('');
  const [description, setDescription] = useState('');

  const myTickets = state.complaints.filter((c) => c.reporterId === currentWorker?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      addToast({
        type: 'error',
        title: 'Enter subject and description',
      });
      return;
    }
    submitSupportComplaint({
      subject: subject.trim(),
      category,
      description: description.trim(),
      relatedJobTitle: relatedJobTitle.trim() || undefined,
    });
    setSubject('');
    setRelatedJobTitle('');
    setDescription('');
  };

  return (
    <WorkerShell pageTitle="Help & Support">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-[#0F172A]">
              Raise a Support Request or Complaint
            </h2>
            <p className="mt-1 text-xs text-[#64748B]">
              Submitted tickets go directly to the WorkConnect Admin moderation queue.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="sup-cat" className="block text-xs font-medium text-slate-700">
                  Issue Category
                </label>
                <select
                  id="sup-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintRecord['category'])}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
                >
                  <option value="Payment Dispute">Payment Dispute</option>
                  <option value="Job Listing Issue">Job Listing Issue</option>
                  <option value="Safety Concern">Safety Concern</option>
                  <option value="Account Support">Account Support</option>
                </select>
              </div>

              <div>
                <label htmlFor="sup-subj" className="block text-xs font-medium text-slate-700">
                  Subject *
                </label>
                <input
                  id="sup-subj"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Briefly describe the issue"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="sup-job" className="block text-xs font-medium text-slate-700">
                  Related Job Title (Optional)
                </label>
                <input
                  id="sup-job"
                  type="text"
                  value={relatedJobTitle}
                  onChange={(e) => setRelatedJobTitle(e.target.value)}
                  placeholder="e.g., Commercial Wing Electrical Wiring"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="sup-desc" className="block text-xs font-medium text-slate-700">
                  Details *
                </label>
                <textarea
                  id="sup-desc"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Include dates, employer name, or agreed wage details..."
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
                Submit Ticket
              </button>
            </form>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-5">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#64748B]">Toll-Free Worker Helpline</p>
                <p className="font-mono text-lg font-bold text-[#172554] tabular-nums">
                  {state.settings.supportHelpline}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[#64748B]">
              Available Monday to Saturday, 8:00 AM – 8:00 PM IST in Hindi, Kannada, Tamil,
              Telugu, Marathi, and English.
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-display text-base font-semibold text-[#0F172A]">
              Your Submitted Requests
            </h3>
            <div className="mt-4 space-y-3">
              {myTickets.length === 0 ? (
                <p className="text-xs text-[#64748B]">No open support tickets.</p>
              ) : (
                myTickets.map((t) => (
                  <div key={t.id} className="rounded-lg border border-slate-200 p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-[#0F172A]">{t.subject}</p>
                      <StatusBadge status={t.status} />
                    </div>
                    <p className="mt-1 text-[11px] text-[#64748B]">
                      {t.category} · {formatDate(t.createdAt)}
                    </p>
                    {t.resolutionNote && (
                      <p className="mt-2 rounded bg-slate-50 p-2 text-xs text-slate-700">
                        Admin note: {t.resolutionNote}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </WorkerShell>
  );
};
