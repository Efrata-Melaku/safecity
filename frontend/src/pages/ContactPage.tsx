import { useLanguage } from '../context/LanguageContext';

export function ContactPage() {
  const { language } = useLanguage();

  return (
    <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold">{language === 'en' ? 'Contact us' : 'አግኙን'}</h1>
      <p className="text-slate-600">{language === 'en' ? 'For non-urgent questions, contact the support desk through the emergency channels listed on this site.' : 'ለያልተጠበቀ ጥያቄዎች በዚህ ጣቢያ ላይ የተዘረዘሩትን የድጋፍ ሰርቪሶች ይጠቀሙ።'}</p>
    </div>
  );
}
