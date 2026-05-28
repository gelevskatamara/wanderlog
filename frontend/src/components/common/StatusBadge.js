const badgeClass = {
  planned:   'badge-planned',
  ongoing:   'badge-ongoing',
  completed: 'badge-completed',
  admin:     'badge-admin',
  user:      'badge-user',
  guest:     'badge-guest',
};

export default function StatusBadge({ status }) {
  const cls = badgeClass[status] || 'badge-guest';
  return (
    <span className={cls}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}
