import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../services/api';
import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import useForm from '../hooks/useForm';

const validate = (v) => {
  const e = {};
  if (!v.email || !/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Valid email required';
  if (!v.password || v.password.length < 6) e.password = 'Password must be at least 6 characters';
  return e;
};

const validateReg = (v) => {
  const e = {};
  if (!v.name || !/^[a-zA-Z\s]{2,}$/.test(v.name)) e.name = 'Name must be at least 2 letters';
  if (!v.email || !/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Valid email required';
  if (!v.password || v.password.length < 6) e.password = 'At least 6 characters';
  if (v.password !== v.confirm) e.confirm = 'Passwords do not match';
  return e;
};

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [apiError, setApiError] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const loginForm = useForm({ email: '', password: '' }, validate);
  const regForm = useForm({ name: '', email: '', password: '', confirm: '' }, validateReg);

  const handleLogin = async (values) => {
    setApiError(''); setApiLoading(true);
    try {
      const res = await login(values);
      loginUser(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed');
    } finally { setApiLoading(false); }
  };

  const handleRegister = async (values) => {
    setApiError(''); setApiLoading(true);
    try {
      const res = await register({ name: values.name, email: values.email, password: values.password });
      loginUser(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed');
    } finally { setApiLoading(false); }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',fontFamily:"'Urbanist',sans-serif",background:'linear-gradient(135deg, #EFD3D7, #CBC0D3, #DEE2FF)'}}>
      {/* Left panel */}
      <div style={{flex:1,display:'none',alignItems:'center',justifyContent:'center',padding:'60px',flexDirection:'column',gap:'24px',background:'linear-gradient(135deg,rgba(99,107,171,0.15),rgba(239,211,215,0.2))'}}>
        <div style={{fontSize:'80px'}}>🌍</div>
        <h2 style={{fontSize:'32px',fontWeight:900,color:'#1e293b',textAlign:'center',margin:0,lineHeight:1.2}}>Log your journeys,<br/>explore the world</h2>
        <p style={{color:'#64748b',textAlign:'center',maxWidth:'360px',lineHeight:1.6}}>Plan trips, discover 195 countries with live weather, and build your personal travel journal.</p>
      </div>

      {/* Right panel - form */}
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
        <div style={{background:'white',borderRadius:'24px',padding:'40px',width:'100%',maxWidth:'420px',boxShadow:'0 20px 40px rgba(0,0,0,0.08)'}}>
          <div style={{textAlign:'center',marginBottom:'28px'}}>
            <a href="/" style={{fontWeight:900,fontSize:'22px',color:'#1e293b',textDecoration:'none'}}>🌍 WanderLog</a>
            <div style={{display:'flex',gap:'0',marginTop:'20px',border:'1px solid #e2e8f0',borderRadius:'12px',overflow:'hidden'}}>
              {['login','register'].map(m => (
                <button key={m} onClick={() => { setMode(m); setApiError(''); }}
                  style={{flex:1,padding:'10px',border:'none',cursor:'pointer',fontSize:'14px',fontWeight:600,fontFamily:"'Urbanist',sans-serif",
                    background: mode===m ? '#636BAB' : 'transparent',
                    color: mode===m ? 'white' : '#64748b',
                    transition:'all 0.2s',
                  }}>
                  {m === 'login' ? 'Log in' : 'Register'}
                </button>
              ))}
            </div>
          </div>

          {apiError && <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'10px',padding:'10px 14px',color:'#dc2626',fontSize:'13px',marginBottom:'16px'}}>{apiError}</div>}

          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)}>
              <FormInput label="Email" name="email" type="email" placeholder="you@example.com" value={loginForm.values.email} onChange={loginForm.handleChange} onBlur={loginForm.handleBlur} error={loginForm.touched.email && loginForm.errors.email} required />
              <FormInput label="Password" name="password" type="password" placeholder="••••••••" value={loginForm.values.password} onChange={loginForm.handleChange} onBlur={loginForm.handleBlur} error={loginForm.touched.password && loginForm.errors.password} required />
              <Button type="submit" loading={apiLoading} style={{width:'100%',borderRadius:'12px',padding:'12px'}}>Sign in</Button>
            </form>
          ) : (
            <form onSubmit={regForm.handleSubmit(handleRegister)}>
              <FormInput label="Full Name" name="name" type="text" placeholder="Alex Johnson" value={regForm.values.name} onChange={regForm.handleChange} onBlur={regForm.handleBlur} error={regForm.touched.name && regForm.errors.name} required />
              <FormInput label="Email" name="email" type="email" placeholder="you@example.com" value={regForm.values.email} onChange={regForm.handleChange} onBlur={regForm.handleBlur} error={regForm.touched.email && regForm.errors.email} required />
              <FormInput label="Password" name="password" type="password" placeholder="Min 6 characters" value={regForm.values.password} onChange={regForm.handleChange} onBlur={regForm.handleBlur} error={regForm.touched.password && regForm.errors.password} required />
              <FormInput label="Confirm Password" name="confirm" type="password" placeholder="Repeat password" value={regForm.values.confirm} onChange={regForm.handleChange} onBlur={regForm.handleBlur} error={regForm.touched.confirm && regForm.errors.confirm} required />
              <Button type="submit" loading={apiLoading} style={{width:'100%',borderRadius:'12px',padding:'12px'}}>Create Account</Button>
            </form>
          )}

          <p style={{textAlign:'center',fontSize:'13px',color:'#94a3b8',marginTop:'16px'}}>
            <Link to="/" style={{color:'#636BAB',textDecoration:'none'}}>← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
