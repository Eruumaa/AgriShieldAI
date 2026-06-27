export default function LoadingSpinner({ size = 36, text = 'Loading...' }) {
  return (
    <div className="spinner-container">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div className="spinner" style={{ width: size, height: size }} />
        {text && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{text}</span>}
      </div>
    </div>
  );
}

export function SkeletonCard({ height = 200 }) {
  return (
    <div className="card" style={{ height, padding: 0 }}>
      <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)' }} />
    </div>
  );
}
