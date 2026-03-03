export default function FormInput({ label, error, required, ...props }) {
  return (
    <div style={{marginBottom:'16px'}}>
      {label && (
        <label style={{display:'block',fontSize:'13px',fontWeight:600,color:'#374151',marginBottom:'6px'}}>
          {label}{required && <span style={{color:'#ef4444'}}> *</span>}
        </label>
      )}
      <input
        {...props}
        style={{
          width:'100%',padding:'10px 14px',border:`1px solid ${error ? '#ef4444' : '#e2e8f0'}`,
          borderRadius:'12px',fontSize:'14px',outline:'none',boxSizing:'border-box',
          fontFamily:"'Urbanist',sans-serif",
          transition:'border-color 0.2s',
          ...props.style,
        }}
        onFocus={e => { e.target.style.borderColor = '#636BAB'; }}
        onBlur={e => { e.target.style.borderColor = error ? '#ef4444' : '#e2e8f0'; if (props.onBlur) props.onBlur(e); }}
      />
      {error && <p style={{fontSize:'12px',color:'#ef4444',margin:'4px 0 0'}}>{error}</p>}
    </div>
  );
}
