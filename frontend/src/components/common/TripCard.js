import { Link } from 'react-router-dom';
import { TripsIcon, DeleteIcon } from './Icons';
import StatusBadge from './StatusBadge';

const gradients = {
  planned:   'from-primary-light to-primary/40',
  ongoing:   'from-emerald-100 to-emerald-300',
  completed: 'from-soft-pink to-soft-purple',
};

const emojis = {
  Japan: '🇯🇵', Greece: '🇬🇷', Italy: '🇮🇹', Portugal: '🇵🇹',
  France: '🇫🇷', Spain: '🇪🇸', Germany: '🇩🇪', Thailand: '🇹🇭',
  Mexico: '🇲🇽', Brazil: '🇧🇷', India: '🇮🇳', Australia: '🇦🇺',
  USA: '🇺🇸', UK: '🇬🇧', China: '🇨🇳', 'South Korea': '🇰🇷',
  Malta: '🇲🇹', Croatia: '🇭🇷', Netherlands: '🇳🇱', Turkey: '🇹🇷',
};

export default function TripCard({ trip, onDelete }) {
  const emoji = emojis[trip.destination] || null;
  const grad = gradients[trip.status] || gradients.planned;

  return (
    <div className="card-hover overflow-hidden flex flex-col h-full">
      {/* Image area */}
      <div className={`h-36 bg-gradient-to-br ${grad} flex items-center justify-center text-6xl relative`}>
        {emoji || <span className="text-primary"><TripsIcon className="w-14 h-14" /></span>}
        <div className="absolute top-3 right-3">
          <StatusBadge status={trip.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-slate-800 mb-1 line-clamp-1">{trip.title}</h3>
        <p className="text-xs text-slate-400 mb-3">
          {emoji} {trip.destination} &middot; {new Date(trip.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        {trip.description && (
          <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2 flex-1">
            {trip.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
          <Link
            to={`/trips/${trip._id}`}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View details →
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(trip._id)}
              className="text-slate-300 hover:text-red-400 transition-colors p-1"
            >
              <DeleteIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
