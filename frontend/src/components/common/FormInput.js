export default function FormInput({ label, error, required, className = '', ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        {...props}
        className={`form-input ${error ? 'border-red-400 focus:border-red-400' : ''} ${className}`}
        onClick={e => {
          if (props.type === 'date') {
            e.target.showPicker?.();
          }
        }}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
