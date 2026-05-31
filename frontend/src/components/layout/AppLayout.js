import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      {/* Offset for desktop sidebar, offset for mobile top bar */}
      <div className="app-content pt-14 lg:pt-0">
        {children}
      </div>
    </div>
  );
}
