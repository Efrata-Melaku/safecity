import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useLanguage } from '../context/LanguageContext';
import { submitReport } from '../services/api';
import SelectionCard from '../components/SelectionCard';
import { Phone, MessageCircle, Mail, EyeOff } from 'lucide-react';

const stepOneSchema = z.object({
  abuseType: z.string().min(1),
  otherType: z.string().optional(),
}).superRefine((value, ctx) => {
  if (value.abuseType === 'other' && !value.otherType?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['otherType'], message: 'Describe the other abuse type.' });
  }
});

const stepTwoSchema = z.object({
  description: z.string().min(10),
  location: z.string().min(3),
  incidentDate: z.string().optional(),
});

const stepThreeSchema = z.object({
  contactPreference: z.string().min(1),
  contactValue: z.string().optional(),
}).superRefine((value, ctx) => {
  if (['phone', 'text', 'email'].includes(value.contactPreference) && !value.contactValue?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['contactValue'], message: 'Add contact details or choose no contact.' });
  }
});

type FormValues = {
  abuseType: string;
  otherType?: string;
  description?: string;
  location?: string;
  incidentDate?: string;
  contactPreference?: string;
  contactValue?: string;
};

export function ReportPage() {
  const { language } = useLanguage();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [claimCode, setClaimCode] = useState('');
  const [error, setError] = useState('');
  const [stepError, setStepError] = useState('');

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      abuseType: 'physical',
      contactPreference: 'no-contact',
    },
  });

  const abuseType = watch('abuseType');
  const contactPreference = watch('contactPreference');

  useEffect(() => {
    const saved = localStorage.getItem('reportDraft');
    if (saved) {
      const draft = JSON.parse(saved) as FormValues;
      Object.entries(draft).forEach(([key, value]) => setValue(key as keyof FormValues, value));
    }
  }, [setValue]);

  const [loading, setLoading] = useState(false);

  const onNext = async () => {
    setStepError('');
    if (step === 0) {
      const parsed = stepOneSchema.safeParse({ abuseType: watch('abuseType'), otherType: watch('otherType') });
      if (!parsed.success) {
        setStepError(language === 'en' ? 'Please complete the selected abuse type.' : 'እባክዎ የመረጡትን የጥቃት አይነት ያጠናቁ።');
        return;
      }
      setStep(1);
      return;
    }
    if (step === 1) {
      const parsed = stepTwoSchema.safeParse({ description: watch('description'), location: watch('location'), incidentDate: watch('incidentDate') });
      if (!parsed.success) {
        setStepError(language === 'en' ? 'Please add a description and location before continuing.' : 'እባክዎ ከመቀጠልዎ በፊት መግለጫ እና ቦታ ያስገቡ።');
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      const parsed = stepThreeSchema.safeParse({ contactPreference: watch('contactPreference'), contactValue: watch('contactValue') });
      if (!parsed.success) {
        setStepError(language === 'en' ? 'Add contact details or choose no contact.' : 'የግንኙነት መረጃ ያስገቡ ወይም ግንኙነት አይፈልግም ይምረጡ።');
        return;
      }
      setStep(3);
      return;
    }
    if (step === 3) {
      setStep(4);
    }
  };

  const submitForm = async (values: FormValues) => {
    localStorage.setItem('reportDraft', JSON.stringify(values));
    setLoading(true);
    setError('');
    try {
      const payload = {
        abuseType: values.abuseType,
        otherAbuseType: values.abuseType === 'other' ? values.otherType?.trim() : undefined,
        description: values.description,
        location: values.location,
        incidentDate: values.incidentDate || undefined,
        contactPreference: values.contactPreference,
        contactValue: values.contactPreference === 'no-contact' ? undefined : values.contactValue?.trim() || undefined,
        anonymous: values.contactPreference === 'no-contact',
      } as Record<string, unknown>;

      const response = await submitReport(payload);
      setClaimCode(response.claimCode || response.claim || '');
      setSubmitted(true);
      reset();
      localStorage.removeItem('reportDraft');
      setLoading(false);
    } catch (err) {
      setError(language === 'en' ? 'Unable to submit report at the moment.' : 'ሪፖርት በአሁኑ ጊዜ ሊገባ አይችልም።');
      setLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    await submitForm(values);
  };

  const steps = [
    language === 'en' ? 'Abuse type' : 'የጥቃት አይነት',
    language === 'en' ? 'Incident details' : 'የክስተት ዝርዝሮች',
    language === 'en' ? 'Contact preference' : 'የግንኙነት ምርጫ',
    language === 'en' ? 'Review and submit' : 'ይገምግሙ እና ያስገቡ',
  ];

  if (submitted) {
    return (
      <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">{language === 'en' ? 'Report submitted' : 'ሪፖርት ተገብቷል'}</h1>
        <p className="text-slate-600">{language === 'en' ? 'Save your claim code. It cannot be recovered if lost.' : 'የማመልከቻ ኮድዎን ይቆጥቡ። ከጠፋ መልሶ ማግኘት አይቻልም።'}</p>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-lg font-semibold text-emerald-800">
          {claimCode}
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => navigator.clipboard.writeText(claimCode)} className="rounded-full bg-slate-900 px-5 py-3 font-semibold text-white">
            {language === 'en' ? 'Copy code' : 'ኮድ ቅዳ'}
          </button>
          <a href="/claim-status" className="rounded-full border border-slate-300 px-5 py-3 font-semibold">
            {language === 'en' ? 'Check status' : 'ሁኔታ ይመልከቱ'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold">{language === 'en' ? 'Report abuse' : 'ጥቃት ያስታውቁ'}</h1>
      <div className="flex flex-wrap gap-2">
        {steps.map((label, index) => (
          <span key={label} className={`rounded-full px-3 py-1 text-sm ${index <= step ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {label}
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 0 ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium">{language === 'en' ? 'Choose abuse type' : 'የጥቃት አይነት ይምረጡ'}</label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[{
                id: 'physical', title: language === 'en' ? 'Physical Abuse' : 'አካላዊ', description: language === 'en' ? 'Physical violence or bodily harm.' : 'አካላዊ ጥቃት ወይም አካላዊ ጉዳት', icon: '🩹'
              }, {
                id: 'sexual', title: language === 'en' ? 'Sexual Abuse' : 'ወሲባዊ', description: language === 'en' ? 'Any unwanted sexual act or harassment.' : 'ያልተፈለገ ወሲባዊ እርምጃ', icon: '🚫'
              }, {
                id: 'mental', title: language === 'en' ? 'Mental / Emotional Abuse' : 'ስሜታዊ', description: language === 'en' ? 'Threats, humiliation, intimidation or emotional harm.' : 'የስሜታዊ ጉዳት', icon: '💔'
              }, {
                id: 'financial', title: language === 'en' ? 'Financial Abuse' : 'ፋይናንስ', description: language === 'en' ? 'Controlling money or financial resources.' : 'የፋይናንስ እንቅስቃሴ', icon: '💰'
              }, {
                id: 'neglect', title: language === 'en' ? 'Neglect' : 'ችግር', description: language === 'en' ? 'Failure to provide proper care or protection.' : 'እንክብካቤ እጥረት', icon: '👶'
              }, {
                id: 'other', title: language === 'en' ? 'Other' : 'ሌላ', description: language === 'en' ? 'Any abuse not listed above.' : 'ሌላ የሆነ ጉዳይ', icon: '📝'
              }].map((card) => (
                <SelectionCard key={card.id} id={card.id} title={card.title} description={card.description} icon={<span>{card.icon}</span>} selected={watch('abuseType') === card.id} onSelect={(id) => setValue('abuseType', id)} />
              ))}
            </div>
            {abuseType === 'other' ? <textarea {...register('otherType')} className="w-full rounded-xl border border-slate-300 px-4 py-3" placeholder={language === 'en' ? 'Describe the other type' : 'ሌላ አይነት ይግለጹ'} /> : null}
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-4">
            <textarea {...register('description')} className="min-h-32 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder={language === 'en' ? 'What happened?' : 'ምን አጋጠመ?'} />
            {errors.description ? <p className="text-sm text-red-600">{language === 'en' ? 'Please describe the incident in at least 10 characters.' : 'እባክዎ ክስተቱን ቢያንስ 10 ቁምፊዎች ይግለጹ።'}</p> : null}
            <input {...register('location')} className="w-full rounded-xl border border-slate-300 px-4 py-3" placeholder={language === 'en' ? 'Location' : 'ቦታ'} />
            <input type="date" {...register('incidentDate')} className="w-full rounded-xl border border-slate-300 px-4 py-3" />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SelectionCard id="phone" title={language === 'en' ? 'Phone Call' : 'ስልክ'} description={language === 'en' ? 'Phone call contact' : 'ስልክ እየተደረገ'} icon={<Phone />} selected={watch('contactPreference') === 'phone'} onSelect={(id) => setValue('contactPreference', id)} />
              <SelectionCard id="text" title={language === 'en' ? 'Text Message' : 'የጽሁፍ መልዕክት'} description={language === 'en' ? 'Text message only (may be less secure)' : 'በጽሁፍ ብቻ'} icon={<MessageCircle />} selected={watch('contactPreference') === 'text'} onSelect={(id) => setValue('contactPreference', id)} />
              <SelectionCard id="email" title={language === 'en' ? 'Email' : 'ኢሜይል'} description={language === 'en' ? 'We can contact you by email' : 'በኢሜይል ማግኘት'} icon={<Mail />} selected={watch('contactPreference') === 'email'} onSelect={(id) => setValue('contactPreference', id)} />
              <SelectionCard id="no-contact" title={language === 'en' ? 'No Contact' : 'ምንም ግንኙነት የለም'} description={language === 'en' ? 'Submit anonymously' : 'ምስጠር ወይም አለመነጋገር'} icon={<EyeOff />} selected={watch('contactPreference') === 'no-contact'} onSelect={(id) => setValue('contactPreference', id)} />
            </div>

            {contactPreference === 'text' ? <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">⚠️ {language === 'en' ? 'TEXT ONLY' : '⚠️ በፅሁፍ ብቻ'}</div> : null}
            {contactPreference === 'phone' || contactPreference === 'email' || contactPreference === 'text' ? <input {...register('contactValue')} className="w-full rounded-xl border border-slate-300 px-4 py-3" placeholder={contactPreference === 'email' ? (language === 'en' ? 'Email address' : 'ኢሜይል አድራሻ') : (language === 'en' ? 'Phone number' : 'ስልክ ቁጥር')} /> : null}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="font-semibold">{language === 'en' ? 'Review your report' : 'ሪፖርትዎን ይገምግሙ'}</h2>
            <p><strong>{language === 'en' ? 'Abuse type' : 'የጥቃት አይነት'}:</strong> {watch('abuseType')}</p>
            <p><strong>{language === 'en' ? 'Description' : 'መግለጫ'}:</strong> {watch('description')}</p>
            <p><strong>{language === 'en' ? 'Location' : 'ቦታ'}:</strong> {watch('location')}</p>
            <p><strong>{language === 'en' ? 'Contact' : 'ግንኙነት'}:</strong> {watch('contactPreference')}</p>
          </div>
        ) : null}

        {stepError ? <p className="text-sm text-red-600">{stepError}</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex flex-wrap gap-3">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((value) => value - 1)} className="rounded-full border border-slate-300 px-5 py-3 font-semibold">
              {language === 'en' ? 'Back' : 'ተመለስ'}
            </button>
          ) : null}
          {step < 3 ? (
            <button type="button" onClick={() => void onNext()} className="rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white">
              {language === 'en' ? 'Next' : 'ቀጥል'}
            </button>
          ) : (
            <button type="submit" disabled={loading} className="rounded-full bg-emerald-600 px-5 py-3 font-semibold text-white disabled:opacity-50">
              {loading ? (language === 'en' ? 'Submitting...' : 'በማስገባት ላይ...') : (language === 'en' ? 'Submit report' : 'ሪፖርት አስገባ')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
