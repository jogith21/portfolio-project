import React, { useState } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INDIAN_LOCATIONS } from '../../data/mockData';
import { SafeImage } from '../../components/common/SafeImage';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmployerShell } from './EmployerShell';

export const EmployerProfilePage: React.FC = () => {
  const { currentEmployer, updateEmployerProfile, requestEmployerVerification, addToast } =
    useApp();

  const [companyName, setCompanyName] = useState(currentEmployer?.companyName ?? '');
  const [contactName, setContactName] = useState(currentEmployer?.contactName ?? '');
  const [phone, setPhone] = useState(currentEmployer?.phone ?? '');
  const [email, setEmail] = useState(currentEmployer?.email ?? '');
  const [location, setLocation] = useState(currentEmployer?.location ?? INDIAN_LOCATIONS[0]);
  const [industry, setIndustry] = useState(currentEmployer?.industry ?? '');
  const [registrationNumber, setRegistrationNumber] = useState(
    currentEmployer?.registrationNumber ?? ''
  );

  if (!currentEmployer) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !phone.trim()) {
      addToast({
        type: 'error',
        title: 'Required fields missing',
        description: 'Company name, contact person, and phone number are required.',
      });
      return;
    }
    updateEmployerProfile({
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      location,
      industry: industry.trim(),
      registrationNumber: registrationNumber.trim(),
    });
  };

  return (
    <EmployerShell pageTitle="Employer Profile">
      <div className="max-w-4xl space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shrink-0">
              <SafeImage
                src={currentEmployer.avatarUrl}
                alt={currentEmployer.companyName}
                className="h-full w-full object-cover"
                fallbackLabel={currentEmployer.companyName.slice(0, 2)}
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-lg font-bold text-[#0F172A]">
                  {currentEmployer.companyName}
                </h2>
                <StatusBadge
                  status={currentEmployer.verified ? 'Verified' : currentEmployer.verificationStatus}
                />
              </div>
              <p className="text-xs text-[#64748B] font-mono mt-0.5">
                {currentEmployer.registrationNumber}
              </p>
            </div>
          </div>

          {!currentEmployer.verified && (
            <button
              type="button"
              onClick={() =>
                requestEmployerVerification(
                  'GST / Udyam Business Document',
                  registrationNumber || currentEmployer.registrationNumber
                )
              }
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#10B981] px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600"
            >
              <ShieldCheck className="h-4 w-4" />
              Request Admin Verification
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="emp-company" className="block text-xs font-medium text-slate-700">
                Business / Contractor Name *
              </label>
              <input
                id="emp-company"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="emp-contact" className="block text-xs font-medium text-slate-700">
                Primary Contact Name *
              </label>
              <input
                id="emp-contact"
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="emp-phone" className="block text-xs font-medium text-slate-700">
                Business Phone *
              </label>
              <input
                id="emp-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm tabular-nums focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="emp-email" className="block text-xs font-medium text-slate-700">
                Work Email
              </label>
              <input
                id="emp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="emp-loc" className="block text-xs font-medium text-slate-700">
                Primary City
              </label>
              <select
                id="emp-loc"
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
              <label htmlFor="emp-ind" className="block text-xs font-medium text-slate-700">
                Industry / Trade Focus
              </label>
              <input
                id="emp-ind"
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="emp-reg" className="block text-xs font-medium text-slate-700">
                GSTIN / Udyam MSME Registration Number
              </label>
              <input
                id="emp-reg"
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 font-mono text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button
              type="submit"
              className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#172554] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1e3a8a]"
            >
              <Save className="h-4 w-4" />
              Save Employer Profile
            </button>
          </div>
        </form>
      </div>
    </EmployerShell>
  );
};
