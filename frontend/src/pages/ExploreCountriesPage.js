import { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/layout/AppLayout';
import PageHeader from '../components/layout/PageHeader';
import CountryCard from '../components/common/CountryCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
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

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleRegion = (r) => { setRegion(r === 'All' ? '' : r); setPage(1); };

  return (
    <AppLayout>
      <PageHeader title="Explore Countries" subtitle="Discover your next destination" />
      <main style={{padding:'24px'}}>
        {/* Search + filters */}
        <div style={{background:'white',borderRadius:'20px',padding:'20px',border:'1px solid #e2e8f0',marginBottom:'24px'}}>
          <div style={{display:'flex',gap:'12px',marginBottom:'16px',flexWrap:'wrap'}}>
            <div style={{position:'relative',flex:'1',minWidth:'200px'}}>
              <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'16px'}}>🔍</span>
              <input value={search} onChange={handleSearch} placeholder="Search countries..."
                style={{width:'100%',padding:'10px 14px 10px 36px',border:'1px solid #e2e8f0',borderRadius:'12px',fontSize:'14px',outline:'none',boxSizing:'border-box',fontFamily:"'Urbanist',sans-serif"}} />
            </div>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
            {REGIONS.map(r => (
              <button key={r} onClick={() => handleRegion(r)}
                style={{padding:'6px 16px',borderRadius:'999px',border:'1px solid',fontSize:'13px',fontWeight:500,cursor:'pointer',fontFamily:"'Urbanist',sans-serif",transition:'all 0.2s',
                  background: (r === 'All' && !region) || r === region ? '#636BAB' : 'white',
                  color: (r === 'All' && !region) || r === region ? 'white' : '#64748b',
                  borderColor: (r === 'All' && !region) || r === region ? '#636BAB' : '#e2e8f0',
                }}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {loading ? <LoadingSpinner /> : (
          <>
            <p style={{fontSize:'13px',color:'#94a3b8',marginBottom:'16px'}}>{total} countries found</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:'16px'}}>
              {countries.map((c, i) => (
                <div key={c._id} style={{flex:'1 1 180px',maxWidth:'220px'}}>
                  <CountryCard country={c} index={i} />
                </div>
              ))}
            </div>
            {countries.length === 0 && (
              <div style={{textAlign:'center',padding:'60px',color:'#94a3b8'}}>No countries found.</div>
            )}
            {/* Pagination */}
            {pages > 1 && (
              <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'32px'}}>
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                  style={{width:'36px',height:'36px',borderRadius:'10px',border:'1px solid #e2e8f0',background:'white',cursor:page===1?'not-allowed':'pointer',opacity:page===1?0.5:1}}>←</button>
                {[...Array(Math.min(5, pages))].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      style={{width:'36px',height:'36px',borderRadius:'10px',border:'1px solid',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:"'Urbanist',sans-serif",
                        background: page===p ? '#636BAB' : 'white', color: page===p ? 'white' : '#64748b', borderColor: page===p ? '#636BAB' : '#e2e8f0'}}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page === pages}
                  style={{width:'36px',height:'36px',borderRadius:'10px',border:'1px solid #e2e8f0',background:'white',cursor:page===pages?'not-allowed':'pointer',opacity:page===pages?0.5:1}}>→</button>
              </div>
            )}
          </>
        )}
      </main>
    </AppLayout>
  );
}
