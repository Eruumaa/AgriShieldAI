import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, Menu, LogOut, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const pageTitles = {
  '/dashboard': 'nav.home',
  '/global-risk-map': 'nav.globalRiskMap',
  '/country-analytics': 'nav.countryAnalytics',
  '/commodity-analytics': 'nav.commodityAnalytics',
  '/ml-insights': 'nav.mlInsights',
  '/recommendations': 'nav.recommendations',
  '/forecast': 'nav.forecast',
  '/reports': 'nav.reports',
  '/profile': 'nav.profile',
  '/admin/users': 'nav.userManagement',
  '/admin/logs': 'nav.systemLogs',
};

export default function TopBar({ onMenuClick }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const currentPageKey = pageTitles[location.pathname] || 'Dashboard';
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="toggle-btn" onClick={onMenuClick} style={{ display: 'none' }} id="mobile-menu-btn">
          <Menu size={20} />
        </button>
        <div className="breadcrumb">
          <span>Dashboard</span>
          <span className="separator">/</span>
          <span className="current">{t(currentPageKey)}</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="search-box" id="global-search">
          <Search size={16} />
          <input type="text" placeholder={t('topbar.search')} />
        </div>
        <button className="topbar-icon-btn" onClick={toggleLanguage} title="Toggle Language (ID/EN)" style={{ width: 'auto', padding: '0 12px', gap: 6, fontWeight: 600 }}>
          <Globe size={16} />
          {lang.toUpperCase()}
        </button>
        <button className="topbar-icon-btn" id="notifications-btn" title="Notifications">
          <Bell size={18} />
        </button>
        <Link
          to="/profile"
          style={{
            width: 34, height: 34, borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-sky))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: 700, color: '#060913', cursor: 'pointer',
            textDecoration: 'none',
            overflow: 'hidden'
          }}
          title={user?.name || "User"}
        >
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            initial
          )}
        </Link>
        <button className="topbar-icon-btn" onClick={logout} title="Logout" style={{ marginLeft: 4 }}>
          <LogOut size={16} style={{ color: 'var(--accent-red)' }} />
        </button>
      </div>
    </div>
  );
}
