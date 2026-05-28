import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import FormTextarea from '../components/common/FormTextarea';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { SuccessIcon } from '../components/common/Icons';
import { PopulationIcon, AreaIcon, DriveIcon, PhoneIcon, BuildingIcon, CurrencyIcon, LanguageIcon, TimeIcon, WeatherIcon } from '../components/common/Icons';
import { getCountry, getWeather, createTrip } from '../services/api';
import useCountryPhoto from '../hooks/useCountryPhoto';
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
  const { photo: countryPhoto } = useCountryPhoto(country?.name);

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
      setTimeout(() => {
        setTripModal(false);
        setTripSuccess(false);
        setTripForm({ title: '', startDate: '', endDate: '', description: '' });
      }, 1500);
    } catch (err) {
      setTripError(err.response?.data?.message || 'Failed to create trip');
    } finally { setTripSaving(false); }
  };

  if (loading) return <AppLayout><LoadingSpinner /></AppLayout>;
  if (!country) return (
    <AppLayout>
      <PageWrapper>
        <div className="text-center py-20 text-slate-400">Country not found</div>
      </PageWrapper>
    </AppLayout>
  );

  const facts = [
    { icon: <PopulationIcon className="w-5 h-5" />, label: 'Population', value: country.population ? (country.population / 1e6).toFixed(1) + 'M' : 'N/A' },
    { icon: <AreaIcon className="w-5 h-5" />, label: 'Area',       value: country.area ? country.area.toLocaleString() + ' km²' : 'N/A' },
    { icon: <DriveIcon className="w-5 h-5" />, label: 'Drive Side', value: country.drivingSide || 'N/A' },
    { icon: <PhoneIcon className="w-5 h-5" />, label: 'Calling',    value: country.callingCodes?.[0] || 'N/A' },
  ];

  return (
    <AppLayout>
      <PageHeader
        title={`${country.flag || '🌍'} ${country.name}`}
        subtitle={`${country.region}${country.subregion ? ' · ' + country.subregion : ''}`}
        action={user?.role !== 'guest' && (
          <Button onClick={() => setTripModal(true)} className="text-sm px-4 py-2">
            + Plan a Trip
          </Button>
        )}
      />
      <PageWrapper>

        {/* Hero banner with photo */}
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden mb-6 relative h-48 sm:h-64 bg-gradient-to-br from-primary-light via-soft-purple to-soft-pink">

          {/* Placeholder — always visible under the photo */}
          <div className="absolute inset-0 flex items-center justify-center">
            {country.flagUrl ? (
              <img src={country.flagUrl} alt="" className="w-32 h-20 object-cover rounded-xl shadow-lg opacity-40" />
            ) : (
              <span className="text-8xl opacity-30">{country.flag || '🌍'}</span>
            )}
          </div>

          {/* Real photo fades in on top */}
          {countryPhoto?.url && (
            <img src={countryPhoto.url} alt="" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700" />
          )}

          {/* Loading shimmer */}
          {!countryPhoto && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          )}

          {/* Gradient overlay so text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Flag badge top-right */}
          <div className="absolute top-4 right-4 z-10">
            {country.flagUrl ? (
              <div className="w-12 h-8 rounded-md shadow-lg overflow-hidden border-2 border-white/40">
                <img src={country.flagUrl} alt="" className="w-full h-full object-cover" />
              </div>
            ) : country.flag ? (
              <span className="text-3xl drop-shadow-lg">{country.flag}</span>
            ) : null}
          </div>

          {/* Country info bottom-left */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 drop-shadow">{country.name}</h2>
            <div className="flex flex-wrap gap-2">
              {country.capital && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/20">🏙 {country.capital}</span>
              )}
              {country.languages?.[0] && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/20">🗣 {country.languages[0]}</span>
              )}
              {country.currencies?.[0] && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/20">💰 {country.currencies[0].code}</span>
              )}
              {country.timezone && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/20">🕐 {country.timezone}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-6">

          {/* Key facts */}
          <div className="card p-4 sm:p-6 flex-1 basis-full lg:basis-[400px]">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-4">Key Facts</h3>
            <div className="flex flex-wrap gap-3">
              {facts.map(f => (
                <div key={f.label} className="flex-1 basis-28 text-center p-3 sm:p-4 bg-soft-blue rounded-xl">
                  <div className="flex justify-center mb-2 text-primary">{f.icon}</div>
                  <div className="font-bold text-slate-800 text-sm">{f.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{f.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather widget */}
          <div className="card p-4 sm:p-6 flex-1 basis-full sm:basis-60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm sm:text-base font-bold text-slate-800">Live Weather</h3>
              <span className="text-xs text-slate-400">{country.capital}</span>
            </div>
            {weather ? (
              <div className="text-center">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt="weather icon"
                  className="w-16 h-16 mx-auto"
                />
                <div className="text-4xl font-black text-slate-800">{weather.temp}°C</div>
                <div className="text-sm text-slate-500 capitalize mt-1">{weather.description}</div>
                <div className="flex justify-center gap-4 mt-3 text-xs text-slate-400">
                  <span>💧 {weather.humidity}%</span>
                  <span>💨 {weather.windSpeed} m/s</span>
                </div>
                <p className="text-xs text-slate-300 mt-3">OpenWeatherMap API</p>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                <div className="flex justify-center mb-2 text-primary"><WeatherIcon className="w-8 h-8" /></div>
                Weather unavailable
              </div>
            )}
          </div>

        </div>
      </PageWrapper>

      {/* Plan Trip Modal */}
      <Modal isOpen={tripModal} onClose={() => setTripModal(false)} title={`Plan a Trip to ${country.name} ${country.flag}`}>
        {tripSuccess ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-3 text-emerald-500"><SuccessIcon className="w-12 h-12" /></div>
            <p className="text-emerald-600 font-semibold">Trip created successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleTripSubmit}>
            <Alert type="error" message={tripError} />
            <FormInput
              label="Trip Title" name="title" type="text"
              placeholder="e.g. Tokyo Cherry Blossom Trip"
              value={tripForm.title}
              onChange={e => setTripForm(p => ({ ...p, title: e.target.value }))}
              required
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <FormInput label="Start Date" name="startDate" type="date" value={tripForm.startDate} onChange={e => setTripForm(p => ({ ...p, startDate: e.target.value }))} required />
              </div>
              <div className="flex-1">
                <FormInput label="End Date" name="endDate" type="date" value={tripForm.endDate} onChange={e => setTripForm(p => ({ ...p, endDate: e.target.value }))} required />
              </div>
            </div>
            <FormTextarea
              label="Notes" rows={3} placeholder="What are you excited about?"
              value={tripForm.description} maxLength={500}
              onChange={e => setTripForm(p => ({ ...p, description: e.target.value }))}
            />
            <div className="flex gap-3 mt-2">
              <Button type="button" variant="ghost" onClick={() => setTripModal(false)} className="flex-1">Cancel</Button>
              <Button type="submit" loading={tripSaving} className="flex-1">Save Trip</Button>
            </div>
          </form>
        )}
      </Modal>
    </AppLayout>
  );
}