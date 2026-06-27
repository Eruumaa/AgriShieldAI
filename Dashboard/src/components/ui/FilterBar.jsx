import { Filter } from 'lucide-react';

export default function FilterBar({ filters, values, onChange }) {
  return (
    <div className="filter-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <Filter size={16} />
        <span>Filters</span>
      </div>
      {filters.map(f => (
        <select
          key={f.key}
          className="filter-select"
          value={values[f.key] || ''}
          onChange={e => onChange(f.key, e.target.value)}
          id={`filter-${f.key}`}
        >
          <option value="">{f.placeholder || `All ${f.label}`}</option>
          {f.options.map(opt => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
