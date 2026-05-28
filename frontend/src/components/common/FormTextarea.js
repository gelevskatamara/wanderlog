export default function FormTextarea({ label, error, required, className = '', maxLength, value, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        {...props}
        value={value}
        maxLength={maxLength}
        className={`form-input resize-none ${error ? 'border-red-400 focus:border-red-400' : ''} ${className}`}
      />
      {maxLength && (
        <p className="text-xs text-slate-400 text-right mt-1">
          {value?.length || 0}/{maxLength}
        </p>
      )}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
