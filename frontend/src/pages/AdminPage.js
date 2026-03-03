import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getAdminStats, getAdminUsers, updateUserRole, deleteUser } from '../services/api';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [roleModal, setRoleModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getAdminStats(), getAdminUsers({ search })])
      .then(([sRes, uRes]) => { setStats(sRes.data.stats); setUsers(uRes.data.users); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const handleRoleUpdate = async (id, role) => {
    setSaving(true);
    try { await updateUserRole(id, { role }); setRoleModal(null); load(); } catch (err) { alert('Failed to update role'); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    setSaving(true);
    try { await deleteUser(id); setDeleteModal(null); load(); } catch (err) { alert('Failed to delete user'); } finally { setSaving(false); }
  };

  const chartData = (stats?.topDestinations || []).slice(0, 6).map(d => ({ name: d._id, trips: d.count }));

  if (loading) return <AppLayout><LoadingSpinner /></AppLayout>;

  const statCards = [
    { label:'Total Users', value: stats?.totalUsers ?? 0, color:'#636BAB' },
    { label:'Total Trips', value: stats?.totalTrips ?? 0, color:'#3b82f6' },
    { label:'Total Reviews', value: stats?.totalReviews ?? 0, color:'#8b5cf6' },
    { label:'Countries', value: 195, color:'#10b981' },
  ];

  return (
    <AppLayout>
      <PageHeader title="Admin Panel" subtitle="Platform overview and management"
        action={<span style={{fontSize:'12px',background:'rgba(99,107,171,0.1)',color:'#636BAB',padding:'4px 12px',borderRadius:'999px',fontWeight:600}}>🔐 Admin</span>} />
      <main style={{padding:'24px'}}>
        {/* Stats */}
        <div style={{display:'flex',flexWrap:'wrap',gap:'16px',marginBottom:'24px'}}>
          {statCards.map(c => (
            <div key={c.label} style={{flex:'1 1 140px',background:'white',borderRadius:'20px',padding:'20px',border:'1px solid #e2e8f0'}}>
              <div style={{fontSize:'28px',fontWeight:900,color:c.color}}>{c.value.toLocaleString()}</div>
              <div style={{fontSize:'13px',color:'#64748b',marginTop:'4px'}}>{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',flexWrap:'wrap',gap:'20px',marginBottom:'24px'}}>
          {/* Chart */}
          <div style={{flex:'2 1 400px',background:'white',borderRadius:'20px',padding:'24px',border:'1px solid #e2e8f0'}}>
            <h2 style={{fontSize:'16px',fontWeight:700,color:'#1e293b',margin:'0 0 20px'}}>Top Destinations</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{fontSize:11,fill:'#94a3b8'}} />
                  <YAxis tick={{fontSize:11,fill:'#94a3b8'}} allowDecimals={false} />
                  <Tooltip contentStyle={{borderRadius:'12px',border:'none',boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="trips" fill="#636BAB" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{height:'200px',display:'flex',alignItems:'center',justifyContent:'center',color:'#94a3b8',fontSize:'14px'}}>No data yet</div>
            )}
          </div>

          {/* Users by role */}
          <div style={{flex:'1 1 220px',background:'white',borderRadius:'20px',padding:'24px',border:'1px solid #e2e8f0'}}>
            <h2 style={{fontSize:'16px',fontWeight:700,color:'#1e293b',margin:'0 0 16px'}}>Users by Role</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {(stats?.usersByRole || []).map(r => (
                <div key={r._id} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <StatusBadge status={r._id} />
                  <span style={{fontWeight:700,color:'#1e293b'}}>{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Users table */}
        <div style={{background:'white',borderRadius:'20px',border:'1px solid #e2e8f0',overflow:'hidden'}}>
          <div style={{padding:'20px 24px',borderBottom:'1px solid #e2e8f0',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
            <h2 style={{fontSize:'16px',fontWeight:700,color:'#1e293b',margin:0}}>All Users</h2>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
              style={{padding:'8px 14px',border:'1px solid #e2e8f0',borderRadius:'12px',fontSize:'13px',outline:'none',width:'200px',fontFamily:"'Urbanist',sans-serif"}} />
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
              <thead>
                <tr style={{background:'#f8f7ff'}}>
                  {['User','Role','Joined','Actions'].map(h => (
                    <th key={h} style={{padding:'10px 16px',textAlign:'left',color:'#94a3b8',fontWeight:600,fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{borderTop:'1px solid #f1f5f9'}}>
                    <td style={{padding:'12px 16px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                        <div style={{width:'30px',height:'30px',borderRadius:'50%',background:'linear-gradient(135deg,#EFD3D7,#CBC0D3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700,color:'white',flexShrink:0}}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{fontWeight:600,color:'#1e293b'}}>{u.name}</div>
                          <div style={{color:'#94a3b8',fontSize:'12px'}}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{padding:'12px 16px'}}><StatusBadge status={u.role} /></td>
                    <td style={{padding:'12px 16px',color:'#64748b'}}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{padding:'12px 16px'}}>
                      <div style={{display:'flex',gap:'8px'}}>
                        <button onClick={() => setRoleModal(u)} style={{fontSize:'12px',color:'#636BAB',fontWeight:600,background:'none',border:'none',cursor:'pointer'}}>Edit Role</button>
                        <button onClick={() => setDeleteModal(u)} style={{fontSize:'12px',color:'#ef4444',fontWeight:600,background:'none',border:'none',cursor:'pointer'}}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <div style={{textAlign:'center',padding:'40px',color:'#94a3b8'}}>No users found</div>}
          </div>
        </div>
      </main>

      {/* Role Modal */}
      {roleModal && (
        <Modal isOpen={!!roleModal} onClose={() => setRoleModal(null)} title="Change Role" maxWidth="360px">
          <p style={{color:'#64748b',fontSize:'14px',marginBottom:'16px'}}>Change role for <strong>{roleModal.name}</strong></p>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {['guest','user','admin'].map(r => (
              <button key={r} onClick={() => handleRoleUpdate(roleModal._id, r)} disabled={saving || roleModal.role === r}
                style={{padding:'12px',borderRadius:'12px',border:'1px solid',fontSize:'14px',fontWeight:600,cursor:roleModal.role===r?'default':'pointer',fontFamily:"'Urbanist',sans-serif",
                  background: roleModal.role===r ? '#636BAB' : 'white', color: roleModal.role===r ? 'white' : '#64748b', borderColor: roleModal.role===r ? '#636BAB' : '#e2e8f0'}}>
                {r.charAt(0).toUpperCase()+r.slice(1)}{roleModal.role===r ? ' (current)' : ''}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete User?" maxWidth="380px">
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'48px',marginBottom:'12px'}}>⚠️</div>
            <p style={{color:'#64748b',fontSize:'14px',marginBottom:'24px'}}>Delete <strong>{deleteModal.name}</strong> and all their data? This cannot be undone.</p>
            <div style={{display:'flex',gap:'10px'}}>
              <Button variant="ghost" onClick={() => setDeleteModal(null)} style={{flex:1,borderRadius:'12px',padding:'12px'}}>Cancel</Button>
              <Button variant="danger" loading={saving} onClick={() => handleDelete(deleteModal._id)} style={{flex:1,borderRadius:'12px',padding:'12px'}}>Delete</Button>
            </div>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
