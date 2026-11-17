import React, { useMemo, useState } from 'react';
import { Phone, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INDIAN_LOCATIONS, SKILL_CATEGORIES } from '../../data/mockData';
import { SkillCategory, WorkerProfile } from '../../types';
import { formatINR } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { WorkerCard } from '../../components/employer/WorkerCard';
import { EmployerShell } from './EmployerShell';

export const FindWorkersPage: React.FC = () => {
  const { state, contactWorkerInquiry, addToast } = useApp();

  const [query, setQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');

  const [contactTarget, setContactTarget] = useState<WorkerProfile | null>(null);
  const [message, setMessage] = useState('');

  const filteredWorkers = useMemo(() => {
    return state.workers.filter((w) => {
      if (w.accountStatus === 'Suspended') return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hit =
          w.name.toLowerCase().includes(q) ||
          w.bio.toLowerCase().includes(q) ||
          w.skills.some((s) => s.toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (skillFilter !== 'All' && !w.skills.includes(skillFilter as SkillCategory)) {
        return false;
      }
      if (locationFilter !== 'All' && w.location !== locationFilter) return false;
      if (availabilityFilter !== 'All' && w.availability !== availabilityFilter) return false;
      return true;
    });
  }, [state.workers, query, skillFilter, locationFilter, availabilityFilter]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactTarget) return;
    if (!message.trim()) {
      addToast({ type: 'error', title: 'Enter a work inquiry message' });
      return;
    }
    contactWorkerInquiry(contactTarget.id, message.trim());
    setContactTarget(null);
    setMessage('');
  };

  return (
    <EmployerShell pageTitle="Find Workers">
      <div className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search workers by name, trade skill, or experience..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="fw-skill" className="block text-xs font-medium text-[#64748B] mb-1">
                Trade Skill
              </label>
              <select
                id="fw-skill"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              >
                <option value="All">All Skills</option>
                {SKILL_CATEGORIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="fw-loc" className="block text-xs font-medium text-[#64748B] mb-1">
                Location
              </label>
              <select
                id="fw-loc"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
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
              <label htmlFor="fw-avail" className="block text-xs font-medium text-[#64748B] mb-1">
                Availability
              </label>
              <select
                id="fw-avail"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              >
                <option value="All">Any Availability</option>
                <option value="Available Immediately">Available Immediately</option>
                <option value="Available Next Week">Available Next Week</option>
                <option value="Currently Busy">Currently Busy</option>
              </select>
            </div>
          </div>
        </section>

        {filteredWorkers.length === 0 ? (
          <EmptyState
            icon={<Search className="h-6 w-6" />}
            title="No matching workers found"
            description="Try broadening your trade skill or city filter."
            actionLabel="Reset Filters"
            onAction={() => {
              setQuery('');
              setSkillFilter('All');
              setLocationFilter('All');
              setAvailabilityFilter('All');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredWorkers.map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                onContact={(w) => {
                  setContactTarget(w);
                  setMessage(
                    `Hello ${w.name}, we have an upcoming shift in ${w.location} matching your ${w.skills.join('/')} experience.`
                  );
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={Boolean(contactTarget)}
        onClose={() => setContactTarget(null)}
        title={`Contact ${contactTarget?.name ?? 'Worker'}`}
        subtitle={contactTarget ? `${contactTarget.skills.join(' · ')} · ${contactTarget.location}` : undefined}
      >
        {contactTarget && (
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-3.5 text-xs text-slate-600 space-y-1">
              <p className="flex items-center gap-1.5 font-medium text-[#0F172A] tabular-nums">
                <Phone className="h-3.5 w-3.5 text-[#2563EB]" />
                {contactTarget.phone}
              </p>
              <p>
                Expected Rate: {formatINR(contactTarget.expectedDailyWage)}/day · Language:{' '}
                {contactTarget.preferredLanguage}
              </p>
            </div>

            <div>
              <label htmlFor="contact-worker-msg" className="block text-xs font-medium text-slate-700">
                Direct Shift Inquiry
              </label>
              <textarea
                id="contact-worker-msg"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setContactTarget(null)}
                className="min-h-[40px] rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[40px] rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Send Work Inquiry
              </button>
            </div>
          </form>
        )}
      </Modal>
    </EmployerShell>
  );
};
