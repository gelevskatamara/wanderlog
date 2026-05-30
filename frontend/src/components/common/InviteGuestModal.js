import { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";
import FormInput from "./FormInput";
import Alert from "./Alert";
import { inviteGuest, getTripGuests, removeGuest } from "../../services/api";

const API_BASE = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";

export default function InviteGuestModal({ isOpen, onClose, trip }) {
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadGuests = () => {
    if (!trip?._id) return;
    getTripGuests(trip._id)
      .then(res => setGuests(res.data.guests))
      .catch(console.error);
  };

  useEffect(() => {
    if (isOpen) { loadGuests(); setEmail(""); setError(""); setSuccess(""); }
  }, [isOpen, trip?._id]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { setError("Please enter a valid email"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await inviteGuest(trip._id, { email });
      setSuccess(res.data.message);
      setEmail("");
      loadGuests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to invite user");
    } finally { setLoading(false); }
  };

  const handleRemove = async (guestId) => {
    try {
      await removeGuest(trip._id, guestId);
      loadGuests();
    } catch { setError("Failed to remove guest"); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Guests 👥" maxWidth="max-w-md">
      <form onSubmit={handleInvite} className="mb-6">
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />
        <FormInput
          label="Invite by email"
          name="email"
          type="email"
          placeholder="friend@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Button type="submit" loading={loading} className="w-full">
          Send Invite
        </Button>
      </form>

      {/* Current guests */}
      {guests.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3">Current Guests ({guests.length})</h4>
          <div className="flex flex-col gap-2">
            {guests.map(g => (
              <div key={g._id} className="flex items-center gap-3 p-3 bg-soft-blue rounded-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-soft-pink to-soft-purple flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden">
                  {g.avatar
                    ? <img src={`${API_BASE}${g.avatar}`} alt="avatar" className="w-full h-full object-cover" />
                    : g.name?.[0]?.toUpperCase()
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{g.name}</p>
                  <p className="text-xs text-slate-400 truncate">{g.email}</p>
                </div>
                <button
                  onClick={() => handleRemove(g._id)}
                  className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {guests.length === 0 && (
        <div className="text-center py-4 text-slate-400 text-sm">
          No guests yet. Invite someone to share this trip.
        </div>
      )}
    </Modal>
  );
}
