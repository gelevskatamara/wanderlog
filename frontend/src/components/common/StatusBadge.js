const colors = {
  planned:   { bg: '#dbeafe', text: '#1d4ed8' },
  ongoing:   { bg: '#d1fae5', text: '#065f46' },
  completed: { bg: '#dcfce7', text: '#166534' },
  admin:     { bg: '#ede9fe', text: '#6d28d9' },
  user:      { bg: '#d1fae5', text: '#065f46' },
  guest:     { bg: '#f1f5f9', text: '#64748b' },
};

export default function StatusBadge({ status }) {
  const c = colors[status] || colors.guest;
  return (
    <span style={{
      background: c.bg, color: c.text,
      padding: '2px 10px', borderRadius: '999px',
      fontSize: '12px', fontWeight: 600, display: 'inline-block',
    }}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}
