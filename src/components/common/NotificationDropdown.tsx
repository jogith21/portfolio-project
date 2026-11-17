import React, { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const NotificationDropdown: React.FC = () => {
  const { state, markNotificationRead, markAllNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const role = state.session?.role;
  const userId = state.session?.userId;

  const relevantNotifications = state.notifications.filter((n) => {
    if (!role) return false;
    if (n.targetRole !== role) return false;
    if (n.targetUserId && userId && n.targetUserId !== userId) return false;
    return true;
  });

  const unreadCount = relevantNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle notifications"
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-[#2563EB]"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#2563EB] px-1 text-[10px] font-semibold text-white tabular-nums">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-lg z-40">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <span className="font-display text-sm font-semibold text-[#0F172A]">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:underline"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {relevantNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[#64748B]">
                No notifications yet.
              </div>
            ) : (
              relevantNotifications.slice(0, 8).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    markNotificationRead(item.id);
                    setOpen(false);
                    if (item.link) navigate(item.link);
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors hover:bg-slate-50 ${
                    !item.read ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#0F172A] truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-[#64748B] whitespace-nowrap shrink-0">
                      {item.createdAt}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                    {item.message}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
