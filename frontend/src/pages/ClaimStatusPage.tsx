import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getClaimStatus } from '../services/api';

export function ClaimStatusPage() {
  const { language } = useLanguage();
  const [claimCode, setClaimCode] = useState('');
  const [result, setResult] = useState<null | Record<string, unknown>>(null);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    const normalizedClaimCode = claimCode.trim().toUpperCase();
    if (!normalizedClaimCode) {
      setResult(null);
      setError(language === 'en' ? 'Enter a claim code first.' : 'የማመልከቻ ኮድ መጀመሪያ ያስገቡ።');
      return;
    }

    try {
      const data = await getClaimStatus(normalizedClaimCode);
      setResult(data.report || null);
      setClaimCode(normalizedClaimCode);
      setError('');
    } catch (err) {
      setResult(null);
      setError(language === 'en' ? 'Claim code not found.' : 'የማመልከቻ ኮድ አልተገኘም።');
    }
  };

  return (
    <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold">{language === 'en' ? 'Check claim status' : 'የማመልከቻ ሁኔታ ይመልከቱ'}</h1>
      <div className="max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <input value={claimCode} onChange={(e) => setClaimCode(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" placeholder={language === 'en' ? 'Enter claim code' : 'የማመልከቻ ኮድ ያስገቡ'} />
        <button type="button" onClick={handleCheck} className="rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white">
          {language === 'en' ? 'Check status' : 'ሁኔታ ይመልከቱ'}
        </button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {result ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-slate-700">
          <p><strong>{language === 'en' ? 'Status' : 'ሁኔታ'}:</strong> {String(result.status)}</p>
          <p><strong>{language === 'en' ? 'Submitted' : 'የተገቡ'}:</strong> {String(result.createdAt)}</p>
        </div>
      ) : null}
    </div>
  );
}
