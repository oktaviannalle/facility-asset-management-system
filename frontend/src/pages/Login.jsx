import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch {
      setError("Email atau kata sandi salah.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (email, password) => {
    setForm({ email, password });
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      // Fallback try user@sarpras.test or admin@sarpras.test if custom domain failed
      try {
        await login("user@sarpras.test", "password");
        navigate("/");
      } catch {
        setError("Gagal login akun demo. Pastikan database seeder aktif.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-100 dark:bg-slate-950 font-sans">
      {/* Split-Screen Left Side: FTI UKSW Building Photo (Figma Style) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img
          src="/fti_building.jpg"
          alt="Gedung FTI UKSW"
          className="absolute inset-0 h-full w-full object-cover object-center transform scale-105 transition-transform duration-1000"
        />
        {/* Navy Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-blue-950/40" />

        {/* Content on Image Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          {/* Top Brand Tag */}
          <div className="flex items-center gap-3">
            <img
              src="/ftiuksw.png"
              alt="Logo FTI UKSW"
              className="h-12 w-12 object-contain bg-white/10 p-1.5 rounded-full backdrop-blur-md border border-white/20"
            />
            <div>
              <span className="font-display font-black tracking-wider text-xl text-white block">
                FTI UKSW
              </span>
              <span className="text-xs text-blue-200 block font-medium">
                Fakultas Teknologi Informasi
              </span>
            </div>
          </div>

          {/* Bottom Hero Caption */}
          <div className="space-y-3 max-w-lg mb-6">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white leading-tight">
              Pencatatan & Pemantauan Aset Terintegrasi FTI UKSW
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Mewujudkan kelancaran operasional sarana dan prasarana kampus
              melalui pengelolaan inventaris yang transparan, presisi, dan
              real-time.
            </p>
          </div>
        </div>
      </div>

      {/* Split-Screen Right Side: Login Form Panel */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 lg:w-1/2 bg-white dark:bg-slate-900 transition-colors">
        <div className="w-full max-w-md space-y-6">
          {/* Header Logo & SIMAFTI Branding */}
          <div className="text-center">
            <img
              src="/ftiuksw.png"
              alt="Logo FTI UKSW"
              className="mx-auto h-20 w-20 object-contain mb-3 drop-shadow-md"
            />
            <h1 className="font-display text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              SIMAFTI
            </h1>
            <p className="text-xs font-mono font-bold text-blue-900 dark:text-blue-400 tracking-wider uppercase mt-0.5">
              SISTEM MANAJEMEN ASET FTI
            </p>
            <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              Portal internal untuk pencatatan dan pemantauan aset FTI UKSW
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Username / Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="user@fti.uksw.edu"
            />

            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Input your password account"
            />

            {/* Remember Me & Forgot Password Helper */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-blue-900 focus:ring-blue-800 h-4 w-4 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    "Silakan hubungi administrator SIMAFTI FTI UKSW untuk reset kata sandi.",
                  );
                }}
                className="text-slate-500 hover:text-blue-900 dark:text-slate-400 dark:hover:text-blue-400 hover:underline font-medium"
              >
                Forgot Password?
              </a>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 p-3.5 text-xs text-red-700 dark:text-red-300 flex items-center gap-2.5">
                <svg
                  className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-3 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl shadow-lg shadow-blue-950/20 text-sm transition-all cursor-pointer"
              loading={submitting}
            >
              {submitting ? "Logging in..." : "Login"}
            </Button>

            {/* Simple Demo Login Button Below Login Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("user@fti.uksw.edu", "password")}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>Masuk Mode Demo User (Read-Only)</span>
              </button>
            </div>
          </form>

          {/* Footer Copyright */}
          <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Fakultas Teknologi Informasi — Universitas Kristen Satya Wacana ©
              2023
              <br />© Oktavian Alle Mahenswa Putra
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
