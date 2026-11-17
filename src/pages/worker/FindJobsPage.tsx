import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INDIAN_LOCATIONS, SKILL_CATEGORIES } from '../../data/mockData';
import { JobListing } from '../../types';
import { formatINR } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { JobCard } from '../../components/worker/JobCard';
import { WorkerShell } from './WorkerShell';

export const FindJobsPage: React.FC = () => {
  const { state, currentWorker, applyForJob } = useApp();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState(searchParams.get('skill') ?? 'All');
  const [wageFilter, setWageFilter] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');

  const [applyModalJob, setApplyModalJob] = useState<JobListing | null>(null);
  const [coverNote, setCoverNote] = useState('');

  const appliedJobIds = useMemo(() => {
    if (!currentWorker) return new Set<string>();
    return new Set(
      state.applications
        .filter((a) => a.workerId === currentWorker.id)
        .map((a) => a.jobId)
    );
  }, [state.applications, currentWorker]);

  const filteredJobs = useMemo(() => {
    return state.jobs.filter((job) => {
      if (job.status !== 'Active') return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hit =
          job.title.toLowerCase().includes(q) ||
          job.employerName.toLowerCase().includes(q) ||
          job.description.toLowerCase().includes(q) ||
          job.skillCategory.toLowerCase().includes(q);
        if (!hit) return false;
      }
      if (locationFilter !== 'All' && job.location !== locationFilter) return false;
      if (skillFilter !== 'All' && job.skillCategory !== skillFilter) return false;
      if (jobTypeFilter !== 'All' && job.paymentType !== jobTypeFilter) return false;
      if (wageFilter !== 'All') {
        if (wageFilter === 'low' && job.wageAmount > 750) return false;
        if (wageFilter === 'mid' && (job.wageAmount < 750 || job.wageAmount > 1000)) return false;
        if (wageFilter === 'high' && job.wageAmount <= 1000) return false;
      }
      return true;
    });
  }, [state.jobs, query, locationFilter, skillFilter, wageFilter, jobTypeFilter]);

  const clearFilters = () => {
    setQuery('');
    setLocationFilter('All');
    setSkillFilter('All');
    setWageFilter('All');
    setJobTypeFilter('All');
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalJob) return;
    const ok = applyForJob(applyModalJob.id, coverNote);
    if (ok) {
      setApplyModalJob(null);
      setCoverNote('');
    }
  };

  return (
    <WorkerShell pageTitle="Find Jobs">
      <div className="space-y-6">
        {/* Search & Filters */}
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by job title, trade skill, or contractor name..."
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="filter-location" className="block text-xs font-medium text-[#64748B] mb-1">
                  Location
                </label>
                <select
                  id="filter-location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
                >
                  <option value="All">All Cities</option>
                  {INDIAN_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filter-skill" className="block text-xs font-medium text-[#64748B] mb-1">
                  Skill Category
                </label>
                <select
                  id="filter-skill"
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
                >
                  <option value="All">All Trades</option>
                  {SKILL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filter-wage" className="block text-xs font-medium text-[#64748B] mb-1">
                  Wage Range
                </label>
                <select
                  id="filter-wage"
                  value={wageFilter}
                  onChange={(e) => setWageFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
                >
                  <option value="All">Any Wage</option>
                  <option value="low">Up to ₹750</option>
                  <option value="mid">₹750 – ₹1,000</option>
                  <option value="high">Above ₹1,000</option>
                </select>
              </div>

              <div>
                <label htmlFor="filter-type" className="block text-xs font-medium text-[#64748B] mb-1">
                  Job Type
                </label>
                <select
                  id="filter-type"
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[#0F172A] focus:border-[#2563EB] focus:outline-none"
                >
                  <option value="All">All Payment Types</option>
                  <option value="Daily Wage">Daily Wage</option>
                  <option value="Fixed Payment">Fixed Payment</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-[#64748B]">
              <span className="inline-flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Showing <strong className="text-[#0F172A] tabular-nums">{filteredJobs.length}</strong>{' '}
                active {filteredJobs.length === 1 ? 'listing' : 'listings'}
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="font-medium text-[#2563EB] hover:underline"
              >
                Reset filters
              </button>
            </div>
          </div>
        </section>

        {/* Job Cards Grid */}
        {filteredJobs.length === 0 ? (
          <EmptyState
            icon={<Search className="h-6 w-6" />}
            title="No matching jobs found"
            description="Try adjusting your city, skill category, or wage range filters to view more open shifts."
            actionLabel="Reset All Filters"
            onAction={clearFilters}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                hasApplied={appliedJobIds.has(job.id)}
                onApplyClick={(j) => {
                  setApplyModalJob(j);
                  setCoverNote(
                    currentWorker
                      ? `Experienced ${j.skillCategory.toLowerCase()} (${currentWorker.experienceYears} yrs). Available to start on ${j.startDate}.`
                      : ''
                  );
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={Boolean(applyModalJob)}
        onClose={() => setApplyModalJob(null)}
        title="Confirm Job Application"
        subtitle={applyModalJob ? `${applyModalJob.title} · ${applyModalJob.employerName}` : undefined}
      >
        {applyModalJob && (
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-3.5 text-xs text-slate-600 space-y-1">
              <p>
                <span className="font-medium text-[#0F172A]">Work Site:</span> {applyModalJob.location}
              </p>
              <p>
                <span className="font-medium text-[#0F172A]">Wage Offered:</span>{' '}
                {formatINR(applyModalJob.wageAmount)}{' '}
                {applyModalJob.paymentType === 'Daily Wage' ? '/ day' : 'fixed'}
              </p>
              <p>
                <span className="font-medium text-[#0F172A]">Schedule:</span> {applyModalJob.duration} ·{' '}
                {applyModalJob.workingHours}
              </p>
            </div>

            <div>
              <label htmlFor="find-cover-note" className="block text-xs font-medium text-slate-700">
                Message to Employer
              </label>
              <textarea
                id="find-cover-note"
                rows={3}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
                placeholder="Mention relevant work experience or tools you carry..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setApplyModalJob(null)}
                className="min-h-[40px] rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[40px] rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Apply Now
              </button>
            </div>
          </form>
        )}
      </Modal>
    </WorkerShell>
  );
};
