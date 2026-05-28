export default function FormSelect({ label, error, required, children, className = '', ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        {...props}
        className={`form-input bg-white ${error ? 'border-red-400' : ''} ${className}`}
      >
        {children}
      </select>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
