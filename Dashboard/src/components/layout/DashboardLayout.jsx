import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import GeminiChatWidget from '../chat/GeminiChatWidget';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`dashboard-layout ${collapsed ? 'collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="dashboard-main">
        <TopBar onMenuClick={() => setCollapsed(c => !c)} />
        <div className="dashboard-content">
          <Outlet />
        </div>
        <GeminiChatWidget />
      </div>
    </div>
  );
}
