import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#f8f7ff',fontFamily:"'Urbanist', sans-serif"}}>
      <Sidebar />
      <div style={{flex:1,marginLeft:'256px'}}>
        {children}
      </div>
    </div>
  );
}
