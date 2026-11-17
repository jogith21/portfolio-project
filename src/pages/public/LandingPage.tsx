import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BrickWall,
  CheckCircle2,
  ClipboardCheck,
  Hammer,
  IndianRupee,
  Paintbrush,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  EMPLOYER_AVATAR_URL,
  HERO_IMAGE_URL,
  TRUST_IMAGE_URL,
  WORKER_AVATAR_URL,
} from '../../data/mockData';
import { SafeImage } from '../../components/common/SafeImage';

export const LandingPage: React.FC = () => {
  const { loginAsDemo, state } = useApp();
  const navigate = useNavigate();

  const handleFindJobs = () => {
    if (state.session?.role !== 'worker') {
      loginAsDemo('worker');
    }
    navigate('/worker/jobs');
  };

  const handleHireWorkers = () => {
    if (state.session?.role !== 'employer') {
      loginAsDemo('employer');
    }
    navigate('/employer/find-workers');
  };

  const categories = [
    {
      name: 'Electricians',
      skill: 'Electrician',
      rate: '₹850 – ₹1,200 / day',
      icon: <Zap className="h-5 w-5 text-[#2563EB]" />,
      jobsCount: '140+ open shifts',
    },
    {
      name: 'Plumbers',
      skill: 'Plumber',
      rate: '₹800 – ₹1,100 / day',
      icon: <Wrench className="h-5 w-5 text-[#2563EB]" />,
      jobsCount: '95+ open shifts',
    },
    {
      name: 'Painters',
      skill: 'Painter',
      rate: '₹750 – ₹1,050 / day',
      icon: <Paintbrush className="h-5 w-5 text-[#2563EB]" />,
      jobsCount: '110+ open shifts',
    },
    {
      name: 'Construction Workers',
      skill: 'Construction',
      rate: '₹700 – ₹950 / day',
      icon: <BrickWall className="h-5 w-5 text-[#2563EB]" />,
      jobsCount: '210+ open shifts',
    },
    {
      name: 'Carpenters',
      skill: 'Carpenter',
      rate: '₹950 – ₹1,300 / day',
      icon: <Hammer className="h-5 w-5 text-[#2563EB]" />,
      jobsCount: '88+ open shifts',
    },
    {
      name: 'Cleaners',
      skill: 'Cleaner',
      rate: '₹600 – ₹800 / day',
      icon: <Sparkles className="h-5 w-5 text-[#2563EB]" />,
      jobsCount: '125+ open shifts',
    },
  ];

  const stats = [
    { value: '18,400+', label: 'Registered Skilled Workers', context: 'Sample platform data' },
    { value: '2,150+', label: 'Verified Contractors & SMEs', context: 'Sample platform data' },
    { value: '94%', label: 'On-Time Wage Confirmation', context: 'Sample platform data' },
    { value: '6 Cities', label: 'Active Regional Hubs', context: 'Sample platform data' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
            <div className="flex flex-col justify-center lg:col-span-6">
              <p className="text-sm font-medium text-[#2563EB]">
                Daily-Wage Hiring & Work Records Platform
              </p>
              <h1
                className="mt-3 font-display font-bold tracking-tight text-[#172554]"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.75rem)', lineHeight: 1.08, textWrap: 'balance' }}
              >
                Find Work. Build Your Future.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#64748B] sm:text-lg">
                WorkConnect connects skilled daily-wage tradespeople directly with verified
                contractors and local businesses—bringing clear daily rates, verified sites, and
                transparent payment records to every shift.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={handleFindJobs}
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap"
                >
                  Find Jobs
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleHireWorkers}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-[#172554] transition-colors hover:bg-slate-50 whitespace-nowrap"
                >
                  Hire Workers
                </button>
              </div>

              <p className="mt-5 text-xs text-[#64748B]">
                No middlemen commissions · Instant demo access for Worker, Employer, and Admin views
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <SafeImage
                  src={HERO_IMAGE_URL}
                  alt="Skilled Indian tradespeople and contractor reviewing project drawings together"
                  className="h-full w-full object-cover"
                  fallbackLabel="WorkConnect Field Collaboration"
                />
              </div>
            </div>
          </div>

          {/* 4-column Stats Strip */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-slate-200 pt-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-4">
                <p className="font-display text-2xl font-bold text-[#172554] tabular-nums sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-[#0F172A]">{stat.label}</p>
                <p className="mt-0.5 text-xs text-[#64748B]">{stat.context}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#2563EB]">How It Works</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            From job discovery to confirmed payment records in three clear steps
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="font-mono text-sm font-semibold text-[#2563EB]">01.</span>
            <h3 className="mt-3 font-display text-lg font-semibold text-[#0F172A]">
              Publish or Discover Local Shifts
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
              Verified contractors post shift duration, daily wage or fixed pay, and required trade
              skills. Workers filter nearby openings in seconds.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="font-mono text-sm font-semibold text-[#2563EB]">02.</span>
            <h3 className="mt-3 font-display text-lg font-semibold text-[#0F172A]">
              Direct Application & Hiring
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
              Workers apply with one click and track Shortlisted or Accepted updates. Employers
              review experience and confirm hires without agency delays.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="font-mono text-sm font-semibold text-[#2563EB]">03.</span>
            <h3 className="mt-3 font-display text-lg font-semibold text-[#0F172A]">
              Documented Completion & Wage Ledger
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
              Both parties confirm shift completion and log agreed, paid, and outstanding amounts
              in a shared employment record.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Features (Asymmetric Grid) */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#2563EB]">Core Capabilities</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
              Built for operational clarity on every site
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 lg:col-span-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#172554] text-white">
                <IndianRupee className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-[#0F172A]">
                Transparent Wage & Outstanding Balance Tracking
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#64748B]">
                Every accepted job automatically generates a structured payment ledger showing the
                agreed wage, partial milestones settled, remaining balance, and worker
                acknowledgement—eliminating verbal misunderstandings.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 border-t border-slate-200 pt-5">
                <div>
                  <p className="text-xs text-[#64748B]">Agreed Wage</p>
                  <p className="mt-0.5 font-mono text-base font-semibold text-[#0F172A] tabular-nums">
                    ₹11,400
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Milestone Paid</p>
                  <p className="mt-0.5 font-mono text-base font-semibold text-emerald-700 tabular-nums">
                    ₹4,750
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#64748B]">Outstanding</p>
                  <p className="mt-0.5 font-mono text-base font-semibold text-amber-700 tabular-nums">
                    ₹6,650
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-5">
              <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-[#0F172A]">
                  Verified Employer Checks
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#64748B]">
                  Businesses submit GST or Udyam MSME documentation reviewed by WorkConnect admins
                  before earning a Verified badge.
                </p>
              </div>

              <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#2563EB]">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-[#0F172A]">
                  Portable Work History
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#64748B]">
                  Completed assignments build a verifiable track record that helps skilled workers
                  negotiate fair daily rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Job Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#2563EB]">Popular Job Categories</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
              High-demand skilled trades across Indian cities
            </h2>
          </div>
          <button
            type="button"
            onClick={handleFindJobs}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:underline whitespace-nowrap"
          >
            Browse all active jobs
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => {
                if (state.session?.role !== 'worker') loginAsDemo('worker');
                navigate(`/worker/jobs?skill=${encodeURIComponent(cat.skill)}`);
              }}
              className="group flex items-start justify-between rounded-xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-[#2563EB]"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  {cat.icon}
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-[#0F172A] group-hover:text-[#2563EB]">
                  {cat.name}
                </h3>
                <p className="mt-1 font-mono text-xs text-[#64748B] tabular-nums">{cat.rate}</p>
                <p className="mt-2 text-xs font-medium text-emerald-700">{cat.jobsCount}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#2563EB]" />
            </button>
          ))}
        </div>
      </section>

      {/* Trust & Safety */}
      <section id="trust-safety" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 aspect-[4/3]">
                <SafeImage
                  src={TRUST_IMAGE_URL}
                  alt="Site supervisor and skilled workers checking safety and job schedule on a tablet"
                  className="h-full w-full object-cover"
                  fallbackLabel="Verified Site Standards"
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <p className="text-sm font-medium text-emerald-700">Trust & Safety</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
                Accountability built into every hiring workflow
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#64748B] sm:text-base">
                Informal daily-wage hiring often leaves workers without proof of agreed wages and
                leaves contractors guessing skill reliability. WorkConnect enforces structured
                safeguards on both sides.
              </p>

              <ul className="mt-6 space-y-3.5">
                {[
                  'Employer business verification using GSTIN or Udyam MSME registration numbers.',
                  'Admin moderation queue to flag and deactivate suspicious or below-wage listings.',
                  'Dual completion confirmation and worker payment acknowledgement records.',
                  'Direct grievance escalation and toll-free worker support desk (1800-202-4410).',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-[#0F172A]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (Clearly Labelled Demo Content) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[#2563EB]">Demo Testimonials</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
              How workers and contractors use WorkConnect
            </h2>
          </div>
          <p className="text-xs text-[#64748B]">
            Sample illustrative stories demonstrating platform workflows
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm leading-relaxed text-[#0F172A]">
              “Before using digital job cards, I had to chase site supervisors for written proof of
              my 12-day electrical shift. Now the agreed ₹950 daily rate and milestone settlements
              are logged clearly from day one.”
            </p>
            <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
              <div className="h-11 w-11 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shrink-0">
                <SafeImage
                  src={WORKER_AVATAR_URL}
                  alt="Ramesh Kumar portrait"
                  className="h-full w-full object-cover"
                  fallbackLabel="RK"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">Ramesh Kumar</p>
                <p className="text-xs text-[#64748B]">
                  Licensed Electrician · Bengaluru · Demo Profile
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm leading-relaxed text-[#0F172A]">
              “When we take on commercial office fit-outs, finding 4 verified electricians on short
              notice used to take three days of phone calls. Shortlisting applicants and tracking
              shift payouts in one dashboard saves hours every week.”
            </p>
            <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
              <div className="h-11 w-11 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shrink-0">
                <SafeImage
                  src={EMPLOYER_AVATAR_URL}
                  alt="Priya Sharma portrait"
                  className="h-full w-full object-cover"
                  fallbackLabel="PS"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">Priya Sharma</p>
                <p className="text-xs text-[#64748B]">
                  Director, Apex BuildCraft Contractors · Bengaluru · Demo Profile
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Band */}
      <section className="border-t border-slate-200 bg-[#172554] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Explore all three WorkConnect dashboards right now
            </h2>
            <p className="mt-2 text-sm text-blue-100/90 sm:text-base">
              Test the end-to-end hiring cycle—post a job as an Employer, apply as a Worker,
              accept the hire, record payments, and verify businesses as an Admin.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 whitespace-nowrap"
            >
              Open Demo Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
