export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="spinner" />
      <p className="text-slate-400 text-sm">{text}</p>
    </div>
  );
}
