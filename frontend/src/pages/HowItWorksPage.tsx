import { useLanguage } from '../context/LanguageContext';

export function HowItWorksPage() {
  const { language } = useLanguage();

  const steps = [
    language === 'en' ? 'Choose the type of abuse and share key details.' : 'የጥቃት አይነት ይምረጡ እና አስፈላጊ ዝርዝሮችን ያካፍሉ።',
    language === 'en' ? 'Select your preferred contact method and review the report.' : 'የሚመርጡትን የግንኙነት መንገድ ይምረጡ እና ሪፖርትዎን ይገምግሙ።',
    language === 'en' ? 'Submit and keep your claim code to check progress later.' : 'አስገቡ እና በኋላ ሂደትን ለመከታተል የማመልከቻ ኮድዎን ይያዙ።',
  ];

  return (
    <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold">{language === 'en' ? 'How it works' : 'እንዴት ይሰራል'}</h1>
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="font-semibold">{language === 'en' ? `Step ${index + 1}` : `ደረጃ ${index + 1}`}</div>
            <p className="mt-2 text-sm text-slate-600">{step}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
