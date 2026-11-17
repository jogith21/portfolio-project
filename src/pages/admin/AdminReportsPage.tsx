import React from 'react';
import { Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SKILL_CATEGORIES } from '../../data/mockData';
import { downloadCSV, formatINR } from '../../utils/formatters';
import { ActivityChart } from '../../components/admin/ActivityChart';
import { StatCard } from '../../components/common/StatCard';
import { AdminShell } from './AdminShell';

export const AdminReportsPage: React.FC = () => {
  const { state, addToast } = useApp();

  const totalAgreedVolume = state.payments.reduce((s, p) => s + p.agreedAmount, 0);
  const totalSettledVolume = state.payments.reduce((s, p) => s + p.amountPaid, 0);
  const avgWorkerExpectedWage = Math.round(
    state.workers.reduce((s, w) => s + w.expectedDailyWage, 0) /
      Math.max(1, state.workers.length)
  );
  const hireConversionRate = Math.round(
    (state.applications.filter((a) => a.status === 'Accepted').length /
      Math.max(1, state.applications.length)) *
      100
  );

  const categoryStats = SKILL_CATEGORIES.map((cat) => ({
    label: cat,
    count: state.jobs.filter((j) => j.skillCategory === cat).length,
  }));

  const weeklyActivity = [
    { day: 'Mon', applications: 12, hires: 4 },
    { day: 'Tue', applications: 18, hires: 6 },
    { day: 'Wed', applications: 15, hires: 5 },
    { day: 'Thu', applications: 22, hires: 8 },
    { day: 'Fri', applications: 26, hires: 9 },
    { day: 'Sat', applications: 19, hires: 7 },
    { day: 'Sun', applications: Math.max(8, state.applications.length * 3), hires: Math.max(3, state.activeWork.length * 2) },
  ];

  const handleExportJobsCSV = () => {
    downloadCSV(
      'workconnect_jobs_report.csv',
      ['Job ID', 'Title', 'Employer', 'Category', 'Location', 'Payment Type', 'Wage', 'Status'],
      state.jobs.map((j) => [
        j.id,
        j.title,
        j.employerName,
        j.skillCategory,
        j.location,
        j.paymentType,
        j.wageAmount,
        j.status,
      ])
    );
    addToast({
      type: 'success',
      title: 'CSV report exported',
      description: 'Downloaded workconnect_jobs_report.csv',
    });
  };

  return (
    <AdminShell pageTitle="Reports">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#0F172A]">
              Platform Operations & Wage Summary
            </h2>
            <p className="text-xs text-[#64748B]">
              Aggregated marketplace performance and trade category insights
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportJobsCSV}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#172554] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1e3a8a]"
          >
            <Download className="h-4 w-4" />
            Export Jobs CSV
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Recorded Wage Volume"
            value={formatINR(totalAgreedVolume)}
            sublabel="Across active & completed shifts"
            accent="navy"
          />
          <StatCard
            label="Settled Wage Volume"
            value={formatINR(totalSettledVolume)}
            sublabel="Acknowledged & logged payments"
            accent="emerald"
          />
          <StatCard
            label="Avg Expected Daily Wage"
            value={formatINR(avgWorkerExpectedWage)}
            sublabel="Across registered workers"
            accent="blue"
          />
          <StatCard
            label="Application-to-Hire Rate"
            value={`${hireConversionRate}%`}
            sublabel="Accepted applications"
            accent="emerald"
          />
        </div>

        <ActivityChart categoryStats={categoryStats} weeklyActivity={weeklyActivity} />
      </div>
    </AdminShell>
  );
};
