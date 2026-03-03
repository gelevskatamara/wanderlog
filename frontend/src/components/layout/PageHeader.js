export default function PageHeader({ title, subtitle, action }) {
  return (
    <header style={{background:'white',borderBottom:'1px solid #e2e8f0',padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:40}}>
      <div>
        <h1 style={{fontSize:'20px',fontWeight:900,color:'#1e293b',margin:0}}>{title}</h1>
        {subtitle && <p style={{fontSize:'13px',color:'#94a3b8',margin:'2px 0 0'}}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </header>
  );
}
