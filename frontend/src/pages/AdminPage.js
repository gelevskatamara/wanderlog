import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import ConfirmModal from '../components/common/ConfirmModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { SearchIcon, AdminIcon } from '../components/common/Icons';
import { getAdminStats, getAdminUsers, updateUserRole, deleteUser, getAllTrips, deleteTrip } from '../services/api';

const TABS = ['overview', 'users', 'trips'];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tripSearch, setTripSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [roleModal, setRoleModal] = useState(null);
  const [deleteUserModal, setDeleteUserModal] = useState(null);
  const [deleteTripModal, setDeleteTripModal] = useState(null);
  const [saving, setSaving] = useState(false);

  // Initial load
  useEffect(() => {
    setLoading(true);
    Promise.all([getAdminStats(), getAdminUsers({}), getAllTrips()])
      .then(([sRes, uRes, tRes]) => {
        setStats(sRes.data.stats);
        setUsers(uRes.data.users);
        setTrips(tRes.data.trips);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Debounce user search
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (loading) return;
    setUsersLoading(true);
    getAdminUsers({ search: searchQuery })
      .then(res => setUsers(res.data.users))
      .catch(console.error)
      .finally(() => setUsersLoading(false));
  }, [searchQuery]);

  // Trip search
  const filteredTrips = trips.filter(t =>
    t.title?.toLowerCase().includes(tripSearch.toLowerCase()) ||
    t.destination?.toLowerCase().includes(tripSearch.toLowerCase()) ||
    t.userId?.name?.toLowerCase().includes(tripSearch.toLowerCase())
  );

  const handleRoleUpdate = async (id, role) => {
    setSaving(true);
    try { await updateUserRole(id, { role }); setRoleModal(null);
      const res = await getAdminUsers({ search: searchQuery });
      setUsers(res.data.users);
    } catch { alert('Failed to update role'); }
    finally { setSaving(false); }
  };

  const handleDeleteUser = async (id) => {
    setSaving(true);
    try { await deleteUser(id); setDeleteUserModal(null);
      const [uRes, tRes] = await Promise.all([getAdminUsers({}), getAllTrips()]);
      setUsers(uRes.data.users); setTrips(tRes.data.trips);
    } catch { alert('Failed to delete user'); }
    finally { setSaving(false); }
  };

  const handleDeleteTrip = async (id) => {
    setSaving(true);
    try { await deleteTrip(id); setDeleteTripModal(null);
      const [sRes, tRes] = await Promise.all([getAdminStats(), getAllTrips()]);
      setStats(sRes.data.stats); setTrips(tRes.data.trips);
    } catch { alert('Failed to delete trip'); }
    finally { setSaving(false); }
  };

  const chartData = (stats?.topDestinations || []).slice(0, 6).map(d => ({ name: d._id, trips: d.count }));

  const statCards = [
    { label: 'Total Users',   value: stats?.totalUsers   ?? 0, color: 'text-primary',     bg: 'bg-primary-light/40' },
    { label: 'Total Trips',   value: stats?.totalTrips   ?? 0, color: 'text-blue-600',    bg: 'bg-blue-50' },
    { label: 'Total Reviews', value: stats?.totalReviews ?? 0, color: 'text-violet-600',  bg: 'bg-violet-50' },
    { label: 'Countries',     value: 250,                       color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Admin Panel"
        subtitle="Platform overview and management"
        action={<span className="badge badge-admin flex items-center gap-1"><AdminIcon className="w-3 h-3" /> Admin</span>}
      />
      <PageWrapper>
        {loading ? <LoadingSpinner /> : (
          <>
            {/* Stat cards — always visible */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
              {statCards.map(c => (
                <div key={c.label} className={`stat-card ${c.bg} border-0`}>
                  <div className={`text-2xl sm:text-3xl font-black ${c.color}`}>{c.value.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-1">{c.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-slate-100 pb-0">
              {TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2.5 text-sm font-semibold transition-all duration-200 border-b-2 -mb-px ${
                    activeTab === t
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="flex flex-wrap gap-4 sm:gap-6">
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
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="card overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h2 className="text-sm sm:text-base font-bold text-slate-800">All Users ({users.length})</h2>
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
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-soft-blue">
                        {['User', 'Role', 'Joined', 'Actions'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {usersLoading ? (
                        <tr><td colSpan={4} className="text-center py-8 text-slate-400 text-sm">Searching...</td></tr>
                      ) : users.map(u => (
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
                              <button onClick={() => setDeleteUserModal(u)} className="text-xs text-red-400 font-semibold hover:underline">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {!usersLoading && users.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-8 text-slate-400 text-sm">No users found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Trips Tab */}
            {activeTab === 'trips' && (
              <div className="card overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h2 className="text-sm sm:text-base font-bold text-slate-800">All Trips ({trips.length})</h2>
                  <div className="relative w-full sm:w-52">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon className="w-3.5 h-3.5" /></span>
                    <input
                      value={tripSearch}
                      onChange={e => setTripSearch(e.target.value)}
                      placeholder="Search trips..."
                      className="form-input pl-8 text-sm py-2"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-soft-blue">
                        {['Trip', 'Owner', 'Destination', 'Status', 'Created', 'Actions'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTrips.map(t => (
                        <tr key={t._id} className="border-t border-slate-50 hover:bg-soft-blue/50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-slate-800 truncate max-w-[140px]">{t.title}</p>
                            <p className="text-xs text-slate-400">
                              {new Date(t.startDate).toLocaleDateString()} — {new Date(t.endDate).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-soft-pink to-soft-purple flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {t.userId?.name?.[0]?.toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-700 truncate max-w-[100px]">{t.userId?.name}</p>
                                <p className="text-xs text-slate-400 truncate max-w-[100px]">{t.userId?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600 whitespace-nowrap text-xs">{t.destination}</td>
                          <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={t.status} /></td>
                          <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <button onClick={() => setDeleteTripModal(t)} className="text-xs text-red-400 font-semibold hover:underline">Delete</button>
                          </td>
                        </tr>
                      ))}
                      {filteredTrips.length === 0 && (
                        <tr><td colSpan={6} className="text-center py-8 text-slate-400 text-sm">No trips found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </PageWrapper>

      {/* Role Modal */}
      {roleModal && (
        <Modal isOpen={!!roleModal} onClose={() => setRoleModal(null)} title="Change Role" maxWidth="max-w-xs">
          <p className="text-sm text-slate-500 mb-4">Change role for <strong>{roleModal.name}</strong></p>
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
                {r.charAt(0).toUpperCase() + r.slice(1)}{roleModal.role === r && ' (current)'}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Delete User Modal */}
      <ConfirmModal
        isOpen={!!deleteUserModal}
        onClose={() => setDeleteUserModal(null)}
        onConfirm={() => handleDeleteUser(deleteUserModal?._id)}
        title="Delete User?"
        message={`Delete ${deleteUserModal?.name} and all their data? This cannot be undone.`}
        confirmText="Delete"
        loading={saving}
      />

      {/* Delete Trip Modal */}
      <ConfirmModal
        isOpen={!!deleteTripModal}
        onClose={() => setDeleteTripModal(null)}
        onConfirm={() => handleDeleteTrip(deleteTripModal?._id)}
        title="Delete Trip?"
        message={`Delete "${deleteTripModal?.title}" by ${deleteTripModal?.userId?.name}? This cannot be undone.`}
        confirmText="Delete"
        loading={saving}
      />
    </AppLayout>
  );
}
