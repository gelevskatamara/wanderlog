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
        action={user?.role !== 'guest' && (
          <Link to="/trips">
            <Button className="text-sm px-4 py-2">+ New Trip</Button>
          </Link>
        )}
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
                    <span className="text-primary flex justify-center">
                      <svg className="w-10 h-10" width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.4" d="M20.1999 13.92L13.7999 2.4C12.9399 0.85 11.7499 0 10.4399 0C9.12992 0 7.93992 0.85 7.07992 2.4L0.679919 13.92C-0.130081 15.39 -0.220081 16.8 0.429919 17.91C1.07992 19.02 2.35992 19.63 4.03992 19.63H16.8399C18.5199 19.63 19.7999 19.02 20.4499 17.91C21.0999 16.8 21.0099 15.38 20.1999 13.92Z" fill="#292D32"/>
                        <path d="M10.4395 12.75C10.0295 12.75 9.68945 12.41 9.68945 12V7C9.68945 6.59 10.0295 6.25 10.4395 6.25C10.8495 6.25 11.1895 6.59 11.1895 7V12C11.1895 12.41 10.8495 12.75 10.4395 12.75Z" fill="#292D32"/>
                        <path d="M10.4395 15.9986C10.3795 15.9986 10.3095 15.9886 10.2395 15.9786C10.1795 15.9686 10.1195 15.9486 10.0595 15.9186C9.99945 15.8986 9.93945 15.8686 9.87945 15.8286C9.82945 15.7886 9.77945 15.7486 9.72945 15.7086C9.54945 15.5186 9.43945 15.2586 9.43945 14.9986C9.43945 14.7386 9.54945 14.4786 9.72945 14.2886C9.77945 14.2486 9.82945 14.2086 9.87945 14.1686C9.93945 14.1286 9.99945 14.0986 10.0595 14.0786C10.1195 14.0486 10.1795 14.0286 10.2395 14.0186C10.3695 13.9886 10.5095 13.9886 10.6295 14.0186C10.6995 14.0286 10.7595 14.0486 10.8195 14.0786C10.8795 14.0986 10.9395 14.1286 10.9995 14.1686C11.0495 14.2086 11.0995 14.2486 11.1495 14.2886C11.3295 14.4786 11.4395 14.7386 11.4395 14.9986C11.4395 15.2586 11.3295 15.5186 11.1495 15.7086C11.0995 15.7486 11.0495 15.7886 10.9995 15.8286C10.9395 15.8686 10.8795 15.8986 10.8195 15.9186C10.7595 15.9486 10.6995 15.9686 10.6295 15.9786C10.5695 15.9886 10.4995 15.9986 10.4395 15.9986Z" fill="#292D32"/>
                      </svg>
                    </span>
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
