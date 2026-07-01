import { useState } from 'react';
import { User, Mail, Shield, Key, Save, AlertCircle, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import ChartCard from '../components/ui/ChartCard';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image must be less than 2MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      if (isSupabaseConfigured() && user?.id) {
        const updateData = { name, avatar_url: avatarUrl };
        if (password) {
          updateData.password = password;
        }

        const { error } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', user.id);

        if (error) throw error;
      }

      // Update local storage session
      const updatedUser = { ...user, name, avatar_url: avatarUrl };
      setUser(updatedUser);
      localStorage.setItem('agrishield_session', JSON.stringify(updatedUser));

      // Update agrishield_users list
      const storedUsers = localStorage.getItem('agrishield_users');
      if (storedUsers) {
        const usersList = JSON.parse(storedUsers);
        const updatedList = usersList.map(u => {
          if (u.id === user.id || u.email === user.email) {
            const up = { ...u, name, avatar_url: avatarUrl };
            if (password) up.password = password;
            return up;
          }
          return u;
        });
        localStorage.setItem('agrishield_users', JSON.stringify(updatedList));
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header">
        <h1>Your Profile</h1>
        <p>Manage your account settings and credentials</p>
      </div>

      {message.text && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          background: message.type === 'success' ? 'var(--accent-emerald-dim)' : 'var(--accent-red-dim)',
          color: message.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-red)',
          border: `1px solid ${message.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-red)'}44`,
          marginBottom: 24,
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={18} />
          <span>{message.text}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
        {/* Profile Card */}
        <ChartCard title="User Card">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px 0' }}>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <div style={{
                width: 90, height: 90, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-sky))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem', fontWeight: 800, color: '#060913',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  initial
                )}
              </div>
              <label style={{
                position: 'absolute', bottom: -5, right: -5,
                width: 32, height: 32, background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-primary)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                transition: 'all 0.2s'
              }} className="hover-scale">
                <Camera size={16} />
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
              </label>
            </div>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 4px 0', fontWeight: 700 }}>{user?.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 16px 0' }}>{user?.email}</p>

            <span style={{
              padding: '6px 14px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700,
              background: user?.role === 'admin' ? 'var(--accent-purple-dim)' : 'var(--accent-emerald-dim)',
              color: user?.role === 'admin' ? 'var(--accent-purple)' : 'var(--accent-emerald)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {user?.role || 'User'}
            </span>
          </div>
        </ChartCard>

        {/* Edit Form */}
        <ChartCard title="Edit Account Settings">
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                <User size={16} /> Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                <Mail size={16} /> Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  cursor: 'not-allowed',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '12px 0 4px 0' }} />

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                <Key size={16} /> New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter new password"
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {password && (
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                  <Key size={16} /> Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  style={{
                    width: '100%',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ alignSelf: 'flex-end', marginTop: 12 }}>
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </ChartCard>
      </div>
    </div>
  );
}
