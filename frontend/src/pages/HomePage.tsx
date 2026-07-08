import { ArrowRight, ShieldAlert, MessageSquareText, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export function HomePage() {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-3xl bg-slate-900 px-6 py-10 text-white shadow-xl lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">{language === 'en' ? 'Secure, private, confidential' : 'ደህንነቱ የተጠበቀ፣ ሚስጥራዊ፣ ሚስጥር ያለው'}</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{t('pageTitle')}</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">{t('heroText')}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/report" className="rounded-full bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400">
              {t('openReport')}
            </Link>
            <Link to="/how-it-works" className="rounded-full border border-slate-600 px-6 py-3 font-semibold text-white transition hover:bg-slate-800">
              {t('learnMore')}
            </Link>
             <Link to="/emergency-contacts" className="rounded-full border border-slate-600 px-6 py-3 font-semibold text-white transition hover:bg-slate-800">
              {t('contact')}
            </Link>

          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-800/70 p-6">
          <p className="text-sm font-medium text-emerald-300">{language === 'en' ? 'What you can do today' : 'ዛሬ ምን ማድረግ ይችላሉ'}</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            <li className="flex items-start gap-2"><ShieldAlert size={18} className="mt-0.5 text-emerald-400" /> {language === 'en' ? 'Report safely without sharing personal details.' : 'ያለ የግል መረጃ በደህንነት ሪፖርት ያድርጉ።'}</li>
            <li className="flex items-start gap-2"><MessageSquareText size={18} className="mt-0.5 text-emerald-400" /> {language === 'en' ? 'Track your claim with a private code.' : 'የማመልከቻ ኮድዎን በሚስጥር ይከታተሉ።'}</li>
            <li className="flex items-start gap-2"><HeartHandshake size={18} className="mt-0.5 text-emerald-400" /> {language === 'en' ? 'Connect with emergency support resources.' : 'ከአደጋ ድጋፍ ሀብቶች ጋር ይገናኙ።'}</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          { title: language === 'en' ? 'Rapid response' : 'ፈጣን ምላሽ', text: language === 'en' ? 'Escalation rules identify urgent cases and notify the right teams quickly.' : 'የምርመራ ህጎች አስቸኳይ ጉዳዮችን ይለያሉ እና ፈጣን ተግባር ያደርጋሉ።' },
          { title: language === 'en' ? 'Privacy careful' : 'ሚስጥር የተጠበቀ', text: language === 'en' ? 'Reports can be submitted anonymously without compromising safety.' : 'ሪፖርቶች ደህንነት አይጎዳም እንደ ስም አልባ በማስገባት ሊገቡ ይችላሉ።' },
          { title: language === 'en' ? 'Accountable support' : 'አስተዳደር የሚጠብቅ', text: language === 'en' ? 'Admin actions are logged for transparency and safety.' : 'የአስተዳደር እርምጃዎች ለግልጽነት እና ደህንነት ተመዝግበዋል።' },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-3 text-sm text-slate-600">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">{language === 'en' ? 'Ready to make a report?' : 'ሪፖርት ለማድረግ ዝግጁ ነዎት?'}</h2>
            <p className="mt-2 text-sm text-slate-600">{language === 'en' ? 'Your report can be submitted in minutes and tracked with a secure claim code.' : 'ሪፖርትዎ በደቂቃዎች ውስጥ ሊገባ እና በደህንነቱ የማመልከቻ ኮድ ሊከታተል ይችላል።'}</p>
          </div>
          <Link to="/report" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white">
            {t('submitReport')} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
