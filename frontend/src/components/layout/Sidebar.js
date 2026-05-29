import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardIcon, ExploreIcon, TripsIcon, ProfileIcon, AdminIcon } from '../common/Icons';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const navItems = [
  { to: '/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
  { to: '/explore',   icon: <ExploreIcon />,   label: 'Explore Countries' },
  { to: '/trips',     icon: <TripsIcon />,      label: 'My Trips' },
  { to: '/profile',   icon: <ProfileIcon />,    label: 'Profile' },
];

export default function Sidebar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const NavContent = () => (
    <>
      <div className="px-5 py-5 border-b border-slate-100">
        <a href="/" className="flex items-center gap-2 no-underline">
          <span className="text-xl font-black text-primary tracking-tight">🌍 WanderLog</span>
        </a>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              isActive ? 'nav-link-active' : 'nav-link hover:bg-slate-50'
            }
          >
            <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              isActive ? 'nav-link-active' : 'nav-link hover:bg-slate-50'
            }
          >
            <span className="w-5 h-5 flex-shrink-0 text-primary"><AdminIcon /></span>
            <span className="text-primary font-semibold">Admin Panel</span>
          </NavLink>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-soft-pink to-soft-purple flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden">
            {user?.avatar
              ? <img src={`${API_BASE}${user.avatar}`} alt="avatar" className="w-full h-full object-cover" />
              : user?.name?.[0]?.toUpperCase()
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-sm text-slate-500 hover:text-red-500 border border-slate-100 hover:border-red-100 rounded-xl py-2 transition-all duration-200 hover:bg-red-50"
        >
          Sign out
        </button>
      </div>
    </>
  );

  // Lock body scroll when mobile menu is open
  if (typeof document !== 'undefined') {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="app-sidebar hidden lg:flex flex-col">
        <NavContent />
      </aside>

      {/* Mobile top bar — z-[60] so it sits above everything except the drawer */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-white border-b border-slate-100 h-14 flex items-center justify-between px-4 shadow-sm">
        <a href="/" className="text-lg font-black text-primary">🌍 WanderLog</a>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-slate-50 transition-colors"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-slate-700 rounded-full transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Backdrop — z-[70] covers everything including the top bar */}
      <div
        className={`lg:hidden fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer — z-[80] sits on top of backdrop */}
      <aside className={`lg:hidden fixed top-0 left-0 z-[80] h-full w-64 bg-white flex flex-col shadow-2xl transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Drawer header with close button on the RIGHT edge of the drawer (left side of screen) */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
          <a href="/" className="text-lg font-black text-primary">🌍 WanderLog</a>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors text-sm font-bold"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                isActive ? 'nav-link-active' : 'nav-link hover:bg-slate-50'
              }
            >
              <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                isActive ? 'nav-link-active' : 'nav-link hover:bg-slate-50'
              }
            >
              <span className="w-5 h-5 flex-shrink-0 text-primary"><AdminIcon /></span>
              <span className="text-primary font-semibold">Admin Panel</span>
            </NavLink>
          )}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-soft-pink to-soft-purple flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-sm text-slate-500 hover:text-red-500 border border-slate-100 hover:border-red-100 rounded-xl py-2 transition-all duration-200 hover:bg-red-50"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
