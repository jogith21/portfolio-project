import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INDIAN_LOCATIONS, SKILL_CATEGORIES, WORKER_AVATAR_URL } from '../../data/mockData';
import { SkillCategory, WorkerProfile } from '../../types';
import { calculateWorkerProfileCompletion } from '../../utils/formatters';
import { SafeImage } from '../../components/common/SafeImage';
import { WorkerShell } from './WorkerShell';

export const WorkerProfilePage: React.FC = () => {
  const { currentWorker, updateWorkerProfile, addToast } = useApp();

  const [name, setName] = useState(currentWorker?.name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(currentWorker?.avatarUrl ?? '');
  const [phone, setPhone] = useState(currentWorker?.phone ?? '');
  const [location, setLocation] = useState(currentWorker?.location ?? INDIAN_LOCATIONS[0]);
  const [skills, setSkills] = useState<SkillCategory[]>(currentWorker?.skills ?? []);
  const [experienceYears, setExperienceYears] = useState(
    String(currentWorker?.experienceYears ?? 1)
  );
  const [expectedDailyWage, setExpectedDailyWage] = useState(
    String(currentWorker?.expectedDailyWage ?? 800)
  );
  const [availability, setAvailability] = useState<WorkerProfile['availability']>(
    currentWorker?.availability ?? 'Available Immediately'
  );
  const [preferredLanguage, setPreferredLanguage] = useState(
    currentWorker?.preferredLanguage ?? 'Hindi'
  );
  const [bio, setBio] = useState(currentWorker?.bio ?? '');

  if (!currentWorker) return null;

  const completionPct = calculateWorkerProfileCompletion({
    ...currentWorker,
    name,
    avatarUrl,
    phone,
    location,
    skills,
    experienceYears: Number(experienceYears) || 0,
    expectedDailyWage: Number(expectedDailyWage) || 0,
    availability,
    preferredLanguage,
    bio,
  });

  const toggleSkill = (skill: SkillCategory) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || skills.length === 0) {
      addToast({
        type: 'error',
        title: 'Missing required fields',
        description: 'Name, phone number, and at least one trade skill are required.',
      });
      return;
    }

    updateWorkerProfile({
      name: name.trim(),
      avatarUrl: avatarUrl.trim(),
      phone: phone.trim(),
      location,
      skills,
      experienceYears: Math.max(0, Number(experienceYears) || 0),
      expectedDailyWage: Math.max(300, Number(expectedDailyWage) || 500),
      availability,
      preferredLanguage,
      bio: bio.trim(),
    });
  };

  return (
    <WorkerShell pageTitle="My Profile">
      <div className="max-w-4xl space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shrink-0">
              <SafeImage
                src={avatarUrl}
                alt={name || 'Worker profile'}
                className="h-full w-full object-cover"
                fallbackLabel={name.slice(0, 2) || 'WC'}
              />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[#0F172A]">{name}</h2>
              <p className="text-xs text-[#64748B]">
                Profile completion:{' '}
                <strong className="text-[#172554] tabular-nums">{completionPct}%</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAvatarUrl(WORKER_AVATAR_URL)}
            className="min-h-[38px] rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap self-start sm:self-center"
          >
            Use Demo Photo
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="wrk-name" className="block text-xs font-medium text-slate-700">
                Full Name *
              </label>
              <input
                id="wrk-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="wrk-phone" className="block text-xs font-medium text-slate-700">
                Phone Number *
              </label>
              <input
                id="wrk-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="wrk-photo" className="block text-xs font-medium text-slate-700">
                Profile Photo URL
              </label>
              <input
                id="wrk-photo"
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Paste image path or click Use Demo Photo"
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="wrk-location" className="block text-xs font-medium text-slate-700">
                City / Location *
              </label>
              <select
                id="wrk-location"
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
              <label htmlFor="wrk-exp" className="block text-xs font-medium text-slate-700">
                Experience (Years)
              </label>
              <input
                id="wrk-exp"
                type="number"
                min={0}
                max={50}
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="wrk-wage" className="block text-xs font-medium text-slate-700">
                Expected Daily Wage (₹)
              </label>
              <input
                id="wrk-wage"
                type="number"
                min={300}
                step={50}
                value={expectedDailyWage}
                onChange={(e) => setExpectedDailyWage(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="wrk-avail" className="block text-xs font-medium text-slate-700">
                Availability
              </label>
              <select
                id="wrk-avail"
                value={availability}
                onChange={(e) => setAvailability(e.target.value as WorkerProfile['availability'])}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
              >
                <option value="Available Immediately">Available Immediately</option>
                <option value="Available Next Week">Available Next Week</option>
                <option value="Currently Busy">Currently Busy</option>
              </select>
            </div>

            <div>
              <label htmlFor="wrk-lang" className="block text-xs font-medium text-slate-700">
                Preferred Language
              </label>
              <select
                id="wrk-lang"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
              >
                {['Hindi', 'Kannada', 'Tamil', 'Telugu', 'Marathi', 'English'].map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-700 mb-2">
              Trade Skills * (Select all that apply)
            </span>
            <div className="flex flex-wrap gap-2">
              {SKILL_CATEGORIES.map((skill) => {
                const selected = skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`min-h-[38px] rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      selected
                        ? 'border-[#2563EB] bg-[#2563EB] text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="wrk-bio" className="block text-xs font-medium text-slate-700">
              Work Experience Summary
            </label>
            <textarea
              id="wrk-bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button
              type="submit"
              className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </WorkerShell>
  );
};
