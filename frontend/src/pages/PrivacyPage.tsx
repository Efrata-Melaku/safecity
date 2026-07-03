import { useLanguage } from '../context/LanguageContext';

export function PrivacyPage() {
  const { language } = useLanguage();

  return (
    <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold">{language === 'en' ? 'Privacy policy' : 'የግላዊነት ፖሊሲ'}</h1>
      <p className="text-slate-600">{language === 'en' ? 'We protect your privacy by limiting data collection and avoiding unnecessary exposure of sensitive details.' : 'የእርስዎን ግላዊነት በመጠበቅ እና ስሜታዊ ዝርዝሮችን እንዳይጋለጡ በመጠበቅ እንከላከላለን።'}</p>
    </div>
  );
}
