import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function Auth() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // 1. Toggle between 'LOGIN' and 'REGISTER' modes
  const [isLoginView, setIsLoginView] = useState(true);
  // 2. Toggle between 'USER' and 'ADMIN' roles
  const [role, setRole] = useState('USER');
  
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginView) {
        // LOGIN LOGIC
        const { data } = await authAPI.login({ email: form.email, password: form.password, role });
        login(data);
        data.role === 'ADMIN' ? navigate('/dashboard') : navigate('/public-surveys');
      } else {
        // REGISTER LOGIC
        const { data } = await authAPI.register({ ...form, role });
        login(data);
        data.role === 'ADMIN' ? navigate('/dashboard') : navigate('/public-surveys');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 transition-all">
      <div className="w-full max-w-md">
        
        {/* Role Toggles (From your image) */}
        

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
            {role} {isLoginView ? 'Sign In' : 'Registration'}
          </h1>
          <p className="text-slate-400 mt-1">
            {isLoginView ? 'Access your SurveyFlow account' : 'Join our survey community'}
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 p-8 shadow-2xl">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-8">
          <button
            onClick={() => setRole('USER')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              role === 'USER' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >User</button>
          <button
            onClick={() => setRole('ADMIN')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              role === 'ADMIN' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >Admin</button>
        </div>
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Show Full Name field ONLY in Register mode */}
            {!isLoginView && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text" required
                  value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              {loading ? 'Processing...' : (isLoginView ? `Sign in as ${role}` : `Register as ${role}`)}
            </button>
          </form>

          {/* Dynamic Navigation Logic */}
          <div className="text-center mt-6">
            {isLoginView ? (
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <button 
                  onClick={() => setIsLoginView(false)} 
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Register
                </button>
              </p>
            ) : (
              <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <button 
                  onClick={() => setIsLoginView(true)} 
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
