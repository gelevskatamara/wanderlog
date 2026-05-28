import { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/common/Button';
import TripCard from '../components/common/TripCard';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import FormSelect from '../components/common/FormSelect';
import FormTextarea from '../components/common/FormTextarea';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { SearchIcon, TripsIcon } from '../components/common/Icons';
import { useAuth } from '../context/AuthContext';
import { getTrips, createTrip, deleteTrip } from '../services/api';

const TABS = ['all', 'planned', 'ongoing', 'completed'];

const validate = (v) => {
  const e = {};
  if (!v.title || v.title.length < 3) e.title = 'Title must be at least 3 characters';
  if (!v.destination || !/^[a-zA-Z\s]{2,}$/.test(v.destination)) e.destination = 'Valid country name required (letters only)';
  if (!v.startDate) e.startDate = 'Required';
  if (!v.endDate) e.endDate = 'Required';
  if (v.startDate && v.endDate && v.endDate < v.startDate) e.endDate = 'Must be after start date';
  return e;
};

const emptyForm = { title: '', destination: '', startDate: '', endDate: '', description: '', status: 'planned' };

export default function MyTripsPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  const fetchTrips = useCallback(() => {
    setLoading(true);
    const params = {};
    if (tab !== 'all') params.status = tab;
    if (search) params.search = search;
    getTrips(params)
      .then(res => setTrips(res.data.trips))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tab, search]);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

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
      setForm(emptyForm);
      fetchTrips();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create trip');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    try { await deleteTrip(id); fetchTrips(); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  const openModal = () => { setForm(emptyForm); setErrors({}); setApiError(''); setModal(true); };

  return (
    <AppLayout>
      <PageHeader
        title="My Trips"
        subtitle={`${trips.length} trip${trips.length !== 1 ? 's' : ''}`}
        action={user?.role !== 'guest' && (
          <Button onClick={openModal} className="text-sm px-4 py-2">+ New Trip</Button>
        )}
      />
      <PageWrapper>

        {/* Filters */}
        <div className="card p-3 sm:p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex gap-1 flex-wrap">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  tab === t ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon className="w-3.5 h-3.5" /></span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search trips..."
              className="form-input pl-8 text-sm py-2"
            />
          </div>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="flex flex-wrap gap-4">
            {trips.map(t => (
              <div key={t._id} className="w-full min-[480px]:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] xl:w-[calc(25%-12px)]">
                <TripCard trip={t} onDelete={user?.role !== 'guest' ? handleDelete : null} />
              </div>
            ))}

            {trips.length === 0 && (
              <div className="w-full">
                <EmptyState icon={<TripsIcon className="w-12 h-12" />} title="No trips found" message="Start planning your next adventure." action={user?.role !== 'guest' ? 'Plan a Trip' : null} onAction={openModal} />
              </div>
            )}

            {/* Add card */}
            {user?.role !== 'guest' && (
              <div
                onClick={openModal}
                className="w-full min-[480px]:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] xl:w-[calc(25%-12px)] min-h-[180px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer text-slate-300 hover:border-primary hover:text-primary transition-all duration-200"
              >
                <span className="text-primary"><TripsIcon className="w-8 h-8" /></span>
                <span className="text-sm font-semibold">Plan a New Trip</span>
              </div>
            )}
          </div>
        )}
      </PageWrapper>

      {/* New Trip Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title="New Trip ✈️">
        <form onSubmit={handleSubmit}>
          <Alert type="error" message={apiError} />
          <FormInput label="Trip Title" name="title" type="text" placeholder="e.g. Bali Summer Escape" value={form.title} onChange={handleChange} error={errors.title} required />
          <FormInput label="Destination Country" name="destination" type="text" placeholder="e.g. Indonesia" value={form.destination} onChange={handleChange} error={errors.destination} required />
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <FormInput label="Start Date" name="startDate" type="date" value={form.startDate} onChange={handleChange} error={errors.startDate} required />
            </div>
            <div className="flex-1">
              <FormInput label="End Date" name="endDate" type="date" value={form.endDate} onChange={handleChange} error={errors.endDate} required />
            </div>
          </div>
          <FormSelect label="Status" name="status" value={form.status} onChange={handleChange}>
            <option value="planned">Planned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </FormSelect>
          <FormTextarea label="Description" name="description" rows={3} placeholder="What are you excited about?" value={form.description} maxLength={500} onChange={handleChange} />
          <div className="flex gap-3 mt-2">
            <Button type="button" variant="ghost" onClick={() => setModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={saving} className="flex-1">Save Trip</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
