import { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import PageWrapper from '../components/layout/PageWrapper';
import CountryCard from '../components/common/CountryCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { SearchIcon, ExploreIcon } from '../components/common/Icons';
import { getCountries } from '../services/api';

const REGIONS = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania', 'Antarctic'];

export default function ExploreCountriesPage() {
  const [countries, setCountries] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [page, setPage] = useState(1);

  const fetchCountries = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 20 };
    if (search) params.search = search;
    if (region) params.region = region;
    getCountries(params)
      .then(res => { setCountries(res.data.countries); setTotal(res.data.total); setPages(res.data.pages); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, region, page]);

  useEffect(() => { fetchCountries(); }, [fetchCountries]);

  return (
    <AppLayout>
      <PageHeader title="Explore Countries" subtitle="Discover your next destination" />
      <PageWrapper>

        {/* Search + filters */}
        <div className="card p-4 sm:p-5 mb-6">
          {/* Search */}
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search countries..."
              className="form-input pl-9"
            />
          </div>
          {/* Region filters */}
          <div className="flex flex-wrap gap-2">
            {REGIONS.map(r => (
              <button
                key={r}
                onClick={() => { setRegion(r === 'All' ? '' : r); setPage(1); }}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 ${
                  (r === 'All' && !region) || r === region
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-primary hover:text-primary'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {loading ? <LoadingSpinner /> : (
          <>
            <p className="text-xs text-slate-400 mb-4">{total} countries found</p>

            {countries.length === 0 ? (
              <EmptyState icon={<ExploreIcon className="w-12 h-12" />} title="No countries found" message="Try a different search or region filter." />
            ) : (
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {countries.map((c, i) => (
                  <div key={c._id} className="w-full min-[480px]:w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] xl:w-[calc(20%-13px)]">
                    <CountryCard country={c} index={i} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors text-sm"
                >
                  ←
                </button>
                {[...Array(Math.min(5, pages))].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                        page === p
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors text-sm"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </PageWrapper>
    </AppLayout>
  );
}
