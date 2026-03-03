import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import TripCard from '../components/common/TripCard';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getTrips, createTrip, deleteTrip } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TABS = ['all', 'planned', 'ongoing', 'completed'];

const validate = (v) => {
  const e = {};
  if (!v.title || v.title.length < 3) e.title = 'Title must be at least 3 characters';
  if (!v.destination || !/^[a-zA-Z\s]{2,}$/.test(v.destination)) e.destination = 'Valid country name required';
  if (!v.startDate) e.startDate = 'Required';
  if (!v.endDate) e.endDate = 'Required';
  if (v.startDate && v.endDate && v.endDate < v.startDate) e.endDate = 'Must be after start date';
  return e;
};

export default function MyTripsPage() {
  const [trips, setTrips] = useState([]);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title:'', destination:'', startDate:'', endDate:'', description:'', status:'planned' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  const { user } = useAuth();

  const fetch = () => {
    setLoading(true);
    const params = {};
    if (tab !== 'all') params.status = tab;
    if (search) params.search = search;
    getTrips(params).then(res => setTrips(res.data.trips)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [tab, search]);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaving(true); setApiError('');
    try {
      await createTrip(form);
      setModal(false);
      setForm({ title:'', destination:'', startDate:'', endDate:'', description:'', status:'planned' });
      fetch();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create trip');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    try { await deleteTrip(id); fetch(); } catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <AppLayout>
      <PageHeader title="My Trips" subtitle={`${trips.length} trips`}
        action={user?.role !== 'guest' ? <Button onClick={() => setModal(true)}>+ New Trip</Button> : null} />
      <main style={{padding:'24px'}}>
        {/* Filters */}
        <div style={{background:'white',borderRadius:'20px',padding:'16px 20px',border:'1px solid #e2e8f0',marginBottom:'24px',display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'12px'}}>
          <div style={{display:'flex',gap:'4px'}}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{padding:'8px 16px',borderRadius:'10px',border:'none',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:"'Urbanist',sans-serif",transition:'all 0.2s',
                  background: tab===t ? '#636BAB' : 'transparent', color: tab===t ? 'white' : '#94a3b8'}}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
          <input value={search} onChange={e => { setSearch(e.target.value); }} placeholder="Search trips..."
            style={{padding:'8px 14px',border:'1px solid #e2e8f0',borderRadius:'12px',fontSize:'13px',outline:'none',width:'200px',fontFamily:"'Urbanist',sans-serif"}} />
        </div>

        {loading ? <LoadingSpinner /> : (
          <div style={{display:'flex',flexWrap:'wrap',gap:'20px'}}>
            {trips.map(t => (
              <div key={t._id} style={{flex:'1 1 280px',maxWidth:'360px'}}>
                <TripCard trip={t} onDelete={handleDelete} />
              </div>
            ))}
            {trips.length === 0 && (
              <div style={{width:'100%',textAlign:'center',padding:'60px',color:'#94a3b8'}}>
                <div style={{fontSize:'48px',marginBottom:'12px'}}>✈️</div>
                <p>No trips found.</p>
                <Button onClick={() => setModal(true)}>Plan your first trip</Button>
              </div>
            )}
            {/* Add card */}
            {user?.role !== 'guest' && (
              <div onClick={() => setModal(true)}
                style={{flex:'1 1 280px',maxWidth:'360px',minHeight:'200px',border:'2px dashed #e2e8f0',borderRadius:'20px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#94a3b8',transition:'all 0.2s',gap:'8px'}}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#636BAB'; e.currentTarget.style.color='#636BAB'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.color='#94a3b8'; }}>
                <span style={{fontSize:'36px'}}>✈️</span>
                <span style={{fontWeight:600,fontSize:'14px'}}>Plan a New Trip</span>
              </div>
            )}
          </div>
        )}
      </main>

      <Modal isOpen={modal} onClose={() => { setModal(false); setErrors({}); setApiError(''); }} title="New Trip ✈️">
        <form onSubmit={handleSubmit}>
          {apiError && <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'10px',padding:'10px',color:'#dc2626',fontSize:'13px',marginBottom:'14px'}}>{apiError}</div>}
          <FormInput label="Trip Title" name="title" type="text" placeholder="e.g. Bali Summer Escape" value={form.title} onChange={handleChange} error={errors.title} required />
          <FormInput label="Destination Country" name="destination" type="text" placeholder="e.g. Indonesia" value={form.destination} onChange={handleChange} error={errors.destination} required />
          <div style={{display:'flex',gap:'12px'}}>
            <div style={{flex:1}}><FormInput label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleChange} error={errors.startDate} required /></div>
            <div style={{flex:1}}><FormInput label="End Date" name="endDate" type="date" value={form.endDate} onChange={handleChange} error={errors.endDate} required /></div>
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}}>Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              style={{width:'100%',padding:'10px 14px',border:'1px solid #e2e8f0',borderRadius:'12px',fontSize:'14px',outline:'none',fontFamily:"'Urbanist',sans-serif"}}>
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}}>Description</label>
            <textarea rows={3} name="description" placeholder="What are you excited about?" value={form.description} onChange={handleChange}
              style={{width:'100%',padding:'10px 14px',border:'1px solid #e2e8f0',borderRadius:'12px',fontSize:'14px',outline:'none',resize:'none',boxSizing:'border-box',fontFamily:"'Urbanist',sans-serif"}} />
          </div>
          <div style={{display:'flex',gap:'10px'}}>
            <Button type="button" variant="ghost" onClick={() => setModal(false)} style={{flex:1,borderRadius:'12px',padding:'12px'}}>Cancel</Button>
            <Button type="submit" loading={saving} style={{flex:1,borderRadius:'12px',padding:'12px'}}>Save Trip</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
