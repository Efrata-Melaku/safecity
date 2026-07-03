import { useMemo, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LanguageProvider } from './context/LanguageContext';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminResourcesPage } from './pages/AdminResourcesPage';
import { ClaimStatusPage } from './pages/ClaimStatusPage';
import { ContactPage } from './pages/ContactPage';
import { EmergencyContactsPage } from './pages/EmergencyContactsPage';
import { FAQPage } from './pages/FAQPage';
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ReportPage } from './pages/ReportPage';

function App() {
  const [coverMode, setCoverMode] = useState(false);
  const [lowBandwidth, setLowBandwidth] = useState(false);

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: '/',
          element: (
            <Layout
              coverMode={coverMode}
              lowBandwidth={lowBandwidth}
              onToggleCover={() => setCoverMode((value) => !value)}
              onToggleBandwidth={() => setLowBandwidth((value) => !value)}
              onEmergencyExit={() => {
                window.location.replace('https://www.google.com');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('reportDraft');
              }}
            >
              <HomePage />
            </Layout>
          ),
        },
        {
          path: '/about',
          element: (
            <Layout coverMode={coverMode} lowBandwidth={lowBandwidth} onToggleCover={() => setCoverMode((value) => !value)} onToggleBandwidth={() => setLowBandwidth((value) => !value)} onEmergencyExit={() => window.location.replace('https://www.google.com')}>
              <AboutPage />
            </Layout>
          ),
        },
        {
          path: '/how-it-works',
          element: (
            <Layout coverMode={coverMode} lowBandwidth={lowBandwidth} onToggleCover={() => setCoverMode((value) => !value)} onToggleBandwidth={() => setLowBandwidth((value) => !value)} onEmergencyExit={() => window.location.replace('https://www.google.com')}>
              <HowItWorksPage />
            </Layout>
          ),
        },
        {
          path: '/emergency-contacts',
          element: (
            <Layout coverMode={coverMode} lowBandwidth={lowBandwidth} onToggleCover={() => setCoverMode((value) => !value)} onToggleBandwidth={() => setLowBandwidth((value) => !value)} onEmergencyExit={() => window.location.replace('https://www.google.com')}>
              <EmergencyContactsPage />
            </Layout>
          ),
        },
        {
          path: '/report',
          element: (
            <Layout coverMode={coverMode} lowBandwidth={lowBandwidth} onToggleCover={() => setCoverMode((value) => !value)} onToggleBandwidth={() => setLowBandwidth((value) => !value)} onEmergencyExit={() => window.location.replace('https://www.google.com')}>
              <ReportPage />
            </Layout>
          ),
        },
        {
          path: '/claim-status',
          element: (
            <Layout coverMode={coverMode} lowBandwidth={lowBandwidth} onToggleCover={() => setCoverMode((value) => !value)} onToggleBandwidth={() => setLowBandwidth((value) => !value)} onEmergencyExit={() => window.location.replace('https://www.google.com')}>
              <ClaimStatusPage />
            </Layout>
          ),
        },
        {
          path: '/privacy',
          element: (
            <Layout coverMode={coverMode} lowBandwidth={lowBandwidth} onToggleCover={() => setCoverMode((value) => !value)} onToggleBandwidth={() => setLowBandwidth((value) => !value)} onEmergencyExit={() => window.location.replace('https://www.google.com')}>
              <PrivacyPage />
            </Layout>
          ),
        },
        {
          path: '/faq',
          element: (
            <Layout coverMode={coverMode} lowBandwidth={lowBandwidth} onToggleCover={() => setCoverMode((value) => !value)} onToggleBandwidth={() => setLowBandwidth((value) => !value)} onEmergencyExit={() => window.location.replace('https://www.google.com')}>
              <FAQPage />
            </Layout>
          ),
        },
        {
          path: '/contact',
          element: (
            <Layout coverMode={coverMode} lowBandwidth={lowBandwidth} onToggleCover={() => setCoverMode((value) => !value)} onToggleBandwidth={() => setLowBandwidth((value) => !value)} onEmergencyExit={() => window.location.replace('https://www.google.com')}>
              <ContactPage />
            </Layout>
          ),
        },
        {
          path: '/admin-login',
          element: (
            <Layout coverMode={coverMode} lowBandwidth={lowBandwidth} onToggleCover={() => setCoverMode((value) => !value)} onToggleBandwidth={() => setLowBandwidth((value) => !value)} onEmergencyExit={() => window.location.replace('https://www.google.com')}>
              <AdminLoginPage />
            </Layout>
          ),
        },
        {
          path: '/admin-dashboard',
          element: (
            <Layout coverMode={coverMode} lowBandwidth={lowBandwidth} onToggleCover={() => setCoverMode((value) => !value)} onToggleBandwidth={() => setLowBandwidth((value) => !value)} onEmergencyExit={() => window.location.replace('https://www.google.com')}>
              <AdminDashboardPage />
            </Layout>
          ),
        },
        {
          path: '/admin-resources',
          element: (
            <Layout coverMode={coverMode} lowBandwidth={lowBandwidth} onToggleCover={() => setCoverMode((value) => !value)} onToggleBandwidth={() => setLowBandwidth((value) => !value)} onEmergencyExit={() => window.location.replace('https://www.google.com')}>
              <AdminResourcesPage />
            </Layout>
          ),
        },
      ]),
    [coverMode, lowBandwidth],
  );

  if (coverMode) {
    return (
      <LanguageProvider>
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-center text-white">
          <div className="max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/90 p-10 shadow-2xl">
            <h1 className="text-3xl font-semibold">Breaking News</h1>
            <p className="mt-4 text-slate-300">City officials report a calm and stable environment in Hawassa as community support continues to expand.</p>
            <button type="button" onClick={() => setCoverMode(false)} className="mt-6 rounded-full bg-emerald-500 px-5 py-3 font-semibold text-slate-950">
              Return to Safe City Hawassa
            </button>
          </div>
        </div>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}

export default App;
