import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardList, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplicationStatus, JobApplication } from '../../types';
import { formatDate, formatINR } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { WorkerShell } from './WorkerShell';

export const MyApplicationsPage: React.FC = () => {
  const { state, currentWorker } = useApp();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<'All' | ApplicationStatus>('All');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  if (!currentWorker) return null;

  const myApps = state.applications.filter((a) => a.workerId === currentWorker.id);
  const filteredApps = myApps.filter((a) =>
    statusFilter === 'All' ? true : a.status === statusFilter
  );

  const selectedJob = selectedApp
    ? state.jobs.find((j) => j.id === selectedApp.jobId)
    : undefined;

  return (
    <WorkerShell pageTitle="My Applications">
      <div className="space-y-6">
        {/* Status Filter Tabs */}
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
            {filteredApps.length} {filteredApps.length === 1 ? 'application' : 'applications'}
          </p>
        </div>

        {filteredApps.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="h-6 w-6" />}
            title="No applications in this category"
            description="Browse available local jobs and submit an application to track its progress here."
            actionLabel="Find Jobs"
            onAction={() => navigate('/worker/jobs')}
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                  <tr>
                    <th className="px-5 py-3.5">Job Role & Employer</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5">Wage</th>
                    <th className="px-5 py-3.5">Applied Date</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApps.map((app) => {
                    const job = state.jobs.find((j) => j.id === app.jobId);
                    return (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#0F172A]">
                            {job?.title ?? 'Job Listing'}
                          </p>
                          <p className="text-xs text-[#64748B]">
                            {job?.employerName ?? 'Employer'}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-600 whitespace-nowrap">
                          {job?.location ?? '—'}
                        </td>
                        <td className="px-5 py-4 font-mono text-xs font-semibold text-[#172554] tabular-nums whitespace-nowrap">
                          {job ? formatINR(job.wageAmount) : '—'}
                        </td>
                        <td className="px-5 py-4 text-xs text-[#64748B] tabular-nums whitespace-nowrap">
                          {formatDate(app.appliedAt)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedApp(app)}
                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={Boolean(selectedApp)}
        onClose={() => setSelectedApp(null)}
        title="Application Details"
        subtitle={selectedJob?.title}
      >
        {selectedApp && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-[#F8FAFC] p-3.5">
              <div>
                <p className="text-xs text-[#64748B]">Current Status</p>
                <p className="mt-0.5 text-xs text-[#64748B]">
                  Last updated {formatDate(selectedApp.updatedAt)}
                </p>
              </div>
              <StatusBadge status={selectedApp.status} />
            </div>

            {selectedJob && (
              <div className="text-xs text-slate-600 space-y-1.5">
                <p>
                  <strong className="text-[#0F172A]">Employer:</strong> {selectedJob.employerName}
                </p>
                <p>
                  <strong className="text-[#0F172A]">Location:</strong> {selectedJob.location}
                </p>
                <p>
                  <strong className="text-[#0F172A]">Wage Offered:</strong>{' '}
                  {formatINR(selectedJob.wageAmount)} ({selectedJob.paymentType})
                </p>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-[#0F172A]">Your Submitted Note</p>
              <p className="mt-1.5 rounded-lg border border-slate-200 p-3 text-sm text-slate-600">
                {selectedApp.coverNote}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {selectedJob && (
                <Link
                  to={`/worker/jobs/${selectedJob.id}`}
                  className="inline-flex min-h-[40px] items-center rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  View Full Job
                </Link>
              )}
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="inline-flex min-h-[40px] items-center rounded-lg bg-[#172554] px-4 py-2 text-xs font-medium text-white hover:bg-[#1e3a8a]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </WorkerShell>
  );
};
