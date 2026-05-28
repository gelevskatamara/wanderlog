import Button from './Button';

export default function EmptyState({ icon, title, message, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="text-primary mb-4 flex justify-center">{icon}</div>
      {title && <h3 className="text-lg font-bold text-slate-700 mb-2">{title}</h3>}
      {message && <p className="text-sm text-slate-400 mb-6 max-w-sm">{message}</p>}
      {action && onAction && (
        <Button onClick={onAction}>{action}</Button>
      )}
    </div>
  );
}
