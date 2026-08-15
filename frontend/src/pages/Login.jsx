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
    <div className="flex min-h-screen items-center justify-center bg-ink p-4">
      <ScanFrame className="w-full max-w-sm">
        <div className="rounded-lg border border-white/10 bg-ink-light p-6 text-white shadow-xl">
          <p className="font-mono text-xs uppercase tracking-wider text-steel">
            FTI UKSW / SARPRAS
          </p>
          <h1 className="mt-2 font-display text-xl font-bold tracking-tight text-white">
            Sistem Manajemen Aset
          </h1>
          <p className="mt-1 text-sm text-steel">
            Masuk untuk mengelola aset dan pemeliharaan
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Kata sandi"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            {error && <p className="text-sm text-rust-light">{error}</p>}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Memeriksa...' : 'Masuk'}
            </Button>
          </form>
        </div>
      </ScanFrame>
    </div>
  );
}

export default Login;
