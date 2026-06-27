import { useEffect, useRef, useState } from 'react';

export default function KPICard({ icon: Icon, label, value, trend, trendLabel, color = 'emerald', raw = false }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  const isNumeric = !isNaN(numericValue) && !raw;

  useEffect(() => {
    if (!isNumeric) { setDisplayValue(value); return; }
    let frame;
    const duration = 1200;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(numericValue * eased);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [numericValue, isNumeric, value]);

  const formatValue = (v) => {
    if (!isNumeric) return v;
    if (numericValue >= 1_000_000) return (v / 1_000_000).toFixed(1) + 'M';
    if (numericValue >= 1_000) return (v / 1_000).toFixed(numericValue >= 10_000 ? 0 : 1) + 'K';
    if (numericValue < 1 && numericValue > 0) return v.toFixed(2);
    if (Number.isInteger(numericValue)) return Math.round(v).toLocaleString();
    return v.toFixed(1);
  };

  return (
    <div ref={ref} className={`card kpi-card ${color} animate-in`}>
      {Icon && (
        <div className="kpi-icon">
          <Icon size={22} />
        </div>
      )}
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">{formatValue(displayValue)}</span>
      {trend !== undefined && (
        <span className={`kpi-trend ${trend >= 0 ? 'up' : 'down'}`}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(1)}%
          {trendLabel && <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 4 }}>{trendLabel}</span>}
        </span>
      )}
    </div>
  );
}
