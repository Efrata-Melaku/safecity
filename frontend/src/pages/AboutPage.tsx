import { useLanguage } from '../context/LanguageContext';

export function AboutPage() {
  const { language } = useLanguage();

  return (
    <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold">{language === 'en' ? 'About Safe City Hawassa' : 'ስለ Safe City Hawassa'}</h1>
      <p className="text-slate-600">{language === 'en' ? 'Safe City Hawassa is a confidential reporting platform designed to support survivors and communities with safe, accountable pathways to report abuse.' : 'Safe City Hawassa የተጠቃሚ እና ማህበረሰብን የሚደግፍ በሚስጥር የሚሰራ የጥቃት ሪፖርት መድረክ ነው።'}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-5">
          <h2 className="font-semibold">{language === 'en' ? 'Mission' : 'ተልዕኮ'}</h2>
          <p className="mt-2 text-sm text-slate-600">{language === 'en' ? 'Protect dignity, reduce risk, and help communities respond responsibly.' : 'ክብርን ለመጠበቅ፣ አደጋን ለመቀነስ እና ማህበረሰቡ በሃላፊነት እንዲመልስ ለመርዳት።'}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-5">
          <h2 className="font-semibold">{language === 'en' ? 'Principles' : 'መርሆዎች'}</h2>
          {/* <p className="mt-2 text-sm text-slate-600">{language === 'en' ? 'Privacy, safety, bilingual access, and administrative accountability guide every part of the system.' : 'የግላዊነት፣ ደህንነት፣ ሁለት ቋንቋ መዳረሻ እና የአስተዳደር ተጠያቂነት በስርዓቱ ሁሉ ላይ ይመራሉ።'}</p> */}
        </div>
      </div>
    </div>
  );
}
