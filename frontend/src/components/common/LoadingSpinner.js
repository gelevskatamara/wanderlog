export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'60px',gap:'16px'}}>
      <div style={{width:'40px',height:'40px',border:'4px solid #e2e8f0',borderTopColor:'#636BAB',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{color:'#94a3b8',fontSize:'14px',margin:0}}>{text}</p>
    </div>
  );
}
