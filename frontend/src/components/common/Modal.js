import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = '480px' }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.4)',backdropFilter:'blur(4px)'}} onClick={onClose} />
      <div style={{background:'white',borderRadius:'24px',boxShadow:'0 25px 50px rgba(0,0,0,0.15)',width:'100%',maxWidth,position:'relative',zIndex:1,padding:'24px',maxHeight:'90vh',overflowY:'auto'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
          <h3 style={{fontSize:'18px',fontWeight:900,color:'#1e293b',margin:0}}>{title}</h3>
          <button onClick={onClose} style={{width:'32px',height:'32px',borderRadius:'50%',background:'#f1f5f9',border:'none',cursor:'pointer',fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
