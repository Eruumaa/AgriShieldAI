import { Activity, Server, Database, AlertCircle } from 'lucide-react';
import ChartCard from '../../components/ui/ChartCard';
import KPICard from '../../components/ui/KPICard';

export default function SystemLogsPage() {
  const logs = [
    { id: 1, time: '10:42:05', level: 'INFO', service: 'FastAPI_ML', message: 'Model prediction cached for IDN' },
    { id: 2, time: '10:38:12', level: 'WARN', service: 'Auth', message: 'Failed login attempt from 192.168.1.104' },
    { id: 3, time: '10:15:00', level: 'INFO', service: 'DataSync', message: 'FAOSTAT daily sync completed successfully' },
    { id: 4, time: '09:01:22', level: 'ERROR', service: 'Supabase', message: 'Connection timeout on query idx_fsri' },
    { id: 5, time: '08:30:00', level: 'INFO', service: 'System', message: 'Daily backup generated (2.4GB)' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>System Health & Logs</h1>
        <p>Monitor backend services, database connections, and system events</p>
      </div>

      <div className="grid-row grid-cols-4" style={{ marginBottom: 24 }}>
        <KPICard icon={Activity} label="System Status" value="99.9%" color="emerald" trend={0} trendLabel="uptime" />
        <KPICard icon={Server} label="API Latency" value="124ms" color="sky" trend={-12} trendLabel="vs avg" />
        <KPICard icon={Database} label="DB Load" value="18%" color="amber" />
        <KPICard icon={AlertCircle} label="Error Rate" value="0.04%" color="red" />
      </div>

      <ChartCard title="Event Stream" subtitle="Live system logs from all services">
        <div style={{
          background: '#04060c',
          borderRadius: 'var(--radius-md)',
          padding: 16,
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          height: 400,
          overflowY: 'auto'
        }}>
          {logs.map(log => (
            <div key={log.id} style={{
              display: 'flex',
              gap: 16,
              padding: '8px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              color: log.level === 'ERROR' ? '#fca5a5' : log.level === 'WARN' ? '#fcd34d' : '#94a3b8'
            }}>
              <span style={{ opacity: 0.7, width: 70 }}>{log.time}</span>
              <span style={{ 
                width: 60, 
                fontWeight: 600,
                color: log.level === 'ERROR' ? '#ef4444' : log.level === 'WARN' ? '#f59e0b' : '#16db93'
              }}>[{log.level}]</span>
              <span style={{ width: 100, color: '#0ea5e9' }}>{log.service}</span>
              <span style={{ flex: 1 }}>{log.message}</span>
            </div>
          ))}
          <div style={{ padding: '8px 0', color: '#16db93', animation: 'pulse 2s infinite' }}>_</div>
        </div>
      </ChartCard>
    </div>
  );
}
