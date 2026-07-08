import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ShieldCheck, Menu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { EmergencyExitButton } from './EmergencyExitButton';

interface LayoutProps {
  children: React.ReactNode;
  coverMode: boolean;
  lowBandwidth: boolean;
  onToggleCover: () => void;
  onToggleBandwidth: () => void;
  onEmergencyExit: () => void;
}

export function Layout({ children, coverMode, lowBandwidth, onToggleCover, onToggleBandwidth, onEmergencyExit }: LayoutProps) {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-200'}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-600" />
            <div>
              <div className="text-lg font-semibold">{t('siteName')}</div>
              <div className="text-xs text-slate-500">{language === 'en' ? 'Confidential support' : 'ሚስጥራዊ ድጋፍ'}</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={linkClasses}>{t('home')}</NavLink>
            <NavLink to="/about" className={linkClasses}>{t('about')}</NavLink>
            <NavLink to="/how-it-works" className={linkClasses}>{t('howItWorks')}</NavLink>
            <NavLink to="/emergency-contacts" className={linkClasses}>{t('contacts')}</NavLink>
            <NavLink to="/report" className={linkClasses}>{t('report')}</NavLink>
            <NavLink to="/claim-status" className={linkClasses}>{t('claimStatus')}</NavLink>
              {/* <NavLink to="/admin-resources" className={linkClasses}>Resources</NavLink> */}
            <button type="button" onClick={() => navigate('/admin-login')} className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">
              {t('adminLogin')}
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setLanguage(language === 'en' ? 'am' : 'en')} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
              {t('toggleLanguage')}
            </button>
            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-md border border-slate-300 p-2 md:hidden">
              <Menu size={18} />
            </button>
          </div>
        </div>
         {mobileMenuOpen && (
  <nav className="border-t border-slate-200 bg-white md:hidden">
    <div className="flex flex-col p-4 space-y-2">

      <NavLink
        to="/"
        className={linkClasses}
        onClick={() => setMobileMenuOpen(false)}
      >
        {t("home")}
      </NavLink>

      <NavLink
        to="/about"
        className={linkClasses}
        onClick={() => setMobileMenuOpen(false)}
      >
        {t("about")}
      </NavLink>

      <NavLink
        to="/how-it-works"
        className={linkClasses}
        onClick={() => setMobileMenuOpen(false)}
      >
        {t("howItWorks")}
      </NavLink>

      <NavLink
        to="/emergency-contacts"
        className={linkClasses}
        onClick={() => setMobileMenuOpen(false)}
      >
        {t("contacts")}
      </NavLink>

      <NavLink
        to="/report"
        className={linkClasses}
        onClick={() => setMobileMenuOpen(false)}
      >
        {t("report")}
      </NavLink>

      <NavLink
        to="/claim-status"
        className={linkClasses}
        onClick={() => setMobileMenuOpen(false)}
      >
        {t("claimStatus")}
      </NavLink>

      <NavLink
        to="/admin-resources"
        className={linkClasses}
        onClick={() => setMobileMenuOpen(false)}
      >
        Resources
      </NavLink>

      <button
        onClick={() => {
          setMobileMenuOpen(false);
          navigate("/admin-login");
        }}
        className="rounded-md bg-emerald-600 px-3 py-2 text-white"
      >
        {t("adminLogin")}
      </button>

    </div>
  </nav>
)}
      </header>

      <main className={`mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ${lowBandwidth ? 'motion-reduce:transition-none' : ''}`}>
        <div className="mb-6 flex flex-wrap gap-3">
          <button type="button" onClick={onToggleCover} className="rounded-full border border-slate-300 px-4 py-2 text-sm">
            {coverMode ? (language === 'en' ? 'Exit Cover Mode' : 'የሽፋን ሞድ ይውጡ') : t('coverMode')}
          </button>
          <button type="button" onClick={onToggleBandwidth} className="rounded-full border border-slate-300 px-4 py-2 text-sm">
            {lowBandwidth ? (language === 'en' ? 'Disable Low Bandwidth' : 'ዝቅተኛ ባንድዊድ ያጥፉ') : t('lowBandwidth')}
          </button>
        </div>
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white/80 py-8">
        <div className="mx-auto max-w-7xl px-4 text-sm text-slate-600 sm:px-6 lg:px-8">
          <p>© 2026 Safe City Hawassa. Confidential support infrastructure.</p>
        </div>
      </footer>

      <EmergencyExitButton onExit={onEmergencyExit} />
    </div>
  );
}
