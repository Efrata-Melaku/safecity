import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { archiveResource, createResource, getResources, restoreResource, updateResource } from '../services/api';
import type { ResourceItem } from '../types';

const emptyForm = {
  name: '',
  description: '',
  phone: '',
  alternativePhone: '',
  email: '',
  website: '',
  address: '',
  googleMapsLink: '',
  category: 'emergency_hotline',
  availability: '',
  workingDays: '',
  workingHours: '',
  priority: 'high',
  status: 'active',
  displayOrder: 0,
  isActive: true,
};

export function AdminResourcesPage() {
  const { language } = useLanguage();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [includeArchived, setIncludeArchived] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getResources(includeArchived);
      setResources(res.resources || []);
    } catch {
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetch();
  }, [includeArchived]);

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();
    return resources.filter((resource) => !query || [resource.name, resource.description || '', resource.category || '', resource.phone || ''].join(' ').toLowerCase().includes(query));
  }, [resources, search]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...form,
      displayOrder: Number(form.displayOrder),
      isActive: form.isActive,
    };

    if (editingId) {
      await updateResource(editingId, payload);
    } else {
      await createResource(payload);
    }
    setForm(emptyForm);
    setEditingId(null);
    await fetch();
  };

  const startEdit = (resource: ResourceItem) => {
    setEditingId(resource.id);
    setForm({
      ...emptyForm,
      ...resource,
      name: resource.name,
      description: resource.description || '',
      phone: resource.phone || '',
      alternativePhone: resource.alternativePhone || '',
      email: resource.email || '',
      website: resource.website || '',
      address: resource.address || '',
      googleMapsLink: resource.googleMapsLink || '',
      category: resource.category || 'emergency_hotline',
      availability: resource.availability || '',
      workingDays: resource.workingDays || '',
      workingHours: resource.workingHours || '',
      priority: resource.priority || 'high',
      status: resource.status || 'active',
      displayOrder: resource.displayOrder || 0,
      isActive: resource.isActive ?? true,
    });
  };

  const toggleArchive = async (resource: ResourceItem) => {
    if (resource.isActive === false) {
      await restoreResource(resource.id);
    } else {
      await archiveResource(resource.id);
    }
    await fetch();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">{language === 'en' ? 'Manage emergency resources' : '???? ???? ??????'}</h1>
        <p className="mt-2 text-sm text-slate-600">{language === 'en' ? 'Create, edit, and archive emergency contacts from the database.' : '????? ??? ??? ??????? ???? ?????? ?? ???? ?????'}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{editingId ? (language === 'en' ? 'Edit contact' : '???? ??????') : (language === 'en' ? 'Add contact' : '???? ???')}</h2>
            <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="text-sm text-slate-500">{language === 'en' ? 'Reset' : '??? ?????'}</button>
          </div>
          <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-xl border border-slate-200 p-3" placeholder={language === 'en' ? 'Name' : '??'} required />
          <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="min-h-24 w-full rounded-xl border border-slate-200 p-3" placeholder={language === 'en' ? 'Description' : '????'} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-xl border border-slate-200 p-3" placeholder={language === 'en' ? 'Phone' : '???'} />
            <input value={form.alternativePhone} onChange={(event) => setForm((current) => ({ ...current, alternativePhone: event.target.value }))} className="w-full rounded-xl border border-slate-200 p-3" placeholder={language === 'en' ? 'Alternative phone' : '???? ???'} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-xl border border-slate-200 p-3" placeholder={language === 'en' ? 'Email' : '????'} />
            <input value={form.website} onChange={(event) => setForm((current) => ({ ...current, website: event.target.value }))} className="w-full rounded-xl border border-slate-200 p-3" placeholder={language === 'en' ? 'Website' : '??? ??'} />
          </div>
          <input value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} className="w-full rounded-xl border border-slate-200 p-3" placeholder={language === 'en' ? 'Address' : '????'} />
          <input value={form.googleMapsLink} onChange={(event) => setForm((current) => ({ ...current, googleMapsLink: event.target.value }))} className="w-full rounded-xl border border-slate-200 p-3" placeholder={language === 'en' ? 'Google Maps link' : 'Google Maps ???'} />
          <div className="grid gap-3 sm:grid-cols-2">
            <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="w-full rounded-xl border border-slate-200 p-3">
              <option value="emergency_hotline">Emergency hotline</option>
              <option value="police">Police</option>
              <option value="hospitals">Hospitals</option>
              <option value="legal_aid">Legal aid</option>
              <option value="womens_support">Women's support</option>
            </select>
            <input value={form.displayOrder} onChange={(event) => setForm((current) => ({ ...current, displayOrder: Number(event.target.value) }))} type="number" className="w-full rounded-xl border border-slate-200 p-3" placeholder={language === 'en' ? 'Display order' : '????? ??? ????'} />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
              <Plus size={16} /> {editingId ? (language === 'en' ? 'Save changes' : '????? ?????') : (language === 'en' ? 'Create contact' : '???? ???')}
            </button>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={form.isActive} onChange={() => setForm((current) => ({ ...current, isActive: !current.isActive }))} />
              {language === 'en' ? 'Active' : '??'}
            </label>
          </div>
        </form>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">{language === 'en' ? 'Existing contacts' : '??? ??????'}</h2>
            <label className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm">
              <Search size={16} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-36 bg-transparent outline-none" placeholder={language === 'en' ? 'Search' : '???'} />
            </label>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={includeArchived} onChange={() => setIncludeArchived((value) => !value)} />
            {language === 'en' ? 'Show archived' : '????? ?????? ???'}
          </label>
          <div className="mt-4 space-y-3">
            {loading ? <div className="text-sm text-slate-600">Loading...</div> : filteredResources.map((resource) => (
              <div key={resource.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{resource.name}</div>
                    <div className="text-sm text-slate-600">{resource.description}</div>
                    <div className="mt-2 text-xs uppercase tracking-wide text-slate-500">{resource.category} · {resource.phone || '—'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => startEdit(resource)} className="rounded-full border border-slate-200 px-3 py-1 text-sm">Edit</button>
                    <button type="button" onClick={() => void toggleArchive(resource)} className="rounded-full border border-slate-200 px-3 py-1 text-sm">{resource.isActive === false ? 'Restore' : 'Archive'}</button>
                    <button type="button" className="rounded-full border border-rose-200 px-3 py-1 text-sm text-rose-600"><Trash2 size={14} className="mr-1 inline" />{language === 'en' ? 'Archive' : '????'}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminResourcesPage;