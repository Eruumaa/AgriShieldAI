import { useState, useEffect } from 'react';
import {
  Globe2, Wheat, Activity, AlertTriangle, TrendingUp, ShieldCheck,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from 'recharts';
import KPICard from '../components/ui/KPICard';
import ChartCard from '../components/ui/ChartCard';
import RiskBadge, { getRiskColor } from '../components/ui/RiskBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { fetchGlobalSummary, fetchFSRIData } from '../lib/api';

const RISK_COLORS = {
  'Very Safe': '#16db93',
  'Safe': '#22c55e',
  'Medium': '#f59e0b',
  'High Risk': '#f97316',
  'Critical': '#ef4444',
};

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

export default function HomePage() {
  const [summary, setSummary] = useState(null);
  const [fsriData, setFsriData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchGlobalSummary(), fetchFSRIData()])
      .then(([s, f]) => { setSummary(s); setFsriData(f); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard data..." />;

  // KPI data
  const latestYear = summary?.years?.length ? Math.max(...summary.years) : 2013;
  const latestData = fsriData.filter(r => r.Year === latestYear);
  const highRiskCount = latestData.filter(r => r.FSRI >= 50).length;

  // Risk distribution pie
  const pieData = summary?.category_counts
    ? Object.entries(summary.category_counts).map(([name, value]) => ({ name, value }))
    : [];

  // Average FSRI by year line
  const years = [...new Set(fsriData.map(r => r.Year))].sort();
  const avgByYear = years.map(y => {
    const yearData = fsriData.filter(r => r.Year === y);
    return {
      year: y,
      avgFSRI: parseFloat((yearData.reduce((s, r) => s + r.FSRI, 0) / yearData.length).toFixed(2)),
    };
  });

  // Top 10 highest risk countries (latest year)
  const topRisk = [...latestData]
    .sort((a, b) => b.FSRI - a.FSRI)
    .slice(0, 10)
    .map(r => ({ name: r.Country.length > 18 ? r.Country.substring(0, 16) + '…' : r.Country, fsri: parseFloat(r.FSRI.toFixed(1)), category: r.FSRI_Category, fullName: r.Country }));

  // Category distribution over years
  const categoryByYear = years.map(y => {
    const yearData = fsriData.filter(r => r.Year === y);
    const row = { year: y };
    ['Very Safe', 'Safe', 'Medium', 'High Risk', 'Critical'].forEach(cat => {
      row[cat] = yearData.filter(r => r.FSRI_Category === cat).length;
    });
    return row;
  });

  return (
    <div>
      <div className="page-header">
        <h1>Food Security Dashboard</h1>
        <p>Global food security risk intelligence - powered by AI</p>
      </div>

      {/* KPI Cards */}
      <div className="grid-row grid-cols-4" style={{ marginBottom: 24 }}>
        <KPICard icon={Globe2} label="Total Countries" value={summary?.countries || 0} color="sky" trend={2.1} trendLabel="coverage" />
        <KPICard icon={Wheat} label="Avg FSRI Score" value={summary?.average_fsri || 0} color="emerald" trend={-3.2} trendLabel="vs last year" />
        <KPICard icon={AlertTriangle} label="High Risk Countries" value={highRiskCount} color="red" trend={1.5} trendLabel="vs last year" />
        <KPICard icon={ShieldCheck} label="Latest Data Year" value={latestYear} color="purple" raw />
      </div>

      {/* Charts Row 1 */}
      <div className="grid-row grid-cols-2" style={{ marginBottom: 24 }}>
        <ChartCard title="Risk Distribution" subtitle={`${latestYear} - ${latestData.length} countries`}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                animationBegin={200}
                animationDuration={1000}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={RISK_COLORS[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: -8 }}>
            {pieData.map(entry => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: RISK_COLORS[entry.name] }} />
                <span style={{ color: 'var(--text-secondary)' }}>{entry.name}</span>
                <span style={{ color: 'var(--text-heading)', fontWeight: 600 }}>{entry.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Average FSRI Trend" subtitle="Global average food security risk index">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={avgByYear}>
              <defs>
                <linearGradient id="fsriGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16db93" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#16db93" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="avgFSRI" stroke="#16db93" strokeWidth={2.5} dot={{ fill: '#16db93', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#16db93' }} name="Avg FSRI" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid-row grid-cols-2" style={{ marginBottom: 24 }}>
        <ChartCard title="Top 10 Highest Risk Countries" subtitle={`Year ${latestYear}`}>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={topRisk} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div style={{
                    background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 10, padding: '10px 14px', fontSize: '0.8rem',
                  }}>
                    <p style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 4 }}>{d.fullName}</p>
                    <p style={{ color: getRiskColor(d.category) }}>FSRI: {d.fsri}</p>
                    <p style={{ color: 'var(--text-muted)' }}>{d.category}</p>
                  </div>
                );
              }} />
              <Bar dataKey="fsri" radius={[0, 6, 6, 0]} animationDuration={1200}>
                {topRisk.map(entry => (
                  <Cell key={entry.name} fill={getRiskColor(entry.category)} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Risk Category Distribution by Year" subtitle="Countries per risk level across years">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={categoryByYear}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {['Very Safe', 'Safe', 'Medium', 'High Risk', 'Critical'].map(cat => (
                <Bar key={cat} dataKey={cat} stackId="a" fill={RISK_COLORS[cat]} radius={cat === 'Critical' ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent data table */}
      <ChartCard title="Country Risk Overview" subtitle={`Latest data - ${latestYear}`}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Country</th>
                <th>FSRI Score</th>
                <th>Risk Level</th>
                <th>Production</th>
                <th>Population (K)</th>
                <th>Self-Sufficiency</th>
              </tr>
            </thead>
            <tbody>
              {latestData.sort((a, b) => b.FSRI - a.FSRI).slice(0, 15).map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{row.Country}</td>
                  <td style={{ fontWeight: 700, color: getRiskColor(row.FSRI_Category) }}>{row.FSRI.toFixed(1)}</td>
                  <td><RiskBadge category={row.FSRI_Category} /></td>
                  <td>{row.Production ? Number(row.Production).toLocaleString() : '-'}</td>
                  <td>{row.Population ? Number(row.Population).toLocaleString() : '-'}</td>
                  <td>{row.Self_Sufficiency_Ratio ? (row.Self_Sufficiency_Ratio * 100).toFixed(1) + '%' : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
