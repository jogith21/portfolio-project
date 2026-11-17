import React from 'react';
import { Briefcase, MapPin, MessageSquare } from 'lucide-react';
import { WorkerProfile } from '../../types';
import { formatINR } from '../../utils/formatters';
import { SafeImage } from '../common/SafeImage';
import { StatusBadge } from '../common/StatusBadge';

interface WorkerCardProps {
  worker: WorkerProfile;
  onContact: (worker: WorkerProfile) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onContact }) => {
  return (
    <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {worker.avatarUrl ? (
                <SafeImage
                  src={worker.avatarUrl}
                  alt={worker.name}
                  className="h-full w-full object-cover"
                  fallbackLabel={worker.name.slice(0, 2)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-sm font-bold text-[#172554]">
                  {worker.name
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .slice(0, 2)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold text-[#0F172A] truncate">
                {worker.name}
              </h3>
              <p className="text-xs text-[#64748B] truncate">
                {worker.skills.join(' · ')}
              </p>
            </div>
          </div>
          <StatusBadge status={worker.availability} />
        </div>

        <p className="mt-3 text-sm leading-relaxed text-[#64748B] line-clamp-2">
          {worker.bio}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{worker.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="tabular-nums">{worker.experienceYears} yrs experience</span>
          </div>
        </div>

        <div className="mt-3 border-t border-slate-100 pt-3">
          <p className="text-xs font-medium text-slate-700">Recent Work History</p>
          <p className="mt-1 text-xs text-[#64748B] truncate">
            {worker.workHistory[0] ?? `${worker.completedJobsCount} verified assignments completed`}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div>
          <span className="font-display text-lg font-bold text-[#172554] tabular-nums">
            {formatINR(worker.expectedDailyWage)}
          </span>
          <span className="ml-1 text-xs text-[#64748B]">/ day expected</span>
        </div>

        <button
          type="button"
          onClick={() => onContact(worker)}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 whitespace-nowrap shrink-0"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Contact Worker
        </button>
      </div>
    </article>
  );
};
