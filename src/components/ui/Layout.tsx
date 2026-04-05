import React, { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Receipt, Wallet, Sun, Moon } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';

export const Layout = () => {
  const { role, setRole, theme, toggleTheme } = useFinanceStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar glass-panel animate-entry">
        <div className="logo-container">
          <h2 className="flex items-center justify-center gap-2">
            <Wallet className="w-6 h-6" /> FinDash
          </h2>
        </div>
        
        <nav className="nav-menu">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-item flex items-center gap-3 ${isActive ? 'active' : ''}`}
            end
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </NavLink>
          <NavLink 
            to="/transactions" 
            className={({ isActive }) => `nav-item flex items-center gap-3 ${isActive ? 'active' : ''}`}
          >
            <Receipt className="w-5 h-5" /> Transactions
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="flex justify-end items-center gap-4 p-2 animate-entry delay-1">
          <button 
            className="flex items-center gap-2 py-2 px-4 rounded-xl transition-colors text-xs font-medium"
            style={{ 
              backgroundColor: 'var(--icon-bg)', 
              color: 'var(--text-secondary)', 
              border: '1px solid var(--panel-border)' 
            }}
            onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')}
          >
            Role: <span style={{ color: 'var(--text-heading)' }}>{role === 'admin' ? 'Admin' : 'Viewer'}</span>
          </button>

          <div className="theme-switch-wrapper" style={{ width: 'max-content' }}>
            <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            <div 
              className="theme-switch-track" 
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              style={{ marginLeft: '12px' }}
            >
              <div className="theme-switch-handle">
                <Sun className="sun-icon" />
                <Moon className="moon-icon" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <Outlet />
      </main>
    </div>
  );
};
