import { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import FormInput from '../components/common/FormInput';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { updateMe, changePassword } from '../services/api';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [pwError, setPwError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name || !/^[a-zA-Z\s]{2,}$/.test(profileForm.name)) { setProfileError('Name must be at least 2 letters'); return; }
    setSavingProfile(true); setProfileError(''); setProfileMsg('');
    try {
      const res = await updateMe(profileForm);
      setUser(res.data.user);
      localStorage.setItem('wl_user', JSON.stringify(res.data.user));
      setProfileMsg('Profile updated!');
    } catch (err) { setProfileError(err.response?.data?.message || 'Update failed'); }
    finally { setSavingProfile(false); }
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) { setPwError('New password must be at least 6 characters'); return; }
    if (pwForm.newPassword !== pwForm.confirm) { setPwError('Passwords do not match'); return; }
    setSavingPw(true); setPwError(''); setPwMsg('');
    try {
      await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwMsg('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { setPwError(err.response?.data?.message || 'Failed'); }
    finally { setSavingPw(false); }
  };

  return (
    <AppLayout>
      <PageHeader title="My Profile" subtitle="Manage your account" />
      <main style={{padding:'24px',maxWidth:'800px'}}>
        {/* Hero */}
        <div style={{background:'linear-gradient(135deg, #EFD3D7, #CBC0D3, #DEE2FF)',borderRadius:'24px',padding:'32px',marginBottom:'24px',display:'flex',alignItems:'center',gap:'24px',flexWrap:'wrap'}}>
          <div style={{width:'80px',height:'80px',borderRadius:'50%',background:'rgba(255,255,255,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px',fontWeight:900,color:'white',boxShadow:'0 4px 16px rgba(0,0,0,0.1)'}}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{fontSize:'22px',fontWeight:900,color:'#1e293b',margin:'0 0 4px'}}>{user?.name}</h2>
            <p style={{color:'#64748b',margin:0,fontSize:'14px'}}>{user?.email}</p>
            <div style={{marginTop:'8px'}}><StatusBadge status={user?.role} /></div>
          </div>
        </div>

        <div style={{display:'flex',flexWrap:'wrap',gap:'20px'}}>
          {/* Edit profile */}
          <div style={{flex:'2 1 340px',background:'white',borderRadius:'20px',padding:'24px',border:'1px solid #e2e8f0'}}>
            <h3 style={{fontSize:'16px',fontWeight:700,color:'#1e293b',margin:'0 0 20px'}}>Edit Profile</h3>
            {profileMsg && <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'10px',padding:'10px',color:'#059669',fontSize:'13px',marginBottom:'14px'}}>{profileMsg}</div>}
            {profileError && <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'10px',padding:'10px',color:'#dc2626',fontSize:'13px',marginBottom:'14px'}}>{profileError}</div>}
            <form onSubmit={handleProfileSubmit}>
              <FormInput label="Full Name" name="name" type="text" value={profileForm.name} onChange={e => setProfileForm(p => ({...p, name: e.target.value}))} required />
              <div style={{marginBottom:'16px'}}>
                <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}}>Bio</label>
                <textarea rows={3} name="bio" placeholder="Tell us about yourself..." value={profileForm.bio} onChange={e => setProfileForm(p => ({...p, bio: e.target.value}))}
                  style={{width:'100%',padding:'10px 14px',border:'1px solid #e2e8f0',borderRadius:'12px',fontSize:'14px',outline:'none',resize:'none',boxSizing:'border-box',fontFamily:"'Urbanist',sans-serif"}} />
              </div>
              <Button type="submit" loading={savingProfile} style={{borderRadius:'12px',padding:'10px 24px'}}>Save Changes</Button>
            </form>
          </div>

          {/* Change password */}
          <div style={{flex:'1 1 260px',background:'white',borderRadius:'20px',padding:'24px',border:'1px solid #e2e8f0'}}>
            <h3 style={{fontSize:'16px',fontWeight:700,color:'#1e293b',margin:'0 0 20px'}}>Change Password</h3>
            {pwMsg && <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'10px',padding:'10px',color:'#059669',fontSize:'13px',marginBottom:'14px'}}>{pwMsg}</div>}
            {pwError && <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'10px',padding:'10px',color:'#dc2626',fontSize:'13px',marginBottom:'14px'}}>{pwError}</div>}
            <form onSubmit={handlePwSubmit}>
              <FormInput label="Current Password" name="currentPassword" type="password" placeholder="••••••••" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({...p, currentPassword: e.target.value}))} required />
              <FormInput label="New Password" name="newPassword" type="password" placeholder="Min 6 characters" value={pwForm.newPassword} onChange={e => setPwForm(p => ({...p, newPassword: e.target.value}))} required />
              <FormInput label="Confirm New" name="confirm" type="password" placeholder="Repeat new password" value={pwForm.confirm} onChange={e => setPwForm(p => ({...p, confirm: e.target.value}))} required />
              <Button type="submit" loading={savingPw} style={{borderRadius:'12px',padding:'10px 24px',width:'100%'}}>Change Password</Button>
            </form>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
