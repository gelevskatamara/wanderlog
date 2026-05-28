import { useState } from 'react';
import { Link } from 'react-router-dom';

const gradients = [
  'from-primary-light to-primary/40',
  'from-soft-pink to-soft-purple',
  'from-soft-purple to-primary-light',
  'from-soft-pink to-primary-light',
];

export default function CountryCard({ country, index = 0 }) {
  const [imgError, setImgError] = useState(false);
  const photoUrl = `https://source.unsplash.com/400x200/?${encodeURIComponent(country.name)},landscape,travel`;

  return (
    <Link
      to={`/explore/${encodeURIComponent(country.name)}`}
      className="card-hover block overflow-hidden no-underline group"
    >
      {/* Photo area */}
      <div className={`h-32 relative overflow-hidden bg-gradient-to-br ${gradients[index % 4]}`}>
        {!imgError && (
          <img
            src={photoUrl}
            alt={country.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

        {/* Flag badge — top right */}
        {country.flagUrl ? (
          <div className="absolute top-2 right-2 w-8 h-5 rounded shadow-md overflow-hidden border border-white/30">
            <img
              src={country.flagUrl}
              alt={`${country.name} flag`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : country.flag ? (
          <div className="absolute top-2 right-2 text-lg leading-none drop-shadow">
            {country.flag}
          </div>
        ) : null}
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
