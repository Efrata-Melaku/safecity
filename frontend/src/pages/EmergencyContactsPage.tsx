import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getResources } from '../services/api';
import type { ResourceItem } from '../types';

const sectionMeta: Record<string, { title: string; description: string; icon: string }> = {
  emergency_hotline: { title: 'Emergency Hotlines', description: 'Immediate assistance hotlines', icon: '??' },
  police: { title: 'Police', description: 'Police contact points', icon: '??' },
  hospitals: { title: 'Hospitals', description: 'Hospitals and treatment facilities', icon: '??' },
  legal_aid: { title: 'Legal Aid', description: 'Support for legal and case follow-up', icon: '??' },
  womens_support: { title: "Women's Support Services", description: 'Safe support and case management', icon: '??' },
};

export function EmergencyContactsPage() {
  const { language } = useLanguage();
  const [resources, setResources] = useState<ResourceItem[]>([]);

  useEffect(() => {
    getResources().then((response) => setResources(response.resources || [])).catch(() => setResources([]));
  }, []);

  const grouped = useMemo(() => {
    return resources.reduce<Record<string, ResourceItem[]>>((acc, resource) => {
      const key = resource.category || 'emergency_hotline';
      if (!acc[key]) acc[key] = [];
      acc[key].push(resource);
      return acc;
    }, {});
  }, [resources]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">{language === 'en' ? 'Emergency contacts' : '???? ??????'}</h1>
        <p className="mt-3 text-sm text-slate-600">{language === 'en' ? 'Current support contacts sourced from the backend.' : '???? ?? ???? ???? ???????'}</p>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([key, items]) => {
          const meta = sectionMeta[key] || { title: key, description: '', icon: '??' };
          return (
            <section key={key} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-50 p-3 text-xl">{meta.icon}</div>
                <div>
                  <h2 className="text-xl font-semibold">{language === 'en' ? meta.title : meta.title}</h2>
                  {meta.description ? <p className="text-sm text-slate-600">{language === 'en' ? meta.description : meta.description}</p> : null}
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {items.map((resource) => (
                  <div key={resource.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{resource.name}</div>
                        <div className="mt-1 text-sm text-slate-600">{resource.description}</div>
                      </div>
                      <div className="text-right text-sm text-emerald-700">
                        {resource.phone ? <div>{resource.phone}</div> : <div className="text-slate-500">No phone</div>}
                      </div>
                    </div>
                    {resource.email ? <div className="mt-2 text-sm text-slate-600">{resource.email}</div> : null}
                    {resource.address ? <div className="mt-1 text-sm text-slate-600">{resource.address}</div> : null}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}