import { useLanguage } from '../context/LanguageContext';

export function FAQPage() {
  const { language } = useLanguage();

  const questions = [
    {
      question: language === 'en' ? 'Do I need an account to report?' : 'ሪፖርት ለማድረግ መለያ አለመሆን ይችላል?',
      answer: language === 'en' ? 'No. Reports can be submitted anonymously or with a preferred contact method.' : 'አይ. ሪፖርቶች ያለ መለያ ወይም በተመረጠ የግንኙነት መንገድ ሊገቡ ይችላሉ።',
    },
    {
      question: language === 'en' ? 'How do I check my claim status?' : 'የማመልከቻ ሁኔታዬን እንዴት እመልከታለሁ?',
      answer: language === 'en' ? 'Use your claim code on the status page.' : 'በሁኔታ ገጽ ላይ የማመልከቻ ኮድዎን ይጠቀሙ።',
    },
  ];

  return (
    <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold">{language === 'en' ? 'Frequently asked questions' : 'ተደጋጋሚ ጥያቄዎች'}</h1>
      <div className="space-y-4">
        {questions.map((item) => (
          <div key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="font-semibold">{item.question}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
