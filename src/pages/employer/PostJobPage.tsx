import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INDIAN_LOCATIONS, SKILL_CATEGORIES } from '../../data/mockData';
import { JobPaymentType, SkillCategory } from '../../types';
import { EmployerShell } from './EmployerShell';

export const PostJobPage: React.FC = () => {
  const { state, currentEmployer, postJob, addToast } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillCategory, setSkillCategory] = useState<SkillCategory>('Electrician');
  const [location, setLocation] = useState<string>(
    currentEmployer?.location ?? INDIAN_LOCATIONS[0]
  );
  const [paymentType, setPaymentType] = useState<JobPaymentType>('Daily Wage');
  const [wageAmount, setWageAmount] = useState('900');
  const [workingHours, setWorkingHours] = useState('9:00 AM – 6:00 PM (1 hr break)');
  const [startDate, setStartDate] = useState('2026-11-25');
  const [duration, setDuration] = useState('10 Days');
  const [vacancies, setVacancies] = useState('2');
  const [requirementsText, setRequirementsText] = useState(
    'Minimum 2 years site experience\nValid government ID for site entry'
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!currentEmployer) return null;

  const minWage = state.settings.minDailyWageThreshold;

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (title.trim().length < 5) nextErrors.title = 'Enter a descriptive job title (min 5 characters).';
    if (description.trim().length < 15)
      nextErrors.description = 'Provide clear job details (min 15 characters).';
    const numericWage = Number(wageAmount);
    if (!numericWage || numericWage <= 0) {
      nextErrors.wageAmount = 'Enter a valid payment amount.';
    } else if (paymentType === 'Daily Wage' && numericWage < minWage) {
      nextErrors.wageAmount = `Daily wage must be at least ₹${minWage} per platform policy.`;
    }
    if (!workingHours.trim()) nextErrors.workingHours = 'Specify working hours.';
    if (!startDate) nextErrors.startDate = 'Select a start date.';
    if (!duration.trim()) nextErrors.duration = 'Specify work duration (e.g., 7 Days).';
    if (!Number(vacancies) || Number(vacancies) < 1)
      nextErrors.vacancies = 'At least 1 worker is required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.settings.requireEmployerVerificationForPosting && !currentEmployer.verified) {
      addToast({
        type: 'warning',
        title: 'Verification required',
        description: 'Platform settings currently require employer verification before posting.',
      });
      return;
    }

    if (!validate()) {
      addToast({
        type: 'error',
        title: 'Please fix highlighted fields',
      });
      return;
    }

    const reqLines = requirementsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const created = postJob({
      title: title.trim(),
      description: description.trim(),
      skillCategory,
      location,
      paymentType,
      wageAmount: Number(wageAmount),
      workingHours: workingHours.trim(),
      startDate,
      duration: duration.trim(),
      vacancies: Number(vacancies),
      requirements: reqLines.length > 0 ? reqLines : ['Relevant trade experience'],
      responsibilities: [
        'Complete daily assigned site tasks per supervisor schedule',
        'Follow standard workplace safety precautions',
      ],
    });

    if (created) {
      navigate('/employer/manage-jobs');
    }
  };

  return (
    <EmployerShell pageTitle="Post a Job">
      <div className="max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-6 space-y-5"
        >
          <div>
            <h2 className="font-display text-lg font-semibold text-[#0F172A]">
              Job Listing Details
            </h2>
            <p className="mt-0.5 text-xs text-[#64748B]">
              Published jobs appear immediately in the Worker Find Jobs marketplace.
            </p>
          </div>

          <div>
            <label htmlFor="post-title" className="block text-xs font-medium text-slate-700">
              Job Title *
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Commercial Building Conduit Wiring & Lighting Fit-Out"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="post-desc" className="block text-xs font-medium text-slate-700">
              Job Description *
            </label>
            <textarea
              id="post-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe site scope, tools provided, and expected output..."
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="post-skill" className="block text-xs font-medium text-slate-700">
                Skill Category *
              </label>
              <select
                id="post-skill"
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value as SkillCategory)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
              >
                {SKILL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="post-loc" className="block text-xs font-medium text-slate-700">
                Work Location *
              </label>
              <select
                id="post-loc"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
              >
                {INDIAN_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="post-pay-type" className="block text-xs font-medium text-slate-700">
                Payment Structure *
              </label>
              <select
                id="post-pay-type"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as JobPaymentType)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
              >
                <option value="Daily Wage">Daily Wage</option>
                <option value="Fixed Payment">Fixed Payment</option>
              </select>
            </div>

            <div>
              <label htmlFor="post-wage" className="block text-xs font-medium text-slate-700">
                {paymentType === 'Daily Wage' ? 'Daily Wage (₹) *' : 'Fixed Contract Amount (₹) *'}
              </label>
              <input
                id="post-wage"
                type="number"
                min={100}
                step={50}
                value={wageAmount}
                onChange={(e) => setWageAmount(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:border-[#2563EB] focus:outline-none"
              />
              {errors.wageAmount && (
                <p className="mt-1 text-xs text-red-600">{errors.wageAmount}</p>
              )}
            </div>

            <div>
              <label htmlFor="post-hours" className="block text-xs font-medium text-slate-700">
                Working Hours *
              </label>
              <input
                id="post-hours"
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
              />
              {errors.workingHours && (
                <p className="mt-1 text-xs text-red-600">{errors.workingHours}</p>
              )}
            </div>

            <div>
              <label htmlFor="post-start" className="block text-xs font-medium text-slate-700">
                Start Date *
              </label>
              <input
                id="post-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:border-[#2563EB] focus:outline-none"
              />
              {errors.startDate && (
                <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="post-duration" className="block text-xs font-medium text-slate-700">
                Duration *
              </label>
              <input
                id="post-duration"
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 10 Days"
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
              />
              {errors.duration && <p className="mt-1 text-xs text-red-600">{errors.duration}</p>}
            </div>

            <div>
              <label htmlFor="post-vacancies" className="block text-xs font-medium text-slate-700">
                Number of Workers Required *
              </label>
              <input
                id="post-vacancies"
                type="number"
                min={1}
                max={100}
                value={vacancies}
                onChange={(e) => setVacancies(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:border-[#2563EB] focus:outline-none"
              />
              {errors.vacancies && (
                <p className="mt-1 text-xs text-red-600">{errors.vacancies}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="post-req" className="block text-xs font-medium text-slate-700">
              Job Requirements (One per line)
            </label>
            <textarea
              id="post-req"
              rows={3}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => navigate('/employer/manage-jobs')}
              className="min-h-[42px] rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <FilePlus2 className="h-4 w-4" />
              Post Job
            </button>
          </div>
        </form>
      </div>
    </EmployerShell>
  );
};
