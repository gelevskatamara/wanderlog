import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { SearchIcon, AdminIcon, WarningIcon } from '../components/common/Icons';
import { getAdminStats, getAdminUsers, updateUserRole, deleteUser } from '../services/api';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [roleModal, setRoleModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [saving, setSaving] = useState(false);

  // Initial load
  useEffect(() => {
    setLoading(true);
    Promise.all([getAdminStats(), getAdminUsers({})])
      .then(([sRes, uRes]) => { setStats(sRes.data.stats); setUsers(uRes.data.users); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Debounce — wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Search query changed — fetch only users table, not stats
  useEffect(() => {
    if (loading) return;
    setUsersLoading(true);
    getAdminUsers({ search: searchQuery })
      .then(res => setUsers(res.data.users))
      .catch(console.error)
      .finally(() => setUsersLoading(false));
  }, [searchQuery]);

  const load = () => {
    setLoading(true);
    Promise.all([getAdminStats(), getAdminUsers({ search: searchQuery })])
      .then(([sRes, uRes]) => { setStats(sRes.data.stats); setUsers(uRes.data.users); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleRoleUpdate = async (id, role) => {
    setSaving(true);
    try { await updateUserRole(id, { role }); setRoleModal(null); load(); }
    catch { alert('Failed to update role'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    setSaving(true);
    try { await deleteUser(id); setDeleteModal(null); load(); }
    catch { alert('Failed to delete user'); }
    finally { setSaving(false); }
  };

  const chartData = (stats?.topDestinations || []).slice(0, 6).map(d => ({ name: d._id, trips: d.count }));

  const statCards = [
    { label: 'Total Users',   value: stats?.totalUsers   ?? 0, color: 'text-primary',     bg: 'bg-primary-light/40' },
    { label: 'Total Trips',   value: stats?.totalTrips   ?? 0, color: 'text-blue-600',    bg: 'bg-blue-50' },
    { label: 'Total Reviews', value: stats?.totalReviews ?? 0, color: 'text-violet-600',  bg: 'bg-violet-50' },
    { label: 'Countries',     value: 195,                       color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Admin Panel"
        subtitle="Platform overview and management"
        action={
          <span className="badge badge-admin flex items-center gap-1"><AdminIcon className="w-3 h-3" /> Admin</span>
        }
      />
      <PageWrapper>
        {loading ? <LoadingSpinner /> : (
          <>
            {/* Stat cards */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
              {statCards.map(c => (
                <div key={c.label} className={`stat-card ${c.bg} border-0`}>
                  <div className={`text-2xl sm:text-3xl font-black ${c.color}`}>{c.value.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-1">{c.label}</div>
                </div>
              ))}
            </div>

            {/* Chart + roles */}
            <div className="flex flex-wrap gap-4 sm:gap-6 mb-6">
              <div className="card p-4 sm:p-6 flex-1 basis-full lg:basis-[400px]">
                <h2 className="text-sm sm:text-base font-bold text-slate-800 mb-4">Top Destinations</h2>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="trips" fill="#636BAB" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data yet</div>
                )}
              </div>

              <div className="card p-4 sm:p-6 flex-1 basis-full sm:basis-56">
                <h2 className="text-sm sm:text-base font-bold text-slate-800 mb-4">Users by Role</h2>
                <div className="flex flex-col gap-3">
                  {(stats?.usersByRole || []).map(r => (
                    <div key={r._id} className="flex items-center justify-between">
                      <StatusBadge status={r._id} />
                      <span className="font-bold text-slate-800 text-sm">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Users table */}
            <div className="card overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-sm sm:text-base font-bold text-slate-800">All Users</h2>
                <div className="relative w-full sm:w-52">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon className="w-3.5 h-3.5" /></span>
                  <input
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Search users..."
                    className="form-input pl-8 text-sm py-2"
                  />
                </div>
              </div>

              {/* Responsive table — horizontal scroll on mobile */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-soft-blue">
                      {['User', 'Role', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-t border-slate-50 hover:bg-soft-blue/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-soft-pink to-soft-purple flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {u.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 truncate max-w-[120px] sm:max-w-none">{u.name}</p>
                              <p className="text-xs text-slate-400 truncate max-w-[120px] sm:max-w-none">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={u.role} /></td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex gap-3">
                            <button onClick={() => setRoleModal(u)} className="text-xs text-primary font-semibold hover:underline">Edit Role</button>
                            <button onClick={() => setDeleteModal(u)} className="text-xs text-red-400 font-semibold hover:underline">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {usersLoading ? (
                  <tr><td colSpan={4} className="text-center py-8 text-slate-400 text-sm">Searching...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-slate-400 text-sm">No users found</td></tr>
                ) : null}
              </div>
            </div>
          </>
        )}
      </PageWrapper>

      {/* Role Modal */}
      {roleModal && (
        <Modal isOpen={!!roleModal} onClose={() => setRoleModal(null)} title="Change Role" maxWidth="max-w-xs">
          <p className="text-sm text-slate-500 mb-4">
            Change role for <strong>{roleModal.name}</strong>
          </p>
          <div className="flex flex-col gap-2">
            {['guest', 'user', 'admin'].map(r => (
              <button
                key={r}
                onClick={() => handleRoleUpdate(roleModal._id, r)}
                disabled={saving || roleModal.role === r}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                  roleModal.role === r
                    ? 'bg-primary text-white border-primary cursor-default'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-primary hover:text-primary'
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
                {roleModal.role === r && ' (current)'}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete User?" maxWidth="max-w-sm">
          <div className="text-center">
            <div className="flex justify-center mb-3 text-amber-500"><WarningIcon className="w-12 h-12" /></div>
            <p className="text-sm text-slate-500 mb-6">
              Delete <strong>{deleteModal.name}</strong> and all their data? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setDeleteModal(null)} className="flex-1">Cancel</Button>
              <Button variant="danger" loading={saving} onClick={() => handleDelete(deleteModal._id)} className="flex-1">Delete</Button>
            </div>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
