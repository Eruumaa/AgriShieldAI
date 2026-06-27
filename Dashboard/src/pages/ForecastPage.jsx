import { useState, useMemo } from 'react';
import { TrendingUp, Calendar, Cpu, BarChart3 } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, Cell,
} from 'recharts';
import KPICard from '../components/ui/KPICard';
import ChartCard from '../components/ui/ChartCard';
import RiskBadge, { getRiskColor } from '../components/ui/RiskBadge';
import { mockData } from '../data/mockData';
import { postPrediction } from '../lib/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10, padding: '10px 14px', fontSize: '0.8rem',
    }}>
      <p style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</p>
      ))}
    </div>
  );
};

function getFSRICat(score) {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'High Risk';
  if (score >= 30) return 'Medium';
  if (score >= 20) return 'Safe';
  return 'Very Safe';
}

export default function ForecastPage() {
  const [selectedCountry, setSelectedCountry] = useState('Indonesia');
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const countries = useMemo(() => [...new Set(mockData.fsriData.map(r => r.Country))].sort(), []);

  // Historical FSRI for selected country
  const historical = useMemo(() =>
    mockData.fsriData
      .filter(r => r.Country === selectedCountry)
      .sort((a, b) => a.Year - b.Year),
    [selectedCountry]
  );

  // Generate forecast data (simple extrapolation for demo)
  const forecastYears = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
  const lastFSRI = historical.length > 0 ? historical[historical.length - 1].FSRI : 30;
  const trend = historical.length >= 2 ? (historical[historical.length - 1].FSRI - historical[historical.length - 2].FSRI) / historical[historical.length - 2].FSRI : 0;

  const forecastData = forecastYears.map((y, i) => ({
    Year: y,
    FSRI: parseFloat((lastFSRI * (1 + trend * 0.5) + Math.sin(i * 0.5) * 2 - i * 0.15).toFixed(2)),
    type: 'forecast',
  }));

  // Combined chart data
  const chartData = [
    ...historical.map(r => ({ Year: r.Year, Historical: r.FSRI, Forecast: null })),
    { Year: historical[historical.length - 1]?.Year, Historical: lastFSRI, Forecast: lastFSRI },
    ...forecastData.map(r => ({ Year: r.Year, Historical: null, Forecast: r.FSRI })),
  ];

  // Handle prediction
  const handlePredict = async () => {
    setPredicting(true);
    const latestClean = mockData.cleanData.find(r => r.Country === selectedCountry && r.Year === 2013);
    const latestFeature = mockData.featureData.find(r => r.Country === selectedCountry && r.Year === 2013);
    const features = {};
    mockData.featureList.forEach(f => {
      features[f] = latestFeature?.[f] ?? latestClean?.[f] ?? 0;
    });
    const result = await postPrediction(features);
    setPrediction(result);
    setPredicting(false);
  };

  // Probability chart data
  const probData = prediction?.FSRI_Category_Probabilities
    ? Object.entries(prediction.FSRI_Category_Probabilities).map(([name, value]) => ({
        name,
        probability: parseFloat((value * 100).toFixed(1)),
      }))
    : [];

  const RISK_COLORS_MAP = {
    'Very Safe': '#16db93', 'Safe': '#22c55e', 'Medium': '#f59e0b', 'High Risk': '#f97316', 'Critical': '#ef4444',
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1>Forecast & Prediction</h1>
          <p>AI-powered food security forecasting with risk prediction</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <select className="filter-select" value={selectedCountry} onChange={e => { setSelectedCountry(e.target.value); setPrediction(null); }} id="forecast-country-selector">
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn btn-primary" onClick={handlePredict} disabled={predicting} id="predict-btn">
            <Cpu size={16} />
            {predicting ? 'Predicting...' : 'Run Prediction'}
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid-row grid-cols-4" style={{ marginBottom: 24 }}>
        <KPICard icon={BarChart3} label="Current FSRI" value={lastFSRI} color={lastFSRI < 30 ? 'emerald' : lastFSRI < 50 ? 'amber' : 'red'} />
        <KPICard icon={TrendingUp} label="Forecast 2030" value={forecastData[forecastData.length - 1]?.FSRI || 0} color="sky" />
        <KPICard icon={Calendar} label="Data Range" value="2002–2030" color="purple" />
        {prediction && <KPICard icon={Cpu} label="Predicted Category" value={prediction.FSRI_Category} color={prediction.FSRI_Category === 'Safe' || prediction.FSRI_Category === 'Very Safe' ? 'emerald' : 'red'} />}
        {!prediction && <KPICard icon={Cpu} label="Prediction" value="Run prediction →" color="amber" />}
      </div>

      {/* Forecast Chart */}
      <ChartCard title="FSRI Forecast" subtitle={`${selectedCountry} - Historical + Projected`} style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="Year" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
            <Line type="monotone" dataKey="Historical" stroke="#16db93" strokeWidth={2.5} dot={{ fill: '#16db93', r: 3 }} name="Historical FSRI" connectNulls={false} />
            <Line type="monotone" dataKey="Forecast" stroke="#0ea5e9" strokeWidth={2} strokeDasharray="8 4" dot={{ fill: '#0ea5e9', r: 3 }} name="Forecasted FSRI" connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Prediction Results */}
      {prediction && (
        <div className="grid-row grid-cols-2" style={{ marginBottom: 24 }}>
          <ChartCard title="Prediction Result" subtitle="AI model output">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '24px 0' }}>
              <div style={{
                width: 140, height: 140, borderRadius: '50%',
                background: `conic-gradient(${getRiskColor(prediction.FSRI_Category)} ${prediction.FSRI}%, rgba(255,255,255,0.05) 0)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 110, height: 110, borderRadius: '50%', background: 'var(--bg-secondary)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: getRiskColor(prediction.FSRI_Category) }}>{prediction.FSRI.toFixed(1)}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>FSRI</span>
                </div>
              </div>
              <RiskBadge category={prediction.FSRI_Category} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center', maxWidth: 300 }}>
                Based on the current features for {selectedCountry}, the AI model predicts a <strong style={{ color: getRiskColor(prediction.FSRI_Category) }}>{prediction.FSRI_Category}</strong> risk level.
              </p>
            </div>
          </ChartCard>

          <ChartCard title="Category Probabilities" subtitle="Model confidence per risk category">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={probData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => v + '%'} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="probability" name="Probability %" radius={[6, 6, 0, 0]} animationDuration={800}>
                  {probData.map(entry => (
                    <Cell key={entry.name} fill={RISK_COLORS_MAP[entry.name] || '#94a3b8'} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
