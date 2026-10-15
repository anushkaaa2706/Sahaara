import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Heart,
  Pill,
  Calendar,
  Users,
  Menu,
  X,
  User,
  FlaskConical,
} from 'lucide-react';
import { DEMO_USER } from '../data/demoData';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/health', label: 'Health', icon: Heart },
  { to: '/medicines', label: 'Medicines', icon: Pill },
  { to: '/appointments', label: 'Appointments', icon: Calendar },
  { to: '/care-circle', label: 'My Care Circle', icon: Users },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* ── Header ── */}
      <header className="app-header" role="banner">
        <div className="header-left">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>

          <div className="brand">
            <span className="brand-name">Sahaara</span>
            <span className="brand-tagline">Care, connected.</span>
          </div>
        </div>

        <div className="header-right">
          <span className="demo-badge" aria-label="This is demo data">
            <FlaskConical size={14} />
            Demo data
          </span>
          <span className="profile-indicator">
            <User size={18} />
            {DEMO_USER.role}
          </span>
        </div>
      </header>

      {/* ── Main area ── */}
      <div className="app-main">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="sidebar-backdrop"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Sidebar navigation */}
        <nav
          className={`sidebar${sidebarOpen ? ' open' : ''}`}
          role="navigation"
          aria-label="Main navigation"
        >
          <ul className="nav-list">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `nav-item${isActive ? ' active' : ''}`
                  }
                  onClick={closeSidebar}
                  end={to === '/'}
                  aria-current={location.pathname === to ? 'page' : undefined}
                >
                  <Icon />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Page content */}
        <main id="main-content" className="app-content" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}
