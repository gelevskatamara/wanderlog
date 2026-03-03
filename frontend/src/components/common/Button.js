export default function Button({ children, variant = 'primary', loading, style: extraStyle, ...props }) {
  const styles = {
    primary: { background: 'linear-gradient(135deg, #636BAB, #8E9AAF)', color: 'white', border: 'none' },
    secondary: { background: 'transparent', color: '#636BAB', border: '1px solid #636BAB' },
    danger: { background: '#ef4444', color: 'white', border: 'none' },
    ghost: { background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0' },
  };
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{
        padding:'10px 20px', borderRadius:'50px', fontWeight:600, fontSize:'14px',
        cursor: loading || props.disabled ? 'not-allowed' : 'pointer',
        opacity: loading || props.disabled ? 0.7 : 1,
        transition:'all 0.2s', fontFamily:"'Urbanist',sans-serif",
        ...styles[variant], ...extraStyle,
      }}
    >
      {loading ? '...' : children}
    </button>
  );
}
