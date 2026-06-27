import { useState } from 'react';
import { BrainCircuit, Award, Target, Zap } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  ScatterChart, Scatter, ZAxis,
} from 'recharts';
import KPICard from '../components/ui/KPICard';
import ChartCard from '../components/ui/ChartCard';
import { mockData } from '../data/mockData';

const COLORS = ['#16db93', '#0ea5e9', '#f59e0b', '#a855f7', '#ef4444'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10, padding: '10px 14px', fontSize: '0.8rem',
    }}>
      <p style={{ color: '#e2e8f0', fontWeight: 600 }}>{d.feature || d.model}</p>
      {d.importance !== undefined && <p style={{ color: '#16db93' }}>Importance: {(d.importance * 100).toFixed(1)}%</p>}
      {d.accuracy !== undefined && <p style={{ color: '#0ea5e9' }}>Accuracy: {(d.accuracy * 100).toFixed(1)}%</p>}
    </div>
  );
};

export default function MLInsightsPage() {
  const [modelType, setModelType] = useState('classifier');
  const { featureImportance, modelComparison, confusionMatrix } = mockData;

  const classifiers = modelComparison.filter(m => m.type === 'classifier');
  const regressors = modelComparison.filter(m => m.type === 'regressor');
  const activeModels = modelType === 'classifier' ? classifiers : regressors;

  const bestClassifier = classifiers[0];
  const bestRegressor = regressors[0];

  return (
    <div>
      <div className="page-header">
        <h1>ML Insights</h1>
        <p>Machine learning model performance, feature importance & explainability</p>
      </div>

      {/* KPI */}
      <div className="grid-row grid-cols-4" style={{ marginBottom: 24 }}>
        <KPICard icon={BrainCircuit} label="Best Classifier" value={`${(bestClassifier.accuracy * 100).toFixed(1)}%`} color="emerald" />
        <KPICard icon={Target} label="Best Regressor R²" value={bestRegressor.r2.toFixed(3)} color="sky" />
        <KPICard icon={Award} label="Selected Model" value="LightGBM" color="purple" />
        <KPICard icon={Zap} label="Total Features" value={featureImportance.length} color="amber" />
      </div>

      {/* Feature Importance */}
      <ChartCard title="Feature Importance" subtitle="SHAP-based feature contribution ranking" style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={460}>
          <BarChart data={[...featureImportance].reverse()} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => (v * 100).toFixed(0) + '%'} />
            <YAxis type="category" dataKey="feature" width={180} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="importance" name="Importance" radius={[0, 6, 6, 0]} animationDuration={1200}>
              {[...featureImportance].reverse().map((entry, i) => (
                <Cell key={i} fill={`hsl(${160 + i * 8}, 70%, ${55 - i * 1.5}%)`} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Model Comparison */}
      <div className="grid-row grid-cols-2" style={{ marginBottom: 24 }}>
        <ChartCard
          title="Model Comparison"
          subtitle="Performance metrics across models"
          actions={
            <div style={{ display: 'flex', gap: 4 }}>
              <button className={`btn ${modelType === 'classifier' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setModelType('classifier')} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Classifier</button>
              <button className={`btn ${modelType === 'regressor' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setModelType('regressor')} style={{ padding: '6px 12px', fontSize: '0.78rem' }}>Regressor</button>
            </div>
          }
        >
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Model</th>
                  {modelType === 'classifier' ? (
                    <><th>Accuracy</th><th>Precision</th><th>Recall</th><th>F1</th></>
                  ) : (
                    <><th>R²</th><th>RMSE</th><th>MAE</th></>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeModels.map((m, i) => (
                  <tr key={m.model} style={i === 0 ? { background: 'rgba(22,219,147,0.06)' } : {}}>
                    <td style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {i === 0 && <span style={{ color: '#16db93', fontSize: '0.7rem' }}>★ BEST</span>}
                      {m.model}
                    </td>
                    {modelType === 'classifier' ? (
                      <>
                        <td style={{ color: '#16db93', fontWeight: 600 }}>{(m.accuracy * 100).toFixed(1)}%</td>
                        <td>{(m.precision * 100).toFixed(1)}%</td>
                        <td>{(m.recall * 100).toFixed(1)}%</td>
                        <td>{(m.f1 * 100).toFixed(1)}%</td>
                      </>
                    ) : (
                      <>
                        <td style={{ color: '#0ea5e9', fontWeight: 600 }}>{m.r2.toFixed(3)}</td>
                        <td>{m.rmse.toFixed(2)}</td>
                        <td>{m.mae.toFixed(2)}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Confusion Matrix */}
        <ChartCard title="Confusion Matrix" subtitle="LightGBM classifier - Predicted vs Actual">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: 8 }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px 10px', color: 'var(--text-muted)', fontSize: '0.7rem', textAlign: 'center' }}></th>
                  {confusionMatrix.labels.map(l => (
                    <th key={l} style={{ padding: '8px 6px', color: 'var(--text-secondary)', fontSize: '0.68rem', textAlign: 'center', fontWeight: 600 }}>
                      {l}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {confusionMatrix.matrix.map((row, ri) => (
                  <tr key={ri}>
                    <td style={{ padding: '8px 10px', color: 'var(--text-secondary)', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {confusionMatrix.labels[ri]}
                    </td>
                    {row.map((val, ci) => {
                      const isDiag = ri === ci;
                      const maxVal = Math.max(...row);
                      const opacity = val > 0 ? 0.15 + (val / maxVal) * 0.65 : 0.03;
                      return (
                        <td
                          key={ci}
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            fontWeight: isDiag ? 700 : 400,
                            color: isDiag ? '#16db93' : val > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                            background: isDiag
                              ? `rgba(22, 219, 147, ${opacity})`
                              : val > 0
                                ? `rgba(239, 68, 68, ${opacity * 0.6})`
                                : 'rgba(255,255,255,0.02)',
                            borderRadius: 6,
                            fontSize: '0.85rem',
                          }}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 16, justifyContent: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: 'rgba(22,219,147,0.4)', marginRight: 6 }} />
              Correct predictions
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: 'rgba(239,68,68,0.3)', marginRight: 6 }} />
              Misclassifications
            </span>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
