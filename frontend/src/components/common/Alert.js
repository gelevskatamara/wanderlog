const variants = {
  error:   'bg-red-50 border border-red-200 text-red-600',
  success: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
  info:    'bg-blue-50 border border-blue-200 text-blue-700',
  warning: 'bg-amber-50 border border-amber-200 text-amber-700',
};

export default function Alert({ type = 'error', message }) {
  if (!message) return null;
  return (
    <div className={`${variants[type]} rounded-xl px-4 py-3 text-sm mb-4`}>
      {message}
    </div>
  );
}
