import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/explore', icon: '🌍', label: 'Explore Countries' },
  { to: '/trips', icon: '✈️', label: 'My Trips' },
  { to: '/profile', icon: '👤', label: 'Profile' },
];

export default function Sidebar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logoutUser(); navigate('/'); };

  return (
    <aside style={{width:'256px',minHeight:'100vh',background:'white',borderRight:'1px solid #e2e8f0',display:'flex',flexDirection:'column',position:'fixed',top:0,left:0,zIndex:50,boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
      <div style={{padding:'24px',borderBottom:'1px solid #e2e8f0'}}>
        <a href="/" style={{fontWeight:900,fontSize:'20px',color:'#1e293b',textDecoration:'none'}}>🌍 WanderLog</a>
      </div>
      <nav style={{flex:1,padding:'16px',display:'flex',flexDirection:'column',gap:'4px'}}>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} style={({isActive}) => ({
            display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',borderRadius:'12px',
            textDecoration:'none',fontSize:'14px',fontWeight:500,
            background: isActive ? 'linear-gradient(to right, rgba(239,211,215,0.6), rgba(222,226,255,0.6))' : 'transparent',
            color: isActive ? '#1e293b' : '#64748b',
            fontWeight: isActive ? 700 : 500,
          })}>
            <span>{item.icon}</span>{item.label}
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink to="/admin" style={({isActive}) => ({
            display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',borderRadius:'12px',
            textDecoration:'none',fontSize:'14px',
            background: isActive ? 'linear-gradient(to right, rgba(239,211,215,0.6), rgba(222,226,255,0.6))' : 'transparent',
            color: isActive ? '#636BAB' : '#636BAB', fontWeight: 600,
          })}>
            <span>🔐</span>Admin Panel
          </NavLink>
        )}
      </nav>
      <div style={{padding:'16px',borderTop:'1px solid #e2e8f0'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 12px',marginBottom:'8px'}}>
          <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#EFD3D7,#CBC0D3)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,color:'white',fontSize:'13px'}}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b'}}>{user?.name}</div>
            <div style={{fontSize:'11px',color:'#94a3b8'}}>{user?.email}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{width:'100%',padding:'8px',border:'1px solid #e2e8f0',borderRadius:'10px',background:'transparent',cursor:'pointer',fontSize:'13px',color:'#64748b'}}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
