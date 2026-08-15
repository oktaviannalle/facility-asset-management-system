import { useState } from 'react';

function Input({ label, error, type = 'text', className = '', labelClassName = '', dark = false, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <label className="block text-left">
      {label && (
        <span className={`mb-1.5 block text-xs font-semibold uppercase tracking-wider ${dark ? 'text-slate-200' : 'text-slate-700'} ${labelClassName}`}>
          {label}
        </span>
      )}
      <div className="relative flex items-center">
        <input
          type={inputType}
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blueprint/20 focus:border-blueprint ${
            dark
              ? 'bg-slate-900/90 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-900'
              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 hover:border-slate-400'
          } ${isPassword ? 'pr-10' : ''} ${error ? 'border-rust focus:ring-rust/20 focus:border-rust' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 p-1 rounded-md transition-colors cursor-pointer ${
              dark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
            }`}
            title={showPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.05 10.05 0 012.122-.163c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <span className="mt-1.5 block text-xs font-medium text-rust">{error}</span>}
    </label>
  );
}

export default Input;
