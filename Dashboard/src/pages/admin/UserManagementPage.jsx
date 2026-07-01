import { Users, Shield, UserPlus, Edit2, Trash2, X, Save } from 'lucide-react';
import ChartCard from '../../components/ui/ChartCard';
import KPICard from '../../components/ui/KPICard';
import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [editingUser, setEditingUser] = useState(null); // null means "adding"
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          const mapped = data.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role || 'user',
            password: u.password || '',
            status: 'Active',
            lastLogin: 'Just now'
          }));
          setUsers(mapped);
          return;
        }
      } catch (err) {
        console.warn("Failed to fetch users from Supabase, using local fallback:", err.message);
      }
    }

    // Local storage fallback
    const stored = localStorage.getItem('agrishield_users');
    if (stored) {
      setUsers(JSON.parse(stored));
    } else {
      const defaultUsers = [
        { id: 'admin-1', name: 'System Admin', email: 'admin@agrishield.ai', password: 'admin123', role: 'admin', status: 'Active', lastLogin: 'Just now' },
        { id: '2', name: 'Dr. Jane Smith', email: 'jane.smith@fao.org', password: 'researcher123', role: 'researcher', status: 'Active', lastLogin: '2 hours ago' },
        { id: '3', name: 'John Doe', email: 'j.doe@policy.gov', password: 'user123', role: 'user', status: 'Inactive', lastLogin: '5 days ago' },
        { id: '4', name: 'Data Pipeline Bot', email: 'api-bot@agrishield.ai', password: 'bot123', role: 'system', status: 'Active', lastLogin: '10 mins ago' },
      ];
      localStorage.setItem('agrishield_users', JSON.stringify(defaultUsers));
      setUsers(defaultUsers);
    }
  };

  // Fetch users on mount
  useEffect(() => {
    loadUsers();
    
    // Listen for storage events to make it cross-tab reactive (for local fallback)
    window.addEventListener('storage', loadUsers);
    return () => window.removeEventListener('storage', loadUsers);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      if (isSupabaseConfigured()) {
        try {
          const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

          if (error) throw error;
        } catch (err) {
          console.error("Failed to delete user from Supabase:", err.message);
        }
      }

      // Update Local State
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      localStorage.setItem('agrishield_users', JSON.stringify(updated));
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'user' });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password || '',
      role: user.role
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingUser) {
        // EDIT MODE
        if (isSupabaseConfigured()) {
          const updateObj = { name: formData.name, role: formData.role };
          if (formData.password) {
            updateObj.password = formData.password;
          }
          const { error } = await supabase
            .from('users')
            .update(updateObj)
            .eq('id', editingUser.id);
          
          if (error) throw error;
        }

        // Edit in Local Storage fallback list
        const stored = localStorage.getItem('agrishield_users');
        if (stored) {
          const list = JSON.parse(stored);
          const updatedList = list.map(u => {
            if (u.id === editingUser.id || u.email === editingUser.email) {
              const editObj = { ...u, name: formData.name, role: formData.role };
              if (formData.password) editObj.password = formData.password;
              return editObj;
            }
            return u;
          });
          localStorage.setItem('agrishield_users', JSON.stringify(updatedList));
        }

      } else {
        // ADD MODE
        const newId = isSupabaseConfigured() ? undefined : `user-${Date.now()}`;
        
        if (isSupabaseConfigured()) {
          const { error } = await supabase
            .from('users')
            .insert([{ 
              name: formData.name, 
              email: formData.email, 
              password: formData.password || 'password123', 
              role: formData.role 
            }]);
          
          if (error) throw error;
        }

        // Add to Local Storage fallback list
        const stored = localStorage.getItem('agrishield_users') || '[]';
        const list = JSON.parse(stored);
        list.push({
          id: newId || `user-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          password: formData.password || 'password123',
          role: formData.role,
          status: 'Active',
          lastLogin: 'Just now'
        });
        localStorage.setItem('agrishield_users', JSON.stringify(list));
      }

      setIsModalOpen(false);
      await loadUsers(); // reload user list
    } catch (err) {
      alert(`Error saving user: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>User Management</h1>
          <p>Admin panel for managing system access and roles</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <UserPlus size={16} />
          Add User
        </button>
      </div>

      <div className="grid-row grid-cols-4" style={{ marginBottom: 24 }}>
        <KPICard icon={Users} label="Total Users" value={users.length} color="sky" trend={users.length > 4 ? users.length - 4 : 0} trendLabel="added" />
        <KPICard icon={Shield} label="Admins" value={users.filter(u => u.role === 'admin').length} color="purple" />
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
                      <button className="btn btn-ghost" style={{ padding: 6 }} onClick={() => openEditModal(u)}><Edit2 size={16} /></button>
                      <button className="btn btn-ghost" style={{ padding: 6, color: 'var(--accent-red)' }} onClick={() => handleDelete(u.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
        }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)', padding: 24, width: '90%', maxWidth: 450,
            boxShadow: 'var(--shadow-card), 0 20px 50px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4 }}>
              {editingUser ? 'Edit User details' : 'Add New User'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
              {editingUser ? 'Modify account status and access privileges' : 'Register a new account directly to the system'}
            </p>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)', padding: '10px 12px', color: 'var(--text-primary)',
                    fontSize: '0.9rem', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={!!editingUser}
                  style={{
                    width: '100%', background: editingUser ? 'rgba(255,255,255,0.02)' : 'var(--bg-secondary)', 
                    border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', 
                    padding: '10px 12px', color: editingUser ? 'var(--text-muted)' : 'var(--text-primary)',
                    fontSize: '0.9rem', outline: 'none', cursor: editingUser ? 'not-allowed' : 'text'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  {editingUser ? 'Password (leave blank to keep current)' : 'Password'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  placeholder={editingUser ? '••••••••' : 'Enter password'}
                  style={{
                    width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)', padding: '10px 12px', color: 'var(--text-primary)',
                    fontSize: '0.9rem', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>System Role</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)', padding: '10px 12px', color: 'var(--text-primary)',
                    fontSize: '0.9rem', outline: 'none'
                  }}
                >
                  <option value="user">User</option>
                  <option value="researcher">Researcher</option>
                  <option value="admin">Admin</option>
                  <option value="system">System Bot</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost"
                  style={{ border: '1px solid var(--border-subtle)' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary"
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
