import { Users, Shield, UserPlus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import ChartCard from '../../components/ui/ChartCard';
import KPICard from '../../components/ui/KPICard';

export default function UserManagementPage() {
  const users = [
    { id: 1, name: 'System Admin', email: 'admin@agrishield.ai', role: 'admin', status: 'Active', lastLogin: 'Just now' },
    { id: 2, name: 'Dr. Jane Smith', email: 'jane.smith@fao.org', role: 'researcher', status: 'Active', lastLogin: '2 hours ago' },
    { id: 3, name: 'John Doe', email: 'j.doe@policy.gov', role: 'user', status: 'Inactive', lastLogin: '5 days ago' },
    { id: 4, name: 'Data Pipeline Bot', email: 'api-bot@agrishield.ai', role: 'system', status: 'Active', lastLogin: '10 mins ago' },
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>User Management</h1>
          <p>Admin panel for managing system access and roles</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={16} />
          Add User
        </button>
      </div>

      <div className="grid-row grid-cols-4" style={{ marginBottom: 24 }}>
        <KPICard icon={Users} label="Total Users" value={142} color="sky" trend={12} trendLabel="this month" />
        <KPICard icon={Shield} label="Admins" value={4} color="purple" />
      </div>

      <ChartCard title="System Users" subtitle="Manage active sessions and roles">
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                  <td>
                    <span style={{
                      padding: '4px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600,
                      background: u.role === 'admin' ? 'var(--accent-purple-dim)' : 'var(--accent-emerald-dim)',
                      color: u.role === 'admin' ? 'var(--accent-purple)' : 'var(--accent-emerald)',
                      textTransform: 'capitalize'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: u.status === 'Active' ? '#16db93' : '#64748b' }} />
                      {u.status}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.lastLogin}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost" style={{ padding: 6 }}><Edit2 size={16} /></button>
                      <button className="btn btn-ghost" style={{ padding: 6, color: 'var(--accent-red)' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
