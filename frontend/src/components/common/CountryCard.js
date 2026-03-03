import { Link } from 'react-router-dom';

const gradients = [
  'linear-gradient(135deg, #DEE2FF, rgba(99,107,171,0.4))',
  'linear-gradient(135deg, #EFD3D7, #CBC0D3)',
  'linear-gradient(135deg, #CBC0D3, #DEE2FF)',
  'linear-gradient(135deg, #EFD3D7, #DEE2FF)',
];

export default function CountryCard({ country, index = 0 }) {
  return (
    <Link to={`/explore/${encodeURIComponent(country.name)}`}
      style={{display:'block',background:'white',borderRadius:'20px',overflow:'hidden',border:'1px solid #e2e8f0',textDecoration:'none',transition:'all 0.3s'}}>
      <div style={{height:'110px',background:gradients[index % 4],display:'flex',alignItems:'center',justifyContent:'center',fontSize:'50px',position:'relative'}}>
        {country.flag || '🌍'}
      </div>
      <div style={{padding:'12px 14px'}}>
        <div style={{fontWeight:700,fontSize:'14px',color:'#1e293b'}}>{country.name}</div>
        <div style={{fontSize:'12px',color:'#94a3b8',marginTop:'2px'}}>{country.region} · {country.capital}</div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:'8px',alignItems:'center'}}>
          <span style={{fontSize:'11px',color:'#94a3b8'}}>{country.currencies?.[0]?.symbol} {country.currencies?.[0]?.code}</span>
          <span style={{fontSize:'12px',color:'#636BAB',fontWeight:600}}>View →</span>
        </div>
      </div>
    </Link>
  );
}
