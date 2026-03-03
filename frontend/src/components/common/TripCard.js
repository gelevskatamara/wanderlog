import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const gradients = {
  planned:   'linear-gradient(135deg, #DEE2FF, rgba(99,107,171,0.4))',
  ongoing:   'linear-gradient(135deg, #d1fae5, #6ee7b7)',
  completed: 'linear-gradient(135deg, #EFD3D7, #CBC0D3)',
};

const emojis = { Japan:'🇯🇵', Greece:'🇬🇷', Italy:'🇮🇹', Portugal:'🇵🇹', France:'🇫🇷', Spain:'🇪🇸', Germany:'🇩🇪', Thailand:'🇹🇭', Mexico:'🇲🇽', Brazil:'🇧🇷', India:'🇮🇳', Australia:'🇦🇺', USA:'🇺🇸', UK:'🇬🇧', China:'🇨🇳', 'South Korea':'🇰🇷' };

export default function TripCard({ trip, onDelete }) {
  const emoji = emojis[trip.destination] || '✈️';
  const grad = gradients[trip.status] || gradients.planned;

  return (
    <div style={{background:'white',borderRadius:'20px',overflow:'hidden',border:'1px solid #e2e8f0',transition:'all 0.3s',boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}}>
      <div style={{height:'140px',background:grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'60px',position:'relative'}}>
        {emoji}
        <div style={{position:'absolute',top:'12px',right:'12px'}}>
          <StatusBadge status={trip.status} />
        </div>
      </div>
      <div style={{padding:'16px'}}>
        <h3 style={{fontSize:'15px',fontWeight:700,color:'#1e293b',margin:'0 0 4px'}}>{trip.title}</h3>
        <p style={{fontSize:'12px',color:'#94a3b8',margin:'0 0 10px'}}>
          {emoji} {trip.destination} · {new Date(trip.startDate).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'})}
        </p>
        {trip.description && (
          <p style={{fontSize:'13px',color:'#64748b',margin:'0 0 12px',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
            {trip.description}
          </p>
        )}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link to={`/trips/${trip._id}`} style={{fontSize:'13px',color:'#636BAB',fontWeight:600,textDecoration:'none'}}>View details →</Link>
          {onDelete && (
            <button onClick={() => onDelete(trip._id)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'16px',color:'#94a3b8',padding:'4px'}}>🗑</button>
          )}
        </div>
      </div>
    </div>
  );
}
