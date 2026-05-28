import { Link } from 'react-router-dom';
import useCountryPhoto from '../../hooks/useCountryPhoto';

const gradients = [
  'from-primary-light to-primary/40',
  'from-soft-pink to-soft-purple',
  'from-soft-purple to-primary-light',
  'from-soft-pink to-primary-light',
];

export default function CountryCard({ country, index = 0 }) {
  const { photo, loading } = useCountryPhoto(country.name);

  return (
    <Link
      to={`/explore/${encodeURIComponent(country.name)}`}
      className="card-hover block overflow-hidden no-underline group"
    >
      {/* Photo area */}
      <div className={`h-32 relative overflow-hidden bg-gradient-to-br ${gradients[index % 4]}`}>

        {/* Placeholder — flag centered, always visible until photo loads */}
        <div className="absolute inset-0 flex items-center justify-center">
          {country.flagUrl ? (
            <img
              src={country.flagUrl}
              alt=""
              className="w-16 h-10 object-cover rounded shadow opacity-60"
            />
          ) : (
            <span className="text-4xl opacity-70">{country.flag || '🌍'}</span>
          )}
        </div>

        {/* Real photo — fades in on top once loaded */}
        {photo && (
          <img
            src={photo.thumb}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
        )}

        {/* Loading shimmer */}
        {loading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

        {/* Flag badge top-right — always shown */}
        <div className="absolute top-2 right-2 z-10">
          {country.flagUrl ? (
            <div className="w-8 h-5 rounded shadow-md overflow-hidden border border-white/40">
              <img src={country.flagUrl} alt="" className="w-full h-full object-cover" />
            </div>
          ) : country.flag ? (
            <span className="text-lg leading-none drop-shadow">{country.flag}</span>
          ) : null}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="font-bold text-sm text-slate-800 truncate">{country.name}</div>
        <div className="text-xs text-slate-400 mt-0.5 truncate">{country.region} · {country.capital}</div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-slate-400">
            {country.currencies?.[0]?.symbol} {country.currencies?.[0]?.code}
          </span>
          <span className="text-xs text-primary font-semibold">View →</span>
        </div>
      </div>
    </Link>
  );
}