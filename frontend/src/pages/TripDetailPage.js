import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getTrip, deleteTrip, updateTrip, getTripReviews, createReview, deleteReview } from '../services/api';
import { useAuth } from '../context/AuthContext';

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

  const load = () => {
    Promise.all([getTrip(id), getTripReviews(id)])
      .then(([tripRes, revRes]) => {
        setTrip(tripRes.data.trip);
        setEditForm({ title: tripRes.data.trip.title, destination: tripRes.data.trip.destination, startDate: tripRes.data.trip.startDate?.split('T')[0], endDate: tripRes.data.trip.endDate?.split('T')[0], description: tripRes.data.trip.description, status: tripRes.data.trip.status });
        setReviews(revRes.data.reviews);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleDelete = async () => {
    try { await deleteTrip(id); navigate('/trips'); } catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try { await updateTrip(id, editForm); setEditModal(false); load(); } catch (err) { alert(err.response?.data?.message || 'Update failed'); } finally { setSavingEdit(false); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!reviewForm.comment || reviewForm.comment.length < 5) { setReviewError('Comment must be at least 5 characters'); return; }
    setSavingReview(true);
    try { await createReview({ tripId: id, ...reviewForm }); setReviewModal(false); setReviewForm({ rating: 5, comment: '' }); load(); } catch (err) { setReviewError(err.response?.data?.message || 'Failed'); } finally { setSavingReview(false); }
  };

  const handleDeleteReview = async (rid) => {
    if (!window.confirm('Delete this review?')) return;
    try { await deleteReview(rid); load(); } catch (err) { alert('Delete failed'); }
  };

  if (loading) return <AppLayout><LoadingSpinner /></AppLayout>;
  if (!trip) return <AppLayout><div style={{padding:'60px',textAlign:'center',color:'#94a3b8'}}>Trip not found</div></AppLayout>;

  const isOwner = trip.userId?._id === user?._id || trip.userId === user?._id;
  const canEdit = isOwner || user?.role === 'admin';
  const days = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000*60*60*24));

  return (
    <AppLayout>
      <PageHeader title={trip.title}
        subtitle={`${trip.destination} · ${days} days`}
        action={canEdit ? (
          <div style={{display:'flex',gap:'8px'}}>
            <Button variant="secondary" onClick={() => setEditModal(true)}>✏️ Edit</Button>
            <Button variant="danger" onClick={() => setDeleteModal(true)}>🗑 Delete</Button>
          </div>
        ) : null} />
      <main style={{padding:'24px'}}>
        {/* Hero */}
        <div style={{background:'linear-gradient(135deg, #DEE2FF, #CBC0D3, #EFD3D7)',borderRadius:'24px',padding:'32px',marginBottom:'24px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',right:'-20px',top:'-10px',fontSize:'140px',opacity:0.1,userSelect:'none'}}>✈️</div>
          <div style={{position:'relative',zIndex:1,display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:'16px'}}>
            <div>
              <h2 style={{fontSize:'24px',fontWeight:900,color:'#1e293b',margin:'0 0 12px'}}>{trip.title}</h2>
              <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                <span style={{background:'rgba(255,255,255,0.6)',padding:'4px 14px',borderRadius:'999px',fontSize:'13px',color:'#374151'}}>📅 {new Date(trip.startDate).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})} – {new Date(trip.endDate).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
                <span style={{background:'rgba(255,255,255,0.6)',padding:'4px 14px',borderRadius:'999px',fontSize:'13px',color:'#374151'}}>🗓 {days} days</span>
                <StatusBadge status={trip.status} />
              </div>
            </div>
            <div style={{fontSize:'56px'}}>✈️</div>
          </div>
        </div>

        <div style={{display:'flex',flexWrap:'wrap',gap:'20px'}}>
          <div style={{flex:'2 1 400px',display:'flex',flexDirection:'column',gap:'20px'}}>
            {/* Description */}
            {trip.description && (
              <div style={{background:'white',borderRadius:'20px',padding:'24px',border:'1px solid #e2e8f0'}}>
                <h3 style={{fontSize:'16px',fontWeight:700,color:'#1e293b',margin:'0 0 12px'}}>About this Trip</h3>
                <p style={{color:'#64748b',lineHeight:1.7,margin:0,fontSize:'14px'}}>{trip.description}</p>
              </div>
            )}

            {/* Reviews */}
            <div style={{background:'white',borderRadius:'20px',padding:'24px',border:'1px solid #e2e8f0'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
                <h3 style={{fontSize:'16px',fontWeight:700,color:'#1e293b',margin:0}}>Reviews & Notes</h3>
                {user?.role !== 'guest' && trip.status === 'completed' && (
                  <button onClick={() => setReviewModal(true)} style={{fontSize:'13px',color:'#636BAB',fontWeight:600,background:'none',border:'none',cursor:'pointer'}}>+ Add Review</button>
                )}
              </div>
              {reviews.length === 0 ? (
                <p style={{color:'#94a3b8',fontSize:'14px',textAlign:'center',padding:'20px 0'}}>No reviews yet.</p>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                  {reviews.map(r => (
                    <div key={r._id} style={{background:'#f8f7ff',borderRadius:'14px',padding:'14px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                        <div style={{width:'30px',height:'30px',borderRadius:'50%',background:'linear-gradient(135deg,#EFD3D7,#CBC0D3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700,color:'white'}}>
                          {r.userId?.name?.[0]?.toUpperCase()}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b'}}>{r.userId?.name}</div>
                          <div style={{color:'#f59e0b',fontSize:'12px'}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                        </div>
                        <span style={{fontSize:'11px',color:'#94a3b8'}}>{new Date(r.createdAt).toLocaleDateString()}</span>
                        {(r.userId?._id === user?._id || user?.role === 'admin') && (
                          <button onClick={() => handleDeleteReview(r._id)} style={{background:'none',border:'none',cursor:'pointer',color:'#94a3b8',fontSize:'14px'}}>🗑</button>
                        )}
                      </div>
                      <p style={{margin:0,fontSize:'13px',color:'#64748b',lineHeight:1.6}}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar info */}
          <div style={{flex:'1 1 220px',display:'flex',flexDirection:'column',gap:'16px'}}>
            <div style={{background:'white',borderRadius:'20px',padding:'20px',border:'1px solid #e2e8f0'}}>
              <h3 style={{fontSize:'15px',fontWeight:700,color:'#1e293b',margin:'0 0 16px'}}>Trip Info</h3>
              <div style={{display:'flex',flexDirection:'column',gap:'12px',fontSize:'13px'}}>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <span style={{color:'#94a3b8'}}>Country</span>
                  <Link to={`/explore/${encodeURIComponent(trip.destination)}`} style={{fontWeight:600,color:'#636BAB',textDecoration:'none'}}>🌍 {trip.destination}</Link>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <span style={{color:'#94a3b8'}}>Duration</span>
                  <span style={{fontWeight:600,color:'#1e293b'}}>{days} days</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <span style={{color:'#94a3b8'}}>Status</span>
                  <StatusBadge status={trip.status} />
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <span style={{color:'#94a3b8'}}>Created</span>
                  <span style={{fontWeight:600,color:'#1e293b'}}>{new Date(trip.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Trip?" maxWidth="400px">
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'48px',marginBottom:'12px'}}>🗑️</div>
          <p style={{color:'#64748b',fontSize:'14px',marginBottom:'24px'}}>This will permanently delete "{trip.title}". This cannot be undone.</p>
          <div style={{display:'flex',gap:'10px'}}>
            <Button variant="ghost" onClick={() => setDeleteModal(false)} style={{flex:1,borderRadius:'12px',padding:'12px'}}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} style={{flex:1,borderRadius:'12px',padding:'12px'}}>Delete</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Trip ✏️">
        <form onSubmit={handleEditSubmit}>
          <FormInput label="Title" name="title" type="text" value={editForm.title} onChange={e => setEditForm(p => ({...p, title: e.target.value}))} required />
          <FormInput label="Destination" name="destination" type="text" value={editForm.destination} onChange={e => setEditForm(p => ({...p, destination: e.target.value}))} required />
          <div style={{display:'flex',gap:'12px'}}>
            <div style={{flex:1}}><FormInput label="Start Date" name="startDate" type="date" value={editForm.startDate} onChange={e => setEditForm(p => ({...p, startDate: e.target.value}))} /></div>
            <div style={{flex:1}}><FormInput label="End Date" name="endDate" type="date" value={editForm.endDate} onChange={e => setEditForm(p => ({...p, endDate: e.target.value}))} /></div>
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}}>Status</label>
            <select name="status" value={editForm.status} onChange={e => setEditForm(p => ({...p, status: e.target.value}))}
              style={{width:'100%',padding:'10px 14px',border:'1px solid #e2e8f0',borderRadius:'12px',fontSize:'14px',outline:'none',fontFamily:"'Urbanist',sans-serif"}}>
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div style={{display:'flex',gap:'10px'}}>
            <Button type="button" variant="ghost" onClick={() => setEditModal(false)} style={{flex:1,borderRadius:'12px',padding:'12px'}}>Cancel</Button>
            <Button type="submit" loading={savingEdit} style={{flex:1,borderRadius:'12px',padding:'12px'}}>Save</Button>
          </div>
        </form>
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={reviewModal} onClose={() => setReviewModal(false)} title="Write a Review ✍️" maxWidth="440px">
        <form onSubmit={handleReviewSubmit}>
          {reviewError && <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'10px',padding:'10px',color:'#dc2626',fontSize:'13px',marginBottom:'14px'}}>{reviewError}</div>}
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'8px'}}>Rating</label>
            <div style={{display:'flex',gap:'8px'}}>
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button" onClick={() => setReviewForm(p => ({...p, rating: s}))}
                  style={{fontSize:'28px',background:'none',border:'none',cursor:'pointer',opacity: s <= reviewForm.rating ? 1 : 0.3,transition:'opacity 0.15s'}}>⭐</button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}}>Your Review</label>
            <textarea rows={4} placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm(p => ({...p, comment: e.target.value}))}
              style={{width:'100%',padding:'10px 14px',border:'1px solid #e2e8f0',borderRadius:'12px',fontSize:'14px',outline:'none',resize:'none',boxSizing:'border-box',fontFamily:"'Urbanist',sans-serif"}} />
          </div>
          <div style={{display:'flex',gap:'10px'}}>
            <Button type="button" variant="ghost" onClick={() => setReviewModal(false)} style={{flex:1,borderRadius:'12px',padding:'12px'}}>Cancel</Button>
            <Button type="submit" loading={savingReview} style={{flex:1,borderRadius:'12px',padding:'12px'}}>Submit</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
