import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../services/api';
import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import useForm from '../hooks/useForm';

const validateLogin = (v) => {
  const e = {};
  if (!v.email || !/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Valid email required';
  if (!v.password || v.password.length < 6) e.password = 'At least 6 characters';
  return e;
};

const validateRegister = (v) => {
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

  const loginForm = useForm({ email: '', password: '' }, validateLogin);
  const regForm = useForm({ name: '', email: '', password: '', confirm: '' }, validateRegister);

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
    <div className="min-h-screen flex font-urbanist bg-gradient-to-br from-soft-pink via-soft-purple to-primary-light">

      {/* Left panel - hidden on mobile */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 gap-8">
        <div className="block">
          <img src="images/logo.svg" alt="WanderLog" className="w-auto h-[45px] min-[480px]:h-[85px]" />
        </div>
        <h2 className="text-4xl font-black text-slate-800 text-center leading-tight">
          Log your journeys,<span className="block text-primary">explore the world</span>
        </h2>
        <p className="text-slate-500 text-center max-w-sm leading-relaxed">
          Plan trips, discover 195 countries with live weather, and build your personal travel journal.
        </p>
        {/* Stats */}
        <div className="flex gap-8 mt-4">
          {[['1,200+', 'Travellers'], ['195', 'Countries'], ['4,800+', 'Trips']].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-primary">{val}</div>
              <div className="text-xs text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-md">

          {/* Logo */}
          <div className="flex flex-row items-center justify-center -mx-1 mb-5">
            <div className="px-1">
              <img src="images/logo.svg" alt="WanderLog" className="w-auto h-[45px] min-[480px]:h-[45px]" />
            </div>
            <div className="px-1 text-2xl font-black text-primary">WanderLog</div>
          </div>

          {/* Tab switcher */}
          <div className="flex border border-slate-100 rounded-xl overflow-hidden mb-6">
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setApiError(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? 'bg-primary text-white'
                    : 'bg-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {m === 'login' ? 'Log in' : 'Register'}
              </button>
            ))}
          </div>

          <Alert type="error" message={apiError} />

          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)}>
              <FormInput
                label="Email" name="email" type="email" placeholder="you@example.com"
                value={loginForm.values.email}
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
                error={loginForm.touched.email && loginForm.errors.email}
                required
              />
              <FormInput
                label="Password" name="password" type="password" placeholder="••••••••"
                value={loginForm.values.password}
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
                error={loginForm.touched.password && loginForm.errors.password}
                required
              />
              <Button type="submit" loading={apiLoading} className="w-full rounded-xl py-3 mt-2">
                Sign in
              </Button>
            </form>
          ) : (
            <form onSubmit={regForm.handleSubmit(handleRegister)}>
              <FormInput
                label="Full Name" name="name" type="text" placeholder="Alex Johnson"
                value={regForm.values.name}
                onChange={regForm.handleChange}
                onBlur={regForm.handleBlur}
                error={regForm.touched.name && regForm.errors.name}
                required
              />
              <FormInput
                label="Email" name="email" type="email" placeholder="you@example.com"
                value={regForm.values.email}
                onChange={regForm.handleChange}
                onBlur={regForm.handleBlur}
                error={regForm.touched.email && regForm.errors.email}
                required
              />
              <FormInput
                label="Password" name="password" type="password" placeholder="Min 6 characters"
                value={regForm.values.password}
                onChange={regForm.handleChange}
                onBlur={regForm.handleBlur}
                error={regForm.touched.password && regForm.errors.password}
                required
              />
              <FormInput
                label="Confirm Password" name="confirm" type="password" placeholder="Repeat password"
                value={regForm.values.confirm}
                onChange={regForm.handleChange}
                onBlur={regForm.handleBlur}
                error={regForm.touched.confirm && regForm.errors.confirm}
                required
              />
              <Button type="submit" loading={apiLoading} className="w-full rounded-xl py-3 mt-2">
                Create Account
              </Button>
            </form>
          )}

          <p className="text-center text-xs text-slate-400 mt-6">
            <Link to="/" className="text-primary hover:underline">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
