import { useState, useEffect, useMemo } from 'react';
import {
  Factory, TrendingDown, TrendingUp, Users, Leaf, ShieldAlert,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
} from 'recharts';
import KPICard from '../components/ui/KPICard';
import ChartCard from '../components/ui/ChartCard';
import RiskBadge, { getRiskColor } from '../components/ui/RiskBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchFSRIData, fetchCleanData } from '../lib/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10, padding: '10px 14px', fontSize: '0.8rem',
    }}>
      <p style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</p>
      ))}
    </div>
  );
};

export default function CountryAnalyticsPage() {
  const { t } = useLanguage();
  const [fsriData, setFsriData] = useState([]);
  const [cleanData, setCleanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    Promise.all([fetchFSRIData(), fetchCleanData()])
      .then(([f, c]) => { setFsriData(f); setCleanData(c); })
      .finally(() => setLoading(false));
  }, []);

  const countries = useMemo(() => [...new Set(fsriData.map(r => r.Country))].sort(), [fsriData]);

  useEffect(() => {
    if (countries.length && !selected) setSelected(countries[0]);
  }, [countries, selected]);

  const countryFSRI = useMemo(() =>
    fsriData.filter(r => r.Country === selected).sort((a, b) => a.Year - b.Year).map(r => ({ ...r, RiskScore: 100 - r.FSRI })),
    [fsriData, selected]
  );

  const countryClean = useMemo(() =>
    cleanData.filter(r => r.Country === selected).sort((a, b) => a.Year - b.Year),
    [cleanData, selected]
  );

  const latest = countryFSRI[countryFSRI.length - 1];
  const latestClean = countryClean[countryClean.length - 1];
  const prev = countryFSRI.length >= 2 ? countryFSRI[countryFSRI.length - 2] : null;

  // Radar data
  const radarData = latest ? [
    { metric: 'Food Availability', value: Math.min(100, (latest.Food_Availability_Index / 20)), fullMark: 100 },
    { metric: 'Self-Sufficiency', value: (latest.Self_Sufficiency_Ratio * 100), fullMark: 100 },
    { metric: 'Production Stability', value: (latest.Production_Stability_Index * 100), fullMark: 100 },
    { metric: 'Risk Score', value: latest.RiskScore, fullMark: 100 },
    { metric: 'Population Density', value: Math.min(100, latest.Population / 1000), fullMark: 100 },
  ] : [];

  // Trade data
  const tradeData = countryClean.map(r => ({
    year: r.Year,
    Production: r.Production,
    Imports: r.Imports,
    Exports: r.Exports,
  }));

  if (loading) return <LoadingSpinner text={t('ui.loading')} />;

  const getSHAPExplanations = (latest, prev) => {
    const reasons = [];
    if (!latest || !prev) return ["Data historis tidak cukup untuk analisis XAI."];
    
    if (latest.Production < prev.Production) reasons.push("Produksi beras turun");
    if (latestClean && countryClean[countryClean.length - 2] && latestClean.Imports > countryClean[countryClean.length - 2].Imports) reasons.push("Impor meningkat");
    if (latest.Population > prev.Population) reasons.push("Populasi meningkat");
    
    if (latest.RiskScore > 50) reasons.push("Curah hujan ekstrem");
    else reasons.push("Iklim stabil");

    return reasons;
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1>{t('analytics.title')}</h1>
          <p>{t('analytics.subtitle')}</p>
        </div>
        <select
          className="filter-select"
          value={selected}
          onChange={e => setSelected(e.target.value)}
          id="country-selector"
          style={{ minWidth: 220 }}
        >
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {latest && (
        <>
          {/* KPI Cards */}
          <div className="grid-row grid-cols-4" style={{ marginBottom: 24 }}>
            <KPICard icon={ShieldAlert} label={t('home.table.score')} value={latest.RiskScore} color={latest.RiskScore < 40 ? 'emerald' : latest.RiskScore < 60 ? 'amber' : 'red'}
              trend={prev ? ((latest.RiskScore - prev.RiskScore) / prev.RiskScore * 100) : undefined} trendLabel="vs prior year" />
            <KPICard icon={Factory} label={t('home.table.production')} value={latestClean?.Production || latest.Production} color="sky"
              trend={prev ? ((latest.Production - prev.Production) / prev.Production * 100) : undefined} />
            <KPICard icon={Users} label={t('home.table.population')} value={latest.Population} color="purple" />
            <KPICard icon={Leaf} label={t('home.table.selfSufficiency')} value={`${(latest.Self_Sufficiency_Ratio * 100).toFixed(1)}%`} color="emerald" />
          </div>

          {/* Explainable AI Section */}
          <ChartCard title={t('analytics.shap')} subtitle={t('analytics.shapSub')} style={{ marginBottom: 24, borderLeft: '4px solid var(--accent-sky)' }}>
             <h3 style={{ fontSize: '1.1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                {t('analytics.why')} {selected} {t('analytics.haveStatus')} <RiskBadge category={latest.FSRI_Category} />?
             </h3>
             <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>{t('analytics.shapExplains')}</p>
             <ul style={{ paddingLeft: 24, color: 'var(--text-primary)' }}>
               {getSHAPExplanations(latest, prev).map((reason, i) => (
                 <li key={i} style={{ marginBottom: 4 }}>{reason}</li>
               ))}
             </ul>
             <div style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
               {t('analytics.notBlackBox')}
             </div>
          </ChartCard>

          {/* Charts Row 1 */}
          <div className="grid-row grid-cols-2" style={{ marginBottom: 24 }}>
            <ChartCard title={t('analytics.riskTrend')} subtitle={`${selected} - ${countryFSRI[0]?.Year} to ${latest.Year}`}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={countryFSRI}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="Year" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="RiskScore" stroke="#ef4444" strokeWidth={2.5}
                    dot={{ fill: '#ef4444', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} name="Risk Score" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title={t('analytics.profile')} subtitle="Multi-dimensional food security assessment">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fill: '#64748b', fontSize: 10 }} domain={[0, 100]} axisLine={false} />
                  <Radar name={selected} dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Production / Trade chart */}
          <ChartCard title={t('analytics.trade')} subtitle={`${selected} - Historical trend`} style={{ marginBottom: 24 }}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={tradeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1e6 ? (v/1e6).toFixed(0)+'M' : v >= 1e3 ? (v/1e3).toFixed(0)+'K' : v} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
                <Bar dataKey="Production" fill="#16db93" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Imports" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Exports" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Data table */}
          <ChartCard title={t('analytics.histData')} subtitle="Year-by-year Risk records">
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>{t('home.table.score')}</th>
                    <th>Category</th>
                    <th>{t('home.table.production')}</th>
                    <th>{t('home.table.population')}</th>
                    <th>{t('home.table.selfSufficiency')}</th>
                    <th>Food Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {countryFSRI.map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{row.Year}</td>
                      <td style={{ fontWeight: 700, color: getRiskColor(row.FSRI_Category) }}>{row.RiskScore.toFixed(1)}</td>
                      <td><RiskBadge category={row.FSRI_Category} /></td>
                      <td>{Number(row.Production).toLocaleString()}</td>
                      <td>{Number(row.Population).toLocaleString()}</td>
                      <td>{(row.Self_Sufficiency_Ratio * 100).toFixed(1)}%</td>
                      <td>{row.Food_Availability_Index.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </>
      )}
    </div>
  );
}
