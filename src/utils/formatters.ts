import { WorkerProfile } from '../types';

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

export function calculateWorkerProfileCompletion(worker: WorkerProfile): number {
  const checks = [
    Boolean(worker.name.trim()),
    Boolean(worker.phone.trim()),
    Boolean(worker.location.trim()),
    worker.skills.length > 0,
    worker.experienceYears > 0,
    worker.expectedDailyWage > 0,
    Boolean(worker.availability),
    Boolean(worker.preferredLanguage.trim()),
    Boolean(worker.bio.trim()),
    Boolean(worker.avatarUrl.trim()),
  ];
  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}

export function extractDaysFromDuration(duration: string): number {
  const match = duration.match(/\d+/);
  return match ? Math.max(1, parseInt(match[0], 10)) : 1;
}

export function addDaysToIsoDate(isoDate: string, days: number): string {
  const base = new Date(isoDate);
  if (Number.isNaN(base.getTime())) return isoDate;
  base.setDate(base.getDate() + Math.max(0, days - 1));
  return base.toISOString().split('T')[0];
}

export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]): void {
  const escapeCell = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
