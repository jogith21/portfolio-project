import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/common/BrandLogo';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { state } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const dashboardHref =
    state.session?.role === 'worker'
      ? '/worker'
      : state.session?.role === 'employer'
      ? '/employer'
      : state.session?.role === 'admin'
      ? '/admin'
      : '/login';

  const primaryLabel = state.session ? 'Open Dashboard' : 'Sign In';

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="whitespace-nowrap shrink-0">
            <BrandLogo />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#172554] transition-colors whitespace-nowrap shrink-0"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('categories')}
              className="hover:text-[#172554] transition-colors whitespace-nowrap shrink-0"
            >
              Categories
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('trust-safety')}
              className="hover:text-[#172554] transition-colors whitespace-nowrap shrink-0"
            >
              Trust & Safety
            </button>
            <Link
              to="/login"
              className="hover:text-[#172554] transition-colors whitespace-nowrap shrink-0"
            >
              Demo Login
            </Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={dashboardHref}
              className="hidden sm:inline-flex min-h-[40px] items-center justify-center rounded-lg bg-[#172554] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1e3a8a] whitespace-nowrap shrink-0"
            >
              {primaryLabel}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle navigation menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="min-h-[44px] rounded-lg px-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('categories')}
                className="min-h-[44px] rounded-lg px-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Categories
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('trust-safety')}
                className="min-h-[44px] rounded-lg px-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Trust & Safety
              </button>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="min-h-[44px] flex items-center rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Demo Login
              </Link>
              <Link
                to={dashboardHref}
                onClick={() => setMobileOpen(false)}
                className="mt-1 min-h-[44px] flex items-center justify-center rounded-lg bg-[#172554] px-4 text-sm font-medium text-white"
              >
                {primaryLabel}
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <BrandLogo />
              <p className="mt-2 max-w-md text-sm text-[#64748B]">
                Connecting skilled daily-wage workers and verified employers with transparent hiring and payment records.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-600">
              <Link to="/about" className="hover:text-[#172554] transition-colors whitespace-nowrap">
                About
              </Link>
              <Link to="/contact" className="hover:text-[#172554] transition-colors whitespace-nowrap">
                Contact
              </Link>
              <Link to="/privacy" className="hover:text-[#172554] transition-colors whitespace-nowrap">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-[#172554] transition-colors whitespace-nowrap">
                Terms
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col gap-2 text-xs text-[#64748B] sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} WorkConnect Technologies. All rights reserved.</p>
            <p>Sample data shown for demonstration · Worker Helpline: 1800-202-4410</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
