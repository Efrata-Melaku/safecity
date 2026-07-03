import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface EmergencyExitButtonProps {
  onExit: () => void;
}

export function EmergencyExitButton({ onExit }: EmergencyExitButtonProps) {
  const { language, t } = useLanguage();

  return (
    <button
      type="button"
      onClick={onExit}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700"
    >
      <AlertTriangle size={16} />
      {language === 'en' ? t('emergencyExit') : t('emergencyExitAmharic')}
    </button>
  );
}
