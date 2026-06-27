import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Globe2, BarChart3, Wheat, BrainCircuit,
  Lightbulb, TrendingUp, FileText, ChevronLeft, Shield, Users, Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Sidebar({ collapsed, onToggle }) {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { section: 'nav.overview' },
    { to: '/', icon: LayoutDashboard, label: 'nav.home' },
    { to: '/global-risk-map', icon: Globe2, label: 'nav.globalRiskMap' },
    { section: 'nav.analytics' },
    { to: '/country-analytics', icon: BarChart3, label: 'nav.countryAnalytics' },
    { to: '/commodity-analytics', icon: Wheat, label: 'nav.commodityAnalytics' },
    { section: 'nav.intelligence' },
    { to: '/ml-insights', icon: BrainCircuit, label: 'nav.mlInsights' },
    { to: '/recommendations', icon: Lightbulb, label: 'nav.recommendations' },
    { to: '/forecast', icon: TrendingUp, label: 'nav.forecast' },
    { section: 'nav.export' },
    { to: '/reports', icon: FileText, label: 'nav.reports' },
  ];

  if (isAdmin) {
    navItems.push(
      { section: 'nav.admin' },
      { to: '/admin/users', icon: Users, label: 'nav.userManagement' },
      { to: '/admin/logs', icon: Activity, label: 'nav.systemLogs' }
    );
  }

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <img src="/logo.svg" alt="Logo" style={{ width: 28, height: 28 }} />
        </div>
        <span className="sidebar-title" style={{ fontSize: '1.05rem', fontWeight: 700, whiteSpace: 'nowrap', transition: 'opacity 0.2s', opacity: collapsed ? 0 : 1 }}>
          AgriShield AI
        </span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if (item.section) {
            return (
              <div key={i} className="nav-section-title" style={{ opacity: collapsed ? 0 : 1 }}>
                {t(item.section)}
              </div>
            );
          }
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              title={t(item.label)}
            >
              <span className="nav-icon"><Icon size={18} /></span>
              <span className="nav-label" style={{ opacity: collapsed ? 0 : 1 }}>{t(item.label)}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border-subtle)' }}>
        <button className="toggle-btn" onClick={onToggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <ChevronLeft size={18} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
        </button>
      </div>
    </aside>
  );
}
