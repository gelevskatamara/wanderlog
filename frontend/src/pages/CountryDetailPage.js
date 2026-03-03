import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getCountry, getWeather, createTrip } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CountryDetailPage() {
  const { name } = useParams();
  const { user } = useAuth();
  const [country, setCountry] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tripModal, setTripModal] = useState(false);
  const [tripForm, setTripForm] = useState({ title: '', startDate: '', endDate: '', description: '' });
  const [tripError, setTripError] = useState('');
  const [tripSaving, setTripSaving] = useState(false);
  const [tripSuccess, setTripSuccess] = useState(false);

  useEffect(() => {
    getCountry(decodeURIComponent(name))
      .then(res => {
        setCountry(res.data.country);
        const capital = res.data.country.capital;
        if (capital) getWeather(capital).then(r => setWeather(r.data.weather)).catch(() => {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [name]);

  const handleTripSubmit = async (e) => {
    e.preventDefault();
    setTripError('');
    if (!tripForm.title || tripForm.title.length < 3) { setTripError('Title must be at least 3 characters'); return; }
    if (!tripForm.startDate || !tripForm.endDate) { setTripError('Both dates are required'); return; }
    if (tripForm.endDate < tripForm.startDate) { setTripError('End date must be after start date'); return; }
    setTripSaving(true);
    try {
      await createTrip({ ...tripForm, destination: country.name });
      setTripSuccess(true);
      setTimeout(() => { setTripModal(false); setTripSuccess(false); setTripForm({ title:'',startDate:'',endDate:'',description:'' }); }, 1500);
    } catch (err) {
      setTripError(err.response?.data?.message || 'Failed to create trip');
    } finally { setTripSaving(false); }
  };

  if (loading) return <AppLayout><LoadingSpinner /></AppLayout>;
  if (!country) return <AppLayout><div style={{padding:'60px',textAlign:'center',color:'#94a3b8'}}>Country not found</div></AppLayout>;

  return (
    <AppLayout>
      <PageHeader title={`${country.flag || '🌍'} ${country.name}`} subtitle={`${country.region} · ${country.subregion || ''}`}
        action={user?.role !== 'guest' ? <Button onClick={() => setTripModal(true)}>+ Plan a Trip</Button> : null} />
      <main style={{padding:'24px'}}>
        {/* Hero */}
        <div style={{background:'linear-gradient(135deg, #DEE2FF, #CBC0D3, #EFD3D7)',borderRadius:'24px',padding:'32px',marginBottom:'24px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',right:'-20px',top:'-20px',fontSize:'160px',opacity:0.1,userSelect:'none'}}>{country.flag}</div>
          <div style={{position:'relative',zIndex:1}}>
            <div style={{fontSize:'64px',marginBottom:'12px'}}>{country.flag || '🌍'}</div>
            <h2 style={{fontSize:'28px',fontWeight:900,color:'#1e293b',margin:'0 0 8px'}}>{country.name}</h2>
            {country.officialName && <p style={{color:'#64748b',margin:'0 0 16px',fontSize:'14px'}}>Official: {country.officialName}</p>}
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
              {country.capital && <span style={{background:'rgba(255,255,255,0.6)',color:'#374151',padding:'4px 14px',borderRadius:'999px',fontSize:'13px'}}>🏙 {country.capital}</span>}
              {country.languages?.[0] && <span style={{background:'rgba(255,255,255,0.6)',color:'#374151',padding:'4px 14px',borderRadius:'999px',fontSize:'13px'}}>🗣 {country.languages[0]}</span>}
              {country.currencies?.[0] && <span style={{background:'rgba(255,255,255,0.6)',color:'#374151',padding:'4px 14px',borderRadius:'999px',fontSize:'13px'}}>💰 {country.currencies[0].code}</span>}
              {country.timezone && <span style={{background:'rgba(255,255,255,0.6)',color:'#374151',padding:'4px 14px',borderRadius:'999px',fontSize:'13px'}}>🕐 {country.timezone}</span>}
            </div>
          </div>
        </div>

        <div style={{display:'flex',flexWrap:'wrap',gap:'20px'}}>
          {/* Key facts */}
          <div style={{flex:'2 1 400px',background:'white',borderRadius:'20px',padding:'24px',border:'1px solid #e2e8f0'}}>
            <h3 style={{fontSize:'16px',fontWeight:700,color:'#1e293b',margin:'0 0 16px'}}>Key Facts</h3>
            <div style={{display:'flex',flexWrap:'wrap',gap:'12px'}}>
              {[
                { label:'Population', value: country.population ? (country.population/1e6).toFixed(1)+'M' : 'N/A', icon:'👥' },
                { label:'Area', value: country.area ? country.area.toLocaleString()+' km²' : 'N/A', icon:'📐' },
                { label:'Drive Side', value: country.drivingSide || 'N/A', icon:'🚗' },
                { label:'Calling Code', value: country.callingCodes?.[0] || 'N/A', icon:'📞' },
              ].map(f => (
                <div key={f.label} style={{flex:'1 1 120px',textAlign:'center',padding:'14px',background:'#f8f7ff',borderRadius:'14px'}}>
                  <div style={{fontSize:'22px',marginBottom:'6px'}}>{f.icon}</div>
                  <div style={{fontWeight:700,color:'#1e293b',fontSize:'14px'}}>{f.value}</div>
                  <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'2px'}}>{f.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather widget */}
          <div style={{flex:'1 1 220px',background:'linear-gradient(135deg, rgba(222,226,255,0.5), rgba(203,192,211,0.3))',borderRadius:'20px',padding:'24px',border:'1px solid #e2e8f0'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
              <h3 style={{fontSize:'16px',fontWeight:700,color:'#1e293b',margin:0}}>Live Weather</h3>
              <span style={{fontSize:'12px',color:'#94a3b8'}}>{country.capital}</span>
            </div>
            {weather ? (
              <div style={{textAlign:'center'}}>
                <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="weather" style={{width:'64px',height:'64px'}} />
                <div style={{fontSize:'36px',fontWeight:900,color:'#1e293b'}}>{weather.temp}°C</div>
                <div style={{fontSize:'13px',color:'#64748b',textTransform:'capitalize'}}>{weather.description}</div>
                <div style={{display:'flex',justifyContent:'center',gap:'16px',marginTop:'12px',fontSize:'12px',color:'#94a3b8'}}>
                  <span>💧 {weather.humidity}%</span>
                  <span>💨 {weather.windSpeed} m/s</span>
                </div>
                <div style={{fontSize:'11px',color:'#cbd5e1',marginTop:'8px'}}>OpenWeatherMap API</div>
              </div>
            ) : (
              <div style={{textAlign:'center',color:'#94a3b8',padding:'20px 0',fontSize:'14px'}}>Weather unavailable</div>
            )}
          </div>
        </div>
      </main>

      {/* Plan Trip Modal */}
      <Modal isOpen={tripModal} onClose={() => setTripModal(false)} title={`Plan a Trip to ${country.name} ${country.flag}`}>
        {tripSuccess ? (
          <div style={{textAlign:'center',padding:'20px',color:'#059669',fontSize:'16px',fontWeight:600}}>✅ Trip created successfully!</div>
        ) : (
          <form onSubmit={handleTripSubmit}>
            {tripError && <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'10px',padding:'10px',color:'#dc2626',fontSize:'13px',marginBottom:'14px'}}>{tripError}</div>}
            <FormInput label="Trip Title" name="title" type="text" placeholder="e.g. Tokyo Cherry Blossom Trip" value={tripForm.title} onChange={e => setTripForm(p => ({...p, title: e.target.value}))} required />
            <div style={{display:'flex',gap:'12px'}}>
              <div style={{flex:1}}><FormInput label="Start Date" name="startDate" type="date" value={tripForm.startDate} onChange={e => setTripForm(p => ({...p, startDate: e.target.value}))} required /></div>
              <div style={{flex:1}}><FormInput label="End Date" name="endDate" type="date" value={tripForm.endDate} onChange={e => setTripForm(p => ({...p, endDate: e.target.value}))} required /></div>
            </div>
            <div style={{marginBottom:'16px'}}>
              <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}}>Notes</label>
              <textarea rows={3} placeholder="What are you excited about?" value={tripForm.description} onChange={e => setTripForm(p => ({...p, description: e.target.value}))}
                style={{width:'100%',padding:'10px 14px',border:'1px solid #e2e8f0',borderRadius:'12px',fontSize:'14px',outline:'none',resize:'none',boxSizing:'border-box',fontFamily:"'Urbanist',sans-serif"}} />
            </div>
            <div style={{display:'flex',gap:'10px'}}>
              <Button type="button" variant="ghost" onClick={() => setTripModal(false)} style={{flex:1,borderRadius:'12px',padding:'12px'}}>Cancel</Button>
              <Button type="submit" loading={tripSaving} style={{flex:1,borderRadius:'12px',padding:'12px'}}>Save Trip</Button>
            </div>
          </form>
        )}
      </Modal>
    </AppLayout>
  );
}
