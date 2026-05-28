import { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/common/Button';
import FormInput from '../components/common/FormInput';
import FormTextarea from '../components/common/FormTextarea';
import Alert from '../components/common/Alert';
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
    if (!profileForm.name || !/^[a-zA-Z\s]{2,}$/.test(profileForm.name)) {
      setProfileError('Name must be at least 2 letters'); return;
    }
    setSavingProfile(true); setProfileError(''); setProfileMsg('');
    try {
      const res = await updateMe(profileForm);
      setUser(res.data.user);
      localStorage.setItem('wl_user', JSON.stringify(res.data.user));
      setProfileMsg('Profile updated successfully!');
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
      setPwMsg('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { setPwError(err.response?.data?.message || 'Failed'); }
    finally { setSavingPw(false); }
  };

  return (
    <AppLayout>
      <PageHeader title="My Profile" subtitle="Manage your account" />
      <PageWrapper>

        {/* Hero */}
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-soft-pink via-soft-purple to-primary-light p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/40 flex items-center justify-center text-2xl sm:text-3xl font-black text-white shadow-md flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">{user?.name}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>
            <div className="mt-2"><StatusBadge status={user?.role} /></div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-6">

          {/* Edit profile */}
          <div className="card p-4 sm:p-6 flex-1 basis-full lg:basis-[360px]">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-5">Edit Profile</h3>
            <Alert type="success" message={profileMsg} />
            <Alert type="error" message={profileError} />
            <form onSubmit={handleProfileSubmit}>
              <FormInput
                label="Full Name" name="name" type="text"
                value={profileForm.name}
                onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                required
              />
              <FormTextarea
                label="Bio" name="bio" rows={3}
                placeholder="Tell us about yourself..."
                value={profileForm.bio} maxLength={300}
                onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
              />
              <Button type="submit" loading={savingProfile} className="w-full sm:w-auto">
                Save Changes
              </Button>
            </form>
          </div>

          {/* Change password */}
          <div className="card p-4 sm:p-6 flex-1 basis-full lg:basis-64">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-5">Change Password</h3>
            <Alert type="success" message={pwMsg} />
            <Alert type="error" message={pwError} />
            <form onSubmit={handlePwSubmit}>
              <FormInput
                label="Current Password" name="currentPassword" type="password"
                placeholder="••••••••"
                value={pwForm.currentPassword}
                onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                required
              />
              <FormInput
                label="New Password" name="newPassword" type="password"
                placeholder="Min 6 characters"
                value={pwForm.newPassword}
                onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                required
              />
              <FormInput
                label="Confirm New Password" name="confirm" type="password"
                placeholder="Repeat new password"
                value={pwForm.confirm}
                onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                required
              />
              <Button type="submit" loading={savingPw} className="w-full">
                Change Password
              </Button>
            </form>
          </div>

        </div>
      </PageWrapper>
    </AppLayout>
  );
}
