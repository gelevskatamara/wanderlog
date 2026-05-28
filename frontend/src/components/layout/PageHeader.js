export default function PageHeader({ title, subtitle, action }) {
  return (
    <header className="page-header flex-wrap gap-3">
      <div className="min-w-0">
        <h1 className="text-lg sm:text-xl font-black text-slate-800 leading-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 truncate">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">{action}</div>
      )}
    </header>
  );
}
