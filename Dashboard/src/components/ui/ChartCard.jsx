export default function ChartCard({ title, subtitle, children, actions, className = '', style = {} }) {
  return (
    <div className={`card chart-card animate-in ${className}`} style={style}>
      <div className="chart-header">
        <div>
          <div className="chart-title">{title}</div>
          {subtitle && <div className="chart-subtitle">{subtitle}</div>}
        </div>
        {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
      </div>
      <div className="chart-body">
        {children}
      </div>
    </div>
  );
}
