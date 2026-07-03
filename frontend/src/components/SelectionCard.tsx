import React from 'react';

interface SelectionCardProps {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onSelect: (id: string) => void;
}

export function SelectionCard({ id, title, description, icon, selected, onSelect }: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`group flex w-full cursor-pointer flex-col items-start gap-3 rounded-2xl border p-4 text-left transition hover:shadow-md focus:outline-none focus:ring-2 ${
        selected ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white'
      }`}
      aria-pressed={selected}
    >
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-slate-100 p-2 text-slate-700">{icon}</div>
          <div>
            <div className="font-semibold">{title}</div>
            {description ? <div className="mt-1 text-sm text-slate-500">{description}</div> : null}
          </div>
        </div>
        <div className={`ml-4 rounded-full p-1 ${selected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
          {selected ? '✓' : ''}
        </div>
      </div>
    </button>
  );
}

export default SelectionCard;
