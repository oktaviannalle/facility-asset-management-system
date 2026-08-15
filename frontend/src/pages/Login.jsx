import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ScanFrame from '../components/ui/ScanFrame';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch {
      setError('Email atau kata sandi salah.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <ScanFrame className="w-full max-w-md z-10">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-white shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-400">
              FTI UKSW / SARPRAS
            </span>
          </div>

          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Sistem Manajemen Aset
          </h1>
          <p className="mt-1.5 text-sm text-slate-300">
            Masuk untuk mengelola aset, lokasi, dan pemeliharaan
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Input
              label="Email"
              type="email"
              required
              dark
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="nama@sarpras.test"
            />
            <Input
              label="Kata Sandi"
              type="password"
              required
              dark
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />

            {error && (
              <div className="rounded-lg bg-red-950/60 border border-red-800/80 p-3 text-sm text-red-200 flex items-center gap-2">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-3 text-base font-semibold shadow-lg shadow-blue-600/30"
              loading={submitting}
            >
              {submitting ? 'Memeriksa...' : 'Masuk ke Sistem'}
            </Button>
          </form>
        </div>
      </ScanFrame>
    </div>
  );
}

export default Login;
