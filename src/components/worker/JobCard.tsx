import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { JobListing } from '../../types';
import { formatINR } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';

interface JobCardProps {
  job: JobListing;
  hasApplied?: boolean;
  onApplyClick: (job: JobListing) => void;
  detailBasePath?: string;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  hasApplied = false,
  onApplyClick,
  detailBasePath = '/worker/jobs',
}) => {
  return (
    <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
              <span className="font-medium text-[#0F172A]">{job.employerName}</span>
              <span aria-hidden="true">·</span>
              <span>{job.skillCategory}</span>
              <span aria-hidden="true">·</span>
              <span>{job.paymentType}</span>
            </div>
            <h3 className="mt-1.5 font-display text-base font-semibold leading-snug text-[#0F172A]">
              <Link
                to={`${detailBasePath}/${job.id}`}
                className="hover:text-[#2563EB] transition-colors"
              >
                {job.title}
              </Link>
            </h3>
          </div>
          <StatusBadge status={job.employerVerified ? 'Verified' : 'Unverified'} />
        </div>

        <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-[#64748B]">
          {job.description}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-2 border-t border-slate-100 pt-4 text-xs text-slate-600 sm:grid-cols-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="tabular-nums">{job.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="tabular-nums">
              {job.vacancies} {job.vacancies === 1 ? 'vacancy' : 'vacancies'}
            </span>
          </div>
        </div>

        {job.requirements.length > 0 && (
          <p className="mt-3 text-xs text-[#64748B] truncate">
            <span className="font-medium text-slate-700">Skills & Req:</span>{' '}
            {job.requirements.join(' · ')}
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div>
          <span className="font-display text-lg font-bold text-[#172554] tabular-nums">
            {formatINR(job.wageAmount)}
          </span>
          <span className="ml-1 text-xs text-[#64748B]">
            {job.paymentType === 'Daily Wage' ? '/ day' : 'fixed'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`${detailBasePath}/${job.id}`}
            className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0"
          >
            View Details
          </Link>
          <button
            type="button"
            disabled={hasApplied}
            onClick={() => onApplyClick(job)}
            className={`inline-flex min-h-[40px] items-center justify-center rounded-lg px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              hasApplied
                ? 'cursor-not-allowed bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-[#2563EB] text-white hover:bg-blue-700'
            }`}
          >
            {hasApplied ? 'Applied' : 'Apply Now'}
          </button>
        </div>
      </div>
    </article>
  );
};
