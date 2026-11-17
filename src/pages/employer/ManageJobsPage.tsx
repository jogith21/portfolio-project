import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit3, FilePlus2, ListChecks, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useConfirm } from '../../hooks/useConfirm';
import { INDIAN_LOCATIONS } from '../../data/mockData';
import { JobListing, JobStatus } from '../../types';
import { formatINR } from '../../utils/formatters';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmployerShell } from './EmployerShell';

export const ManageJobsPage: React.FC = () => {
  const { state, currentEmployer, updateJob, deleteJob } = useApp();
  const { confirmState, requestConfirm, closeConfirm, handleConfirm } = useConfirm();
  const navigate = useNavigate();

  const [editingJob, setEditingJob] = useState<JobListing | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editWage, setEditWage] = useState('');
  const [editVacancies, setEditVacancies] = useState('');
  const [editStatus, setEditStatus] = useState<JobStatus>('Active');

  if (!currentEmployer) return null;

  const myJobs = state.jobs.filter((j) => j.employerId === currentEmployer.id);

  const openEditModal = (job: JobListing) => {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditLocation(job.location);
    setEditWage(String(job.wageAmount));
    setEditVacancies(String(job.vacancies));
    setEditStatus(job.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    updateJob(editingJob.id, {
      title: editTitle.trim() || editingJob.title,
      location: editLocation,
      wageAmount: Number(editWage) || editingJob.wageAmount,
      vacancies: Math.max(1, Number(editVacancies) || editingJob.vacancies),
      status: editStatus,
    });
    setEditingJob(null);
  };

  return (
    <EmployerShell pageTitle="Manage Jobs">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#64748B]">
            Showing <strong className="text-[#0F172A] tabular-nums">{myJobs.length}</strong> posted
            job listings
          </p>
          <Link
            to="/employer/post-job"
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 whitespace-nowrap"
          >
            <FilePlus2 className="h-4 w-4" />
            Post a Job
          </Link>
        </div>

        {myJobs.length === 0 ? (
          <EmptyState
            icon={<ListChecks className="h-6 w-6" />}
            title="No job listings posted"
            description="Publish a job to start receiving applications from nearby skilled workers."
            actionLabel="Post Your First Job"
            onAction={() => navigate('/employer/post-job')}
          />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-[#64748B]">
                  <tr>
                    <th className="px-5 py-3.5">Job Title</th>
                    <th className="px-5 py-3.5">Location</th>
                    <th className="px-5 py-3.5">Wage</th>
                    <th className="px-5 py-3.5 text-center">Applicants</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myJobs.map((job) => {
                    const applicantCount = state.applications.filter(
                      (a) => a.jobId === job.id
                    ).length;
                    return (
                      <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#0F172A]">{job.title}</p>
                          <p className="text-xs text-[#64748B]">
                            {job.skillCategory} · {job.vacancies} vacancies
                          </p>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-600 whitespace-nowrap">
                          {job.location}
                        </td>
                        <td className="px-5 py-4 font-mono text-xs font-semibold text-[#172554] tabular-nums whitespace-nowrap">
                          {formatINR(job.wageAmount)}{' '}
                          <span className="font-sans font-normal text-[#64748B]">
                            {job.paymentType === 'Daily Wage' ? '/day' : 'fixed'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center font-mono text-xs font-semibold text-[#0F172A] tabular-nums">
                          {applicantCount}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={job.status} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(job)}
                              className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                requestConfirm({
                                  title: 'Delete Job Listing',
                                  description: `Are you sure you want to permanently delete "${job.title}"? Associated pending applications will also be removed.`,
                                  confirmLabel: 'Delete Job',
                                  variant: 'danger',
                                  onConfirm: () => deleteJob(job.id),
                                })
                              }
                              className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
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
        isOpen={Boolean(editingJob)}
        onClose={() => setEditingJob(null)}
        title="Edit Job Listing"
        subtitle={editingJob?.skillCategory}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label htmlFor="edit-title" className="block text-xs font-medium text-slate-700">
              Job Title
            </label>
            <input
              id="edit-title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-loc" className="block text-xs font-medium text-slate-700">
                Location
              </label>
              <select
                id="edit-loc"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              >
                {INDIAN_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="edit-wage" className="block text-xs font-medium text-slate-700">
                Wage (₹)
              </label>
              <input
                id="edit-wage"
                type="number"
                value={editWage}
                onChange={(e) => setEditWage(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm tabular-nums focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="edit-vac" className="block text-xs font-medium text-slate-700">
                Vacancies
              </label>
              <input
                id="edit-vac"
                type="number"
                min={1}
                value={editVacancies}
                onChange={(e) => setEditVacancies(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm tabular-nums focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="edit-status" className="block text-xs font-medium text-slate-700">
                Listing Status
              </label>
              <select
                id="edit-status"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as JobStatus)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingJob(null)}
              className="min-h-[40px] rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[40px] rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        confirmState={confirmState}
        onCancel={closeConfirm}
        onConfirm={handleConfirm}
      />
    </EmployerShell>
  );
};
