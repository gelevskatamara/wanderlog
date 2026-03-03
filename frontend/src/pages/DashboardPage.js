import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getTripStats, getTrips } from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTripStats(), getTrips({ limit: 6 })])
      .then(([statsRes, tripsRes]) => {
        setStats(statsRes.data.stats);
        setRecentTrips(tripsRes.data.trips.slice(0, 3));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout><LoadingSpinner /></AppLayout>;

  const chartData = (stats?.byDestination || []).slice(0, 6).map(d => ({ name: d._id, trips: d.count }));

  const statCards = [
    { label: 'Total Trips', value: stats?.total ?? 0, sub: 'all time', color: '#636BAB' },
    { label: 'Planned', value: stats?.planned ?? 0, sub: 'upcoming', color: '#3b82f6' },
    { label: 'Ongoing', value: stats?.ongoing ?? 0, sub: 'right now', color: '#10b981' },
    { label: 'Completed', value: stats?.completed ?? 0, sub: 'done', color: '#8b5cf6' },
  ];

  return (
    <AppLayout>
      <PageHeader title="Dashboard" subtitle={`Welcome back, ${user?.name} 👋`}
        action={<Link to="/trips/new"><Button>+ New Trip</Button></Link>} />
      <main style={{padding:'24px',position:'relative'}}>
        <div style={{position:'fixed',top:'80px',right:'80px',width:'288px',height:'288px',background:'rgba(99,107,171,0.08)',borderRadius:'50%',filter:'blur(60px)',pointerEvents:'none'}} />

        {/* Stats */}
        <div style={{display:'flex',flexWrap:'wrap',gap:'16px',marginBottom:'24px'}}>
          {statCards.map(c => (
            <div key={c.label} style={{flex:'1 1 140px',background:'white',borderRadius:'20px',padding:'20px',border:'1px solid #e2e8f0'}}>
              <div style={{fontSize:'28px',fontWeight:900,color:c.color}}>{c.value}</div>
              <div style={{fontSize:'13px',color:'#64748b',marginTop:'4px'}}>{c.label}</div>
              <div style={{fontSize:'11px',color:'#cbd5e1',marginTop:'2px'}}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',flexWrap:'wrap',gap:'20px',marginBottom:'24px'}}>
          {/* Chart */}
          <div style={{flex:'1 1 400px',background:'white',borderRadius:'20px',padding:'24px',border:'1px solid #e2e8f0'}}>
            <h2 style={{fontSize:'16px',fontWeight:700,color:'#1e293b',margin:'0 0 20px'}}>Trips by Destination</h2>
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
              <div style={{height:'200px',display:'flex',alignItems:'center',justifyContent:'center',color:'#94a3b8',fontSize:'14px'}}>
                No trip data yet. <Link to="/trips/new" style={{color:'#636BAB',marginLeft:'6px'}}>Add your first trip →</Link>
              </div>
            )}
          </div>

          {/* Upcoming */}
          <div style={{flex:'1 1 260px',background:'white',borderRadius:'20px',padding:'24px',border:'1px solid #e2e8f0'}}>
            <h2 style={{fontSize:'16px',fontWeight:700,color:'#1e293b',margin:'0 0 16px'}}>Recent Trips</h2>
            {recentTrips.length === 0 ? (
              <div style={{color:'#94a3b8',fontSize:'14px',textAlign:'center',padding:'20px 0'}}>
                No trips yet.<br/>
                <Link to="/trips/new" style={{color:'#636BAB'}}>Plan your first trip →</Link>
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                {recentTrips.map(t => (
                  <Link key={t._id} to={`/trips/${t._id}`} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 12px',borderRadius:'14px',background:'#f8f7ff',textDecoration:'none'}}>
                    <div style={{fontSize:'24px'}}>✈️</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'13px',fontWeight:600,color:'#1e293b',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.title}</div>
                      <div style={{fontSize:'11px',color:'#94a3b8'}}>{t.destination}</div>
                    </div>
                    <StatusBadge status={t.status} />
                  </Link>
                ))}
                <Link to="/trips" style={{fontSize:'13px',color:'#636BAB',fontWeight:600,textAlign:'center',marginTop:'4px',textDecoration:'none'}}>View all trips →</Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
