const variants = {
  primary: 'btn-primary',
  secondary: 'btn-outline',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
  dark: 'btn-dark',
};

export default function Button({ children, variant = 'primary', loading, className = '', ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${variants[variant]} ${loading || props.disabled ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading...
        </span>
      ) : children}
    </button>
  );
}
