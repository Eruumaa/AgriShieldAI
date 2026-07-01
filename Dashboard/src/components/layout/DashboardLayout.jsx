import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GeminiChatWidget from '../chat/GeminiChatWidget';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileOpen(false);
      }
    };
    
    // Set initial value
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <div className={`dashboard-layout ${collapsed && !isMobile ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Mobile Backdrop */}
      <div 
        className="mobile-backdrop" 
        onClick={() => setMobileOpen(false)}
      />
      
      <Sidebar 
        collapsed={collapsed && !isMobile} 
        onToggle={handleMenuClick} 
      />
      <div className="dashboard-main">
        <TopBar onMenuClick={handleMenuClick} />
        <div className="dashboard-content">
          <Outlet />
        </div>
        <GeminiChatWidget />
      </div>
    </div>
  );
}
