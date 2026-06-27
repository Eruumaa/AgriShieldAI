import { useState, useEffect, useMemo } from 'react';
import { Package, TrendingUp, Globe2 } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Treemap, Legend,
} from 'recharts';
import KPICard from '../components/ui/KPICard';
import ChartCard from '../components/ui/ChartCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { fetchCleanData } from '../lib/api';
import { mockData } from '../data/mockData';

const COLORS = ['#16db93', '#0ea5e9', '#f59e0b', '#a855f7', '#ef4444', '#22c55e', '#f97316', '#06b6d4', '#ec4899', '#84cc16'];

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

const CustomTreemapContent = ({ x, y, width, height, name, value, index }) => {
  if (width < 40 || height < 30) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} rx={4} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
      {width > 60 && height > 40 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={600}>{name}</text>
          <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={10}>
            {value >= 1e9 ? (value / 1e9).toFixed(1) + 'B' : value >= 1e6 ? (value / 1e6).toFixed(0) + 'M' : value >= 1e3 ? (value / 1e3).toFixed(0) + 'K' : value}
          </text>
        </>
      )}
    </g>
  );
};

export default function CommodityAnalyticsPage() {
  const [cleanData, setCleanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComm, setSelectedComm] = useState('');

  useEffect(() => {
    fetchCleanData().then(d => { setCleanData(d); }).finally(() => setLoading(false));
  }, []);

  const commodities = mockData.commodities;
  useEffect(() => {
    if (commodities.length && !selectedComm) setSelectedComm(commodities[0].commodity_name);
  }, [commodities, selectedComm]);

  // Aggregate data by country for treemap (latest year)
  const latestYear = useMemo(() => Math.max(...cleanData.map(r => r.Year)), [cleanData]);
  const latestData = useMemo(() => cleanData.filter(r => r.Year === latestYear), [cleanData, latestYear]);

  // Top 10 producers
  const topProducers = useMemo(() =>
    [...latestData].sort((a, b) => b.Production - a.Production).slice(0, 10).map((r, i) => ({
      name: r.Country.length > 20 ? r.Country.substring(0, 18) + '…' : r.Country,
      fullName: r.Country,
      production: r.Production,
      color: COLORS[i % COLORS.length],
    })),
    [latestData]
  );

  // Production trend by year (global total)
  const years = useMemo(() => [...new Set(cleanData.map(r => r.Year))].sort(), [cleanData]);
  const trendData = useMemo(() => years.map(y => {
    const yearData = cleanData.filter(r => r.Year === y);
    return {
      year: y,
      production: yearData.reduce((s, r) => s + r.Production, 0),
      imports: yearData.reduce((s, r) => s + r.Imports, 0),
      exports: yearData.reduce((s, r) => s + r.Exports, 0),
    };
  }), [cleanData, years]);

  // Treemap data
  const treemapData = topProducers.map(r => ({ name: r.name, size: r.production }));

  // Import/Export comparison
  const tradeComparison = useMemo(() =>
    topProducers.map(r => {
      const d = latestData.find(d => d.Country === r.fullName);
      return {
        name: r.name,
        imports: d?.Imports || 0,
        exports: d?.Exports || 0,
      };
    }),
    [topProducers, latestData]
  );

  const totalProd = latestData.reduce((s, r) => s + r.Production, 0);
  const totalImports = latestData.reduce((s, r) => s + r.Imports, 0);
  const totalExports = latestData.reduce((s, r) => s + r.Exports, 0);

  if (loading) return <LoadingSpinner text="Loading commodity data..." />;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1>Commodity Analytics</h1>
          <p>Global agricultural commodity production and trade analysis</p>
        </div>
        <select
          className="filter-select"
          value={selectedComm}
          onChange={e => setSelectedComm(e.target.value)}
          id="commodity-selector"
        >
          {commodities.map(c => <option key={c.id} value={c.commodity_name}>{c.commodity_name} - {c.category}</option>)}
        </select>
      </div>

      {/* KPI */}
      <div className="grid-row grid-cols-3" style={{ marginBottom: 24 }}>
        <KPICard icon={Package} label="Total Production" value={totalProd} color="emerald" trend={4.2} trendLabel="annual growth" />
        <KPICard icon={TrendingUp} label="Total Imports" value={totalImports} color="sky" trend={2.8} />
        <KPICard icon={Globe2} label="Total Exports" value={totalExports} color="amber" trend={5.1} />
      </div>

      {/* Charts */}
      <div className="grid-row grid-cols-2" style={{ marginBottom: 24 }}>
        <ChartCard title="Global Production Trend" subtitle="Total production by year">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => (v/1e9).toFixed(0)+'B'} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
              <Line type="monotone" dataKey="production" stroke="#16db93" strokeWidth={2} name="Production" dot={false} />
              <Line type="monotone" dataKey="imports" stroke="#0ea5e9" strokeWidth={2} name="Imports" dot={false} />
              <Line type="monotone" dataKey="exports" stroke="#f59e0b" strokeWidth={2} name="Exports" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 10 Producers" subtitle={`Year ${latestYear}`}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1e9 ? (v/1e9).toFixed(0)+'B' : (v/1e6).toFixed(0)+'M'} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="production" name="Production" radius={[0, 6, 6, 0]}>
                {topProducers.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.8} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid-row grid-cols-2" style={{ marginBottom: 24 }}>
        <ChartCard title="Production Distribution" subtitle="Treemap of top producers">
          <ResponsiveContainer width="100%" height={300}>
            <Treemap
              data={treemapData}
              dataKey="size"
              nameKey="name"
              content={<CustomTreemapContent />}
              animationDuration={800}
            />
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Import vs Export" subtitle="Top producers comparison">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tradeComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} angle={-35} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1e6 ? (v/1e6).toFixed(0)+'M' : (v/1e3).toFixed(0)+'K'} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
              <Bar dataKey="imports" fill="#0ea5e9" name="Imports" radius={[4, 4, 0, 0]} />
              <Bar dataKey="exports" fill="#f59e0b" name="Exports" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
