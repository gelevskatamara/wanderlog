import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import FormSelect from '../components/common/FormSelect';
import FormTextarea from '../components/common/FormTextarea';
import Alert from '../components/common/Alert';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmModal from '../components/common/ConfirmModal';
import TripGallery from '../components/common/TripGallery';
import { TripsIcon, EditIcon, DeleteIcon, StarIcon, SuccessIcon, WarningIcon } from '../components/common/Icons';
import { getTrip, deleteTrip, updateTrip, getTripReviews, createReview, deleteReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import InviteGuestModal from '../components/common/InviteGuestModal';

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1 mb-4">
    {[1, 2, 3, 4, 5].map(s => (
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        className={`transition-opacity text-amber-400 ${s <= value ? 'opacity-100' : 'opacity-20'}`}
      >
        <StarIcon className="w-7 h-7" />
      </button>
    ))}
  </div>
);

export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingReview, setSavingReview] = useState(false);
  const [confirmDeleteReview, setConfirmDeleteReview] = useState(null);
  const [confirmDeleteTrip, setConfirmDeleteTrip] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [inviteModal, setInviteModal] = useState(false);

  const load = () => {
    Promise.all([getTrip(id), getTripReviews(id)])
      .then(([tripRes, revRes]) => {
        const t = tripRes.data.trip;
        setTrip(t);
        setEditForm({
          title: t.title,
          destination: t.destination,
          startDate: t.startDate?.split('T')[0],
          endDate: t.endDate?.split('T')[0],
          description: t.description,
          status: t.status,
        });
        setReviews(revRes.data.reviews);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleDelete = async () => {
    try { await deleteTrip(id); navigate('/trips'); }
    catch (err) { setDeleteError(err.response?.data?.message || 'Delete failed'); setConfirmDeleteTrip(false); }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try { await updateTrip(id, editForm); setEditModal(false); load(); }
    catch (err) { setDeleteError(err.response?.data?.message || 'Update failed'); }
    finally { setSavingEdit(false); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!reviewForm.comment || reviewForm.comment.length < 5) { setReviewError('Comment must be at least 5 characters'); return; }
    setSavingReview(true);
    try {
      await createReview({ tripId: id, ...reviewForm });
      setReviewModal(false);
      setReviewForm({ rating: 5, comment: '' });
      load();
    } catch (err) { setReviewError(err.response?.data?.message || 'Failed'); }
    finally { setSavingReview(false); }
  };

  const handleDeleteReview = (rid) => setConfirmDeleteReview(rid);

  const handleConfirmDeleteReview = async () => {
    try { await deleteReview(confirmDeleteReview); setConfirmDeleteReview(null); load(); }
    catch { setConfirmDeleteReview(null); }
  };

  if (loading) return <AppLayout><LoadingSpinner /></AppLayout>;
  if (!trip) return (
    <AppLayout>
      <PageWrapper>
        <div className="text-center py-20 text-slate-400">Trip not found</div>
      </PageWrapper>
    </AppLayout>
  );

  const ownerId = trip.userId?._id || trip.userId;
  const isOwner = ownerId === user?._id || user?.role === 'admin';
  const canEdit = ownerId === user?._id || user?.role === 'admin';
  const days = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24));

  return (
    <AppLayout>
      <PageHeader
        title={trip.title}
        subtitle={`${trip.destination} · ${days} days`}
        action={canEdit && (
          <div className="flex gap-2">
            {isOwner && (
              <Button variant="secondary" onClick={() => setInviteModal(true)} className="text-sm px-3 py-2">
                👥 Invite
              </Button>
            )}
            <Button variant="secondary" onClick={() => setEditModal(true)} className="text-sm px-3 py-2 flex items-center gap-1.5"><EditIcon className="w-4 h-4" /> Edit</Button>
            <Button variant="danger" onClick={() => setConfirmDeleteTrip(true)} className="text-sm px-3 py-2 flex items-center gap-1.5"><DeleteIcon className="w-4 h-4" /> Delete</Button>
          </div>
        )}
      />
      <PageWrapper>

        {/* Hero */}
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary-light via-soft-purple to-soft-pink p-6 sm:p-8 mb-6 relative overflow-hidden">
          <div className="absolute right-4 top-4 text-8xl opacity-10 select-none">✈️</div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3">{trip.title}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white/60 text-slate-700 text-xs px-3 py-1 rounded-full">
                  📅 {new Date(trip.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} – {new Date(trip.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="bg-white/60 text-slate-700 text-xs px-3 py-1 rounded-full">🗓 {days} days</span>
                <StatusBadge status={trip.status} />
              </div>
            </div>
            <span className="text-5xl sm:text-6xl">✈️</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-6">

          {/* Main content */}
          <div className="flex flex-col gap-4 sm:gap-6 flex-1 basis-full lg:basis-[400px]">

            {/* Description */}
            {trip.description && (
              <div className="card p-4 sm:p-6">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-3">About this Trip</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{trip.description}</p>
              </div>
            )}
            <TripGallery trip={trip} />

            {/* Reviews */}
            <div className="card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  Reviews & Notes
                  {reviews.length > 0 && <span className="ml-2 text-xs text-slate-400 font-normal">({reviews.length})</span>}
                </h3>
                {user?.role !== 'guest' && trip.status === 'completed' && (
                  <button onClick={() => setReviewModal(true)} className="text-xs text-primary font-semibold hover:underline">
                    + Add Review
                  </button>
                )}
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">No reviews yet.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {reviews.map(r => (
                    <div key={r._id} className="bg-soft-blue rounded-xl p-3 sm:p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-soft-pink to-soft-purple flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {r.userId?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{r.userId?.name}</p>
                          <p className="text-amber-400 text-xs">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                        </div>
                        <span className="text-xs text-slate-400 flex-shrink-0">{new Date(r.createdAt).toLocaleDateString()}</span>
                        {(r.userId?._id === user?._id || user?.role === 'admin') && (
                          <button onClick={() => setConfirmDeleteReview(r._id)} className="text-slate-300 hover:text-red-400 transition-colors"><DeleteIcon className="w-4 h-4" /></button>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar info */}
          <div className="card p-4 sm:p-6 flex-1 basis-full sm:basis-64 lg:basis-52 self-start">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-4">Trip Info</h3>
            <div className="flex flex-col gap-3 text-sm">
              {[
                { label: 'Country', value: <Link to={`/explore/${encodeURIComponent(trip.destination)}`} className="font-semibold text-primary hover:underline">🌍 {trip.destination}</Link> },
                { label: 'Duration', value: <span className="font-semibold text-slate-800">{days} days</span> },
                { label: 'Status', value: <StatusBadge status={trip.status} /> },
                { label: 'Created', value: <span className="font-semibold text-slate-800">{new Date(trip.createdAt).toLocaleDateString()}</span> },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between gap-2">
                  <span className="text-slate-400 text-xs">{row.label}</span>
                  {row.value}
                </div>
              ))}
            </div>
          </div>

        </div>
      </PageWrapper>

      <ConfirmModal
        isOpen={confirmDeleteTrip}
        onClose={() => setConfirmDeleteTrip(false)}
        onConfirm={handleDelete}
        title="Delete Trip?"
        message={`This will permanently delete "${trip.title}". This cannot be undone.`}
        confirmText="Delete"
      />
      <ConfirmModal
        isOpen={!!confirmDeleteReview}
        onClose={() => setConfirmDeleteReview(null)}
        onConfirm={handleConfirmDeleteReview}
        title="Delete Review?"
        message="This will permanently delete your review. This cannot be undone."
        confirmText="Delete"
      />

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Trip ✏️">
        <form onSubmit={handleEditSubmit}>
          <FormInput label="Title" name="title" type="text" value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} required />
          <FormInput label="Destination" name="destination" type="text" value={editForm.destination} onChange={e => setEditForm(p => ({ ...p, destination: e.target.value }))} required />
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <FormInput label="Start Date" name="startDate" type="date" value={editForm.startDate} onChange={e => setEditForm(p => ({ ...p, startDate: e.target.value }))} />
            </div>
            <div className="flex-1">
              <FormInput label="End Date" name="endDate" type="date" value={editForm.endDate} onChange={e => setEditForm(p => ({ ...p, endDate: e.target.value }))} />
            </div>
          </div>
          <FormSelect label="Status" name="status" value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}>
            <option value="planned">Planned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </FormSelect>
          <FormTextarea label="Description" rows={3} value={editForm.description} maxLength={500} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} />
          <div className="flex gap-3 mt-2">
            <Button type="button" variant="ghost" onClick={() => setEditModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={savingEdit} className="flex-1">Save</Button>
          </div>
        </form>
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={reviewModal} onClose={() => setReviewModal(false)} title="Write a Review ✍️" maxWidth="max-w-md">
        <form onSubmit={handleReviewSubmit}>
          <Alert type="error" message={reviewError} />
          <div className="mb-4">
            <label className="form-label">Rating</label>
            <StarRating value={reviewForm.rating} onChange={r => setReviewForm(p => ({ ...p, rating: r }))} />
          </div>
          <FormTextarea
            label="Your Review" rows={4} placeholder="Share your experience..."
            value={reviewForm.comment}
            onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
            maxLength={1000}
          />
          <div className="flex gap-3 mt-2">
            <Button type="button" variant="ghost" onClick={() => setReviewModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={savingReview} className="flex-1">Submit</Button>
          </div>
        </form>
      </Modal>
      <InviteGuestModal
        isOpen={inviteModal}
        onClose={() => setInviteModal(false)}
        trip={trip}
      />
    </AppLayout>
  );
}
