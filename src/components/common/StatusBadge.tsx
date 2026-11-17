import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  PauseCircle,
  ShieldCheck,
  XCircle,
} from 'lucide-react';

type StatusTone =
  | 'Pending'
  | 'Shortlisted'
  | 'Accepted'
  | 'Rejected'
  | 'Active'
  | 'Paused'
  | 'Closed'
  | 'Deactivated'
  | 'In Progress'
  | 'Awaiting Confirmation'
  | 'Completed'
  | 'Partial'
  | 'Paid'
  | 'Verified'
  | 'Suspended'
  | 'Open'
  | 'Investigating'
  | 'Resolved'
  | 'Dismissed'
  | 'Available Immediately'
  | 'Available Next Week'
  | 'Currently Busy'
  | 'Unverified';

interface StatusBadgeProps {
  status: StatusTone | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config: Record<
    string,
    { classes: string; icon: React.ReactNode }
  > = {
    Verified: {
      classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />,
    },
    Accepted: {
      classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />,
    },
    Active: {
      classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />,
    },
    Completed: {
      classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />,
    },
    Paid: {
      classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />,
    },
    Resolved: {
      classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />,
    },
    'Available Immediately': {
      classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />,
    },
    Shortlisted: {
      classes: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />,
    },
    'In Progress': {
      classes: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: <Clock className="h-3.5 w-3.5 text-blue-600 shrink-0" />,
    },
    Investigating: {
      classes: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: <Clock className="h-3.5 w-3.5 text-blue-600 shrink-0" />,
    },
    Pending: {
      classes: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />,
    },
    Partial: {
      classes: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />,
    },
    'Awaiting Confirmation': {
      classes: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />,
    },
    Open: {
      classes: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />,
    },
    'Available Next Week': {
      classes: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />,
    },
    Paused: {
      classes: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: <PauseCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />,
    },
    Closed: {
      classes: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: <PauseCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />,
    },
    Dismissed: {
      classes: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: <XCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />,
    },
    Unverified: {
      classes: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />,
    },
    'Currently Busy': {
      classes: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: <PauseCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />,
    },
    Rejected: {
      classes: 'bg-red-50 text-red-800 border-red-200',
      icon: <XCircle className="h-3.5 w-3.5 text-red-600 shrink-0" />,
    },
    Deactivated: {
      classes: 'bg-red-50 text-red-800 border-red-200',
      icon: <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0" />,
    },
    Suspended: {
      classes: 'bg-red-50 text-red-800 border-red-200',
      icon: <XCircle className="h-3.5 w-3.5 text-red-600 shrink-0" />,
    },
  };

  const entry = config[status] ?? {
    classes: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: null,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 ${entry.classes}`}
    >
      {entry.icon}
      <span>{status}</span>
    </span>
  );
};
