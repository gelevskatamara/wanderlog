import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import PageWrapper from '../components/layout/PageWrapper';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { TripsIcon } from '../components/common/Icons';
import { useAuth } from '../context/AuthContext';
import { getTripStats, getTrips } from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTripStats(), getTrips()])
      .then(([sRes, tRes]) => {
        setStats(sRes.data.stats);
        setRecentTrips(tRes.data.trips.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Trips',  value: stats?.total     ?? 0, color: 'text-primary',      bg: 'bg-primary-light/40' },
    { label: 'Planned',      value: stats?.planned   ?? 0, color: 'text-blue-600',     bg: 'bg-blue-50' },
    { label: 'Ongoing',      value: stats?.ongoing   ?? 0, color: 'text-emerald-600',  bg: 'bg-emerald-50' },
    { label: 'Completed',    value: stats?.completed ?? 0, color: 'text-violet-600',   bg: 'bg-violet-50' },
  ];

  const chartData = (stats?.byDestination || []).slice(0, 6).map(d => ({
    name: d._id, trips: d.count,
  }));

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name} 👋`}
        action={
          <Link to="/trips">
            <Button className="text-sm px-4 py-2">+ New Trip</Button>
          </Link>
        }
      />
      <PageWrapper>
        {loading ? <LoadingSpinner /> : (
          <>
            {/* Stat cards */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6">
              {statCards.map(c => (
                <div key={c.label} className={`stat-card ${c.bg} border-0`}>
                  <div className={`text-2xl sm:text-3xl font-black ${c.color}`}>{c.value}</div>
                  <div className="text-xs sm:text-sm text-slate-500 mt-1">{c.label}</div>
                </div>
              ))}
            </div>

            {/* Chart + Recent trips */}
            <div className="flex flex-wrap gap-4 sm:gap-6">

              {/* Bar chart */}
              <div className="card p-4 sm:p-6 flex-1 basis-full lg:basis-[400px]">
                <h2 className="text-sm sm:text-base font-bold text-slate-800 mb-4">Trips by Destination</h2>
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
                  <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                    <span className="text-primary flex justify-center"><svg className="w-10 h-10" viewBox="0 0 21 20" fill="none"><path opacity="0.4" d="M20.2 13.92L13.8 2.4C12.94 0.85 11.75 0 10.44 0C9.13 0 7.94 0.85 7.08 2.4L0.68 13.92C-0.13 15.39 -0.22 16.8 0.43 17.91C1.08 19.02 2.36 19.63 4.04 19.63H16.84C18.52 19.63 19.8 19.02 20.45 17.91C21.1 16.8 21.01 15.38 20.2 13.92Z" fill="currentColor"/><path d="M10.44 12.75C10.03 12.75 9.69 12.41 9.69 12V7C9.69 6.59 10.03 6.25 10.44 6.25C10.85 6.25 11.19 6.59 11.19 7V12C11.19 12.41 10.85 12.75 10.44 12.75Z" fill="currentColor"/></svg></span>
                    No trip data yet.
                    <Link to="/trips" className="text-primary font-semibold text-xs">Add your first trip →</Link>
                  </div>
                )}
              </div>

              {/* Recent trips */}
              <div className="card p-4 sm:p-6 flex-1 basis-full lg:basis-64">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm sm:text-base font-bold text-slate-800">Recent Trips</h2>
                  <Link to="/trips" className="text-xs text-primary font-semibold">View all →</Link>
                </div>
                {recentTrips.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    <p>No trips yet.</p>
                    <Link to="/trips" className="text-primary font-semibold text-xs mt-1 block">Plan your first trip →</Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {recentTrips.map(t => (
                      <Link
                        key={t._id}
                        to={`/trips/${t._id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-soft-blue hover:bg-primary-light/30 transition-colors no-underline"
                      >
                        <span className="flex-shrink-0 text-primary"><TripsIcon className="w-6 h-6" /></span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{t.title}</p>
                          <p className="text-xs text-slate-400 truncate">{t.destination}</p>
                        </div>
                        <StatusBadge status={t.status} />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </>
        )}
      </PageWrapper>
    </AppLayout>
  );
}
