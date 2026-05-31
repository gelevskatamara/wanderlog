import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-content pt-14 lg:pt-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}