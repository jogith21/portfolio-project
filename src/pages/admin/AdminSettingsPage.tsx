import React, { useState } from 'react';
import { RefreshCw, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../hooks/useConfirm';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { AdminShell } from './AdminShell';

export const AdminSettingsPage: React.FC = () => {
  const { state, updatePlatformSettings, resetDemoData } = useApp();
  const { confirmState, requestConfirm, closeConfirm, handleConfirm } = useConfirm();

  const [minWage, setMinWage] = useState(String(state.settings.minDailyWageThreshold));
  const [requireVerified, setRequireVerified] = useState(
    state.settings.requireEmployerVerificationForPosting
  );
  const [autoFlag, setAutoFlag] = useState(state.settings.autoFlagDuplicateListings);
  const [helpline, setHelpline] = useState(state.settings.supportHelpline);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings({
      minDailyWageThreshold: Math.max(300, Number(minWage) || 550),
      requireEmployerVerificationForPosting: requireVerified,
      autoFlagDuplicateListings: autoFlag,
      supportHelpline: helpline.trim() || '1800-202-4410',
    });
  };

  return (
    <AdminShell pageTitle="Settings">
      <div className="max-w-3xl space-y-6">
        <form onSubmit={handleSave} className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#0F172A]">
              Marketplace Governance Rules
            </h2>
            <p className="mt-0.5 text-xs text-[#64748B]">
              Controls enforced across Employer job posting and Worker support workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="set-min-wage" className="block text-xs font-medium text-slate-700">
                Minimum Daily Wage Threshold (₹)
              </label>
              <input
                id="set-min-wage"
                type="number"
                min={300}
                value={minWage}
                onChange={(e) => setMinWage(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="set-helpline" className="block text-xs font-medium text-slate-700">
                Worker Support Helpline
              </label>
              <input
                id="set-helpline"
                type="text"
                value={helpline}
                onChange={(e) => setHelpline(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:border-[#2563EB] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={requireVerified}
                onChange={(e) => setRequireVerified(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2563EB]"
              />
              <div>
                <p className="text-sm font-medium text-[#0F172A]">
                  Require Employer Verification Before Posting
                </p>
                <p className="text-xs text-[#64748B]">
                  When enabled, unverified employers must wait for GST/Udyam approval before
                  publishing jobs.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoFlag}
                onChange={(e) => setAutoFlag(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2563EB]"
              />
              <div>
                <p className="text-sm font-medium text-[#0F172A]">
                  Auto-Flag Duplicate Job Postings
                </p>
                <p className="text-xs text-[#64748B]">
                  Highlight listings with identical title and site location in the moderation queue.
                </p>
              </div>
            </label>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button
              type="submit"
              className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Save Settings
            </button>
          </div>
        </form>

        <section className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-[#0F172A]">
              Reset Local Demo Storage
            </h3>
            <p className="text-xs text-[#64748B]">
              Restore all jobs, applications, verification requests, and payment ledgers to the
              initial sample dataset.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              requestConfirm({
                title: 'Reset All Demo Data',
                description:
                  'This will clear all jobs, applications, and payment edits saved in localStorage and restore the original WorkConnect demo dataset.',
                confirmLabel: 'Reset Data',
                variant: 'danger',
                onConfirm: resetDemoData,
              })
            }
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 whitespace-nowrap"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Demo Data
          </button>
        </section>
      </div>

      <ConfirmDialog
        confirmState={confirmState}
        onCancel={closeConfirm}
        onConfirm={handleConfirm}
      />
    </AdminShell>
  );
};
