import React, { useState } from 'react';
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface InfoPageProps {
  section: 'about' | 'contact' | 'privacy' | 'terms';
}

export const InfoPage: React.FC<InfoPageProps> = ({ section }) => {
  const { addToast } = useApp();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) {
      addToast({
        type: 'error',
        title: 'Complete all fields',
        description: 'Please enter your name, phone or email, and message.',
      });
      return;
    }
    setSubmitted(true);
    addToast({
      type: 'success',
      title: 'Message received',
      description: 'Our regional support team will respond shortly.',
    });
  };

  if (section === 'about') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-[#2563EB]">About WorkConnect</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-[#172554]">
          Making daily-wage employment accessible, structured, and trustworthy
        </h1>
        <div className="mt-6 space-y-5 text-sm leading-relaxed text-slate-600 sm:text-base">
          <p>
            WorkConnect bridges the gap between India&apos;s skilled tradespeople—electricians,
            plumbers, painters, carpenters, masons, and facility cleaners—and the local
            contractors and small businesses who rely on dependable site teams.
          </p>
          <p>
            Instead of informal word-of-mouth commitments that leave wage disputes unresolved,
            WorkConnect documents every stage: job posting, worker application, hiring acceptance,
            work completion confirmation, and milestone payment recording.
          </p>
          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="font-display text-lg font-bold text-[#172554]">Zero Middlemen</p>
              <p className="mt-1 text-xs text-[#64748B]">
                Direct hiring between verified businesses and workers.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="font-display text-lg font-bold text-[#172554]">Clear Wage Ledgers</p>
              <p className="mt-1 text-xs text-[#64748B]">
                Agreed, paid, and balance amounts visible to both sides.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="font-display text-lg font-bold text-[#172554]">Verified Sites</p>
              <p className="mt-1 text-xs text-[#64748B]">
                Admin-checked GSTIN and MSME employer credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'contact') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-[#2563EB]">Contact Support</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-[#172554]">
          Reach the WorkConnect operations desk
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="space-y-4 md:col-span-5">
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-[#2563EB] mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[#64748B]">Toll-Free Worker Helpline</p>
                  <p className="text-sm font-semibold text-[#0F172A] tabular-nums">1800-202-4410</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-[#2563EB] mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[#64748B]">Employer & Operations Email</p>
                  <p className="text-sm font-semibold text-[#0F172A]">support@workconnect.in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#2563EB] mt-1 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-[#64748B]">Regional Office</p>
                  <p className="text-sm text-[#0F172A]">
                    Indiranagar 100 Feet Road, Bengaluru 560038
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              {submitted ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-[#10B981]" />
                  <h2 className="mt-3 font-display text-lg font-semibold text-[#0F172A]">
                    Inquiry Submitted
                  </h2>
                  <p className="mt-1 text-sm text-[#64748B]">
                    Thank you, {name}. Our support coordinator will reach out at {contact}.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setContact('');
                      setMessage('');
                    }}
                    className="mt-5 inline-flex min-h-[40px] items-center rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium text-slate-700">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-info" className="block text-xs font-medium text-slate-700">
                      Phone Number or Email
                    </label>
                    <input
                      id="contact-info"
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="+91 98xxx xxxxx or email"
                      className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-msg" className="block text-xs font-medium text-slate-700">
                      How can we help?
                    </label>
                    <textarea
                      id="contact-msg"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your hiring, verification, or support question..."
                      className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex min-h-[42px] items-center justify-center rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-[#2563EB]">Legal & Platform Governance</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-[#172554]">
        {section === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
      </h1>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 space-y-4 text-sm leading-relaxed text-slate-600">
        {section === 'privacy' ? (
          <>
            <p>
              WorkConnect collects only essential profile details—such as worker trade skills, city
              location, availability, and employer business registration identifiers—to facilitate
              transparent local hiring.
            </p>
            <p>
              In this demonstration build, all profile edits, job applications, and payment records
              are stored locally in your browser via <code className="font-mono text-xs">localStorage</code>{' '}
              and are never transmitted to external third parties.
            </p>
            <p>
              Payment records logged on WorkConnect serve strictly as transparent bookkeeping
              confirmations between employers and workers; WorkConnect does not store bank card
              numbers or execute live financial transfers.
            </p>
          </>
        ) : (
          <>
            <p>
              Employers posting shifts on WorkConnect agree to state accurate daily wages, working
              hours, site locations, and safety requirements, and to honor agreed compensation upon
              satisfactory shift completion.
            </p>
            <p>
              WorkConnect administrators reserve the right to suspend accounts or deactivate job
              listings flagged for misleading wage terms, safety violations, or unverified business
              claims.
            </p>
            <p>
              Both workers and employers may use the Support & Complaints desk to escalate disputes
              for review.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
